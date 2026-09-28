/**
 * Real-Time Market Price Service
 * Fetches real market prices matching TradingView charts and Binance streams.
 * Includes memory cache with 1.5s TTL to prevent rate limiting and provide <5ms responses.
 */

export interface MarketPriceQuote {
  price: number;
  change24h: number;
  updatedAt: number;
}

// In-memory cache
let cachedPriceMap: Record<string, MarketPriceQuote> = {};
let lastFetchTime = 0;
const CACHE_TTL_MS = 1500; // 1.5 seconds freshness

const FOREX_TICKERS = [
  "FX:EURUSD",
  "FX:GBPUSD",
  "FX:USDJPY",
  "FX_IDC:USDINR",
  "FX:AUDUSD",
  "FX:GBPJPY",
  "FX:USDCAD",
  "FX:EURGBP",
  "FX:EURTHB",
  "FX:USDBRL",
  "FX:USDMXN",
  "FX:USDCHF",
  "FX:NZDUSD",
  "FX:EURJPY",
  "FX:AUDJPY",
  "FX:CADJPY",
  "FX:EURCHF",
  "FX:GBPCAD",
  "FX:AUDCAD",
  "FX:EURAUD",
];

const CFD_TICKERS = ["TVC:GOLD", "TVC:SILVER", "PEPPERSTONE:XTIUSD", "OANDA:BCOUSD"];

const FUTURES_TICKERS = ["NYMEX:CL1!"];

const INDIA_TICKERS = [
  "NSE:NIFTY",
  "NSE:BANKNIFTY",
  "NSE:RELIANCE",
  "NSE:HDFCBANK",
  "NSE:INFY",
  "BSE:TMCV",
  "NSE:TATAMOTORS",
];

const CRYPTO_TICKERS = [
  "BINANCE:BTCUSDT",
  "BINANCE:ETHUSDT",
  "BINANCE:SOLUSDT",
  "BINANCE:BNBUSDT",
  "BINANCE:XRPUSDT",
  "BINANCE:DOGEUSDT",
  "BINANCE:ADAUSDT",
];

const AMERICA_TICKERS = [
  "NASDAQ:AAPL",
  "NASDAQ:TSLA",
  "NASDAQ:NVDA",
  "NASDAQ:META",
  "NASDAQ:AMZN",
  "NASDAQ:GOOGL",
  "NASDAQ:MSFT",
];

async function scanTradingView(url: string, tickers: string[]): Promise<Record<string, { price: number; change24h: number }>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbols: { tickers },
        columns: ["close", "change"],
      }),
      signal: AbortSignal.timeout(3500),
    });

    if (!res.ok) return {};
    const json = (await res.json()) as any;
    const map: Record<string, { price: number; change24h: number }> = {};

    if (json && Array.isArray(json.data)) {
      for (const item of json.data) {
        if (item && item.s && Array.isArray(item.d) && typeof item.d[0] === "number") {
          map[item.s] = {
            price: item.d[0],
            change24h: typeof item.d[1] === "number" ? Math.round(item.d[1] * 100) / 100 : 0,
          };
        }
      }
    }
    return map;
  } catch (err) {
    return {};
  }
}

async function fetchBinancePrices(): Promise<Record<string, { price: number; change24h: number }>> {
  try {
    const res = await fetch(
      'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT","DOGEUSDT","ADAUSDT"]',
      { signal: AbortSignal.timeout(3500) }
    );
    if (!res.ok) return {};
    const data = (await res.json()) as Array<{ symbol: string; lastPrice: string; priceChangePercent: string }>;
    const map: Record<string, { price: number; change24h: number }> = {};

    if (Array.isArray(data)) {
      for (const item of data) {
        const p = parseFloat(item.lastPrice);
        const c = parseFloat(item.priceChangePercent);
        if (!isNaN(p)) {
          map[`BINANCE:${item.symbol}`] = {
            price: p,
            change24h: isNaN(c) ? 0 : Math.round(c * 100) / 100,
          };
        }
      }
    }
    return map;
  } catch (err) {
    return {};
  }
}

export async function getLiveMarketPrices(): Promise<Record<string, MarketPriceQuote>> {
  const now = Date.now();
  if (Object.keys(cachedPriceMap).length > 0 && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedPriceMap;
  }

  try {
    const [forexRes, cfdRes, futuresRes, indiaRes, tvCryptoRes, binanceRes, americaRes] = await Promise.allSettled([
      scanTradingView("https://scanner.tradingview.com/forex/scan", FOREX_TICKERS),
      scanTradingView("https://scanner.tradingview.com/cfd/scan", CFD_TICKERS),
      scanTradingView("https://scanner.tradingview.com/futures/scan", FUTURES_TICKERS),
      scanTradingView("https://scanner.tradingview.com/india/scan", INDIA_TICKERS),
      scanTradingView("https://scanner.tradingview.com/crypto/scan", CRYPTO_TICKERS),
      fetchBinancePrices(),
      scanTradingView("https://scanner.tradingview.com/america/scan", AMERICA_TICKERS),
    ]);

    const rawPrices: Record<string, { price: number; change24h: number }> = {};

    const extract = (res: PromiseSettledResult<Record<string, { price: number; change24h: number }>>) => {
      if (res.status === "fulfilled" && res.value) {
        Object.assign(rawPrices, res.value);
      }
    };

    extract(forexRes);
    extract(cfdRes);
    extract(futuresRes);
    extract(indiaRes);
    extract(tvCryptoRes);
    // Binance overwrites/complements crypto if available
    extract(binanceRes);
    extract(americaRes);

    const newMap: Record<string, MarketPriceQuote> = { ...cachedPriceMap };

    // Register all directly resolved symbols
    for (const [sym, quote] of Object.entries(rawPrices)) {
      newMap[sym] = {
        price: quote.price,
        change24h: quote.change24h,
        updatedAt: now,
      };
    }

    // Comprehensive Alias Mappings for instant access across AppContext, TradeScreen, and DealsScreen
    const applyAlias = (targets: string[], sourceSym: string) => {
      const src = newMap[sourceSym];
      if (src) {
        for (const t of targets) {
          newMap[t] = src;
        }
      }
    };

    // Forex aliases
    applyAlias(["fut_eurusd", "EUR/USD", "EURUSD"], "FX:EURUSD");
    applyAlias(["fut_gbpusd", "GBP/USD", "GBPUSD"], "FX:GBPUSD");
    applyAlias(["fut_usdjpy", "USD/JPY", "USDJPY"], "FX:USDJPY");
    applyAlias(["fut_usdinr", "USD/INR", "USDINR"], "FX_IDC:USDINR");
    applyAlias(["fut_audusd", "AUD/USD", "AUDUSD"], "FX:AUDUSD");
    applyAlias(["fut_gbpjpy", "GBP/JPY", "GBPJPY"], "FX:GBPJPY");
    applyAlias(["USD/CAD", "USDCAD"], "FX:USDCAD");
    applyAlias(["EUR/GBP", "EURGBP"], "FX:EURGBP");
    applyAlias(["EUR/THB", "EURTHB"], "FX:EURTHB");
    applyAlias(["USD/BRL", "USDBRL"], "FX:USDBRL");
    applyAlias(["USD/MXN", "USDMXN"], "FX:USDMXN");
    applyAlias(["USD/CHF", "USDCHF"], "FX:USDCHF");
    applyAlias(["NZD/USD", "NZDUSD"], "FX:NZDUSD");
    applyAlias(["EUR/JPY", "EURJPY"], "FX:EURJPY");
    applyAlias(["AUD/JPY", "AUDJPY"], "FX:AUDJPY");
    applyAlias(["CAD/JPY", "CADJPY"], "FX:CADJPY");
    applyAlias(["EUR/CHF", "EURCHF"], "FX:EURCHF");
    applyAlias(["GBP/CAD", "GBPCAD"], "FX:GBPCAD");
    applyAlias(["AUD/CAD", "AUDCAD"], "FX:AUDCAD");
    applyAlias(["EUR/AUD", "EURAUD"], "FX:EURAUD");

    // Commodities aliases
    applyAlias(["fut_gold", "GOLD", "XAU", "TVC:GOLD"], "TVC:GOLD");
    applyAlias(["fut_silver", "SILVER", "XAG", "TVC:SILVER"], "TVC:SILVER");
    const crudeSource = newMap["NYMEX:CL1!"] ? "NYMEX:CL1!" : (newMap["TVC:USOIL"] ? "TVC:USOIL" : (newMap["PEPPERSTONE:XTIUSD"] ? "PEPPERSTONE:XTIUSD" : ""));
    if (crudeSource) {
      applyAlias(["fut_crude", "CRUDEOIL", "TVC:USOIL", "NYMEX:CL1!", "WTI"], crudeSource);
    }

    // Indian market aliases
    applyAlias(["fut_nifty", "NIFTY", "NSE:NIFTY"], "NSE:NIFTY");
    applyAlias(["fut_banknifty", "BANKNIFTY", "NSE:BANKNIFTY"], "NSE:BANKNIFTY");
    applyAlias(["fut_reliance", "RELIANCE", "NSE:RELIANCE"], "NSE:RELIANCE");
    const tataSource = newMap["BSE:TMCV"] ? "BSE:TMCV" : (newMap["NSE:TATAMOTORS"] ? "NSE:TATAMOTORS" : "");
    if (tataSource) {
      applyAlias(["fut_tatamotors", "TATAMOTORS", "NSE:TATAMOTORS", "BSE:TMCV"], tataSource);
    }
    applyAlias(["fut_hdfcbank", "HDFCBANK", "NSE:HDFCBANK"], "NSE:HDFCBANK");
    applyAlias(["fut_infosys", "INFY", "NSE:INFY"], "NSE:INFY");

    // Crypto aliases
    applyAlias(["fut_btc", "BTC/USDT", "BTCUSDT", "BTC"], "BINANCE:BTCUSDT");
    applyAlias(["fut_eth", "ETH/USDT", "ETHUSDT", "ETH"], "BINANCE:ETHUSDT");
    applyAlias(["fut_sol", "SOL/USDT", "SOLUSDT", "SOL"], "BINANCE:SOLUSDT");
    applyAlias(["fut_bnb", "BNB/USDT", "BNBUSDT", "BNB"], "BINANCE:BNBUSDT");
    applyAlias(["fut_xrp", "XRP/USDT", "XRPUSDT", "XRP"], "BINANCE:XRPUSDT");
    applyAlias(["fut_doge", "DOGE/USDT", "DOGEUSDT", "DOGE"], "BINANCE:DOGEUSDT");
    applyAlias(["fut_ada", "ADA/USDT", "ADAUSDT", "ADA"], "BINANCE:ADAUSDT");

    // US Stocks aliases
    applyAlias(["AAPL", "NASDAQ:AAPL"], "NASDAQ:AAPL");
    applyAlias(["TSLA", "NASDAQ:TSLA"], "NASDAQ:TSLA");
    applyAlias(["NVDA", "NASDAQ:NVDA"], "NASDAQ:NVDA");
    applyAlias(["META", "NASDAQ:META"], "NASDAQ:META");
    applyAlias(["AMZN", "NASDAQ:AMZN"], "NASDAQ:AMZN");
    applyAlias(["GOOGL", "NASDAQ:GOOGL"], "NASDAQ:GOOGL");
    applyAlias(["MSFT", "NASDAQ:MSFT"], "NASDAQ:MSFT");

    cachedPriceMap = newMap;
    lastFetchTime = now;
    return cachedPriceMap;
  } catch (err) {
    return cachedPriceMap;
  }
}
