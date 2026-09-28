export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type TimeFrame = '5s' | '15s' | '30s' | '1m' | '3m' | '5m' | '15m' | '1min' | '3min' | '5min' | '15min';

export const normalizeTimeFrame = (tf: string): '5s' | '15s' | '30s' | '1m' | '3m' | '5m' | '15m' => {
  if (tf === '15min' || tf === '15m') return '15m';
  if (tf === '5min' || tf === '5m') return '5m';
  if (tf === '3min' || tf === '3m') return '3m';
  if (tf === '1min' || tf === '1m') return '1m';
  if (tf === '30s') return '30s';
  if (tf === '15s') return '15s';
  return '5s';
};

export const getTimeFrameMs = (tf: string): number => {
  const norm = normalizeTimeFrame(tf);
  switch (norm) {
    case '5s': return 5000;
    case '15s': return 15000;
    case '30s': return 30000;
    case '1m': return 60000;
    case '3m': return 180000;
    case '5m': return 300000;
    case '15m': return 900000;
    default: return 60000;
  }
};

export const getPrecision = (price: number): number => {
  if (!price || isNaN(price) || price <= 0) return 2;
  if (price < 0.0001) return 8; // e.g. SHIB (0.0000185), PEPE (0.0000098)
  if (price < 0.01) return 6;
  if (price < 1) return 4;    // e.g. XRP, DOGE, TRX, EURUSD
  if (price < 10) return 3;   // e.g. TON, LINK, SUI, NEAR
  return 2;                   // e.g. Gold, Bitcoin, Apple, Index
};

// Canonical benchmark base prices across all platforms ensuring all users see identical charts
export const CANONICAL_PRICES: Record<string, number> = {
  '1': 2499.07,
  '2': 78370.0,
  '3': 1.16235,
  '4': 4400.5,
  '5': 94.808,
  '6': 354.08,
  '8': 616.77,
  '9': 1.3556,
  '10': 153.80,
  '11': 0.7227,
  '12': 1.3725,
  '13': 0.8540,
  '14': 37.79,
  '15': 5.4820,
  '16': 18.254,
  '17': 0.8950,
  '18': 0.6120,
  '19': 208.52,
  '20': 164.80,
  '21': 101.45,
  '22': 112.35,
  '23': 2470.5,
  '24': 102.85,
  '25': 751.20,
  '26': 1.3995,
  '27': 0.08935,
  '28': 6.85,
  '29': 0.0000185,
  '30': 0.5240,
  '31': 12.45,
  '32': 74.20,
  '33': 5.15,
  '34': 0.1620,
  '35': 0.2187,
  '36': 28.90,
  '37': 0.0000098,
  '38': 317.79,
  '39': 128.45,
  '40': 448.20,
  '41': 186.75,
  '42': 179.30,
  '43': 154.60,
  '44': 24.15,
  '45': 84.30,
  '46': 68.40,
  '47': 96.20,
  '48': 278.50,
  '49': 462.80,
  '50': 672.10,
  '51': 108.26,
  '57': 29.45,
  '58': 955.40,
  '59': 980.20,
  '60': 84.60,
  '61': 80.25,
  '62': 2.15,
  '63': 4.45,
  '64': 19850.0,
  '65': 5540.2,
  '66': 40280.0,
  '69': 18650.0,
  '70': 8240.0,
  '71': 38250.0,
  '72': 17650.0,
  '73': 0.9420,
  '74': 1.7650,
  '75': 0.9030,
  '76': 1.6320,
  '77': 5.42,
  '78': 2.18,
  '79': 9.85,
  '80': 6.45,
  '81': 8.90,
  '82': 6.75,
  '83': 0.85,
  '84': 22.40,
  '85': 198.50,
  '86': 462.10,
  '87': 224.30,
  '88': 82.40,
  '89': 172.90,
  '90': 178.60,
  '91': 945.20,
  '92': 118.40,
  '93': 912.80,
  '94': 86.50,
  '95': 532.70,
  '96': 42.80,
  '97': 218.40,
  '98': 375.60,
  '99': 74.30,
  '100': 2150.80,
  '101': 27.15,
  '102': 7540.0,
  '103': 4920.0,
  '104': 8120.0,
  '105': 11650.0,
  '106': 24500.0,
  '107': 51200.0,
  '108': 80500.0,
  '109': 14.50,
  '110': 2150.0,
  '111': 165.20,
  '112': 280.40,
  '113': 260.15,
  '114': 158.30,
  '115': 39.50,
  '116': 345.60,
  '117': 148.90,
  '118': 162.30,
  '119': 48.20,
  '120': 41.50,
  '121': 18.20,
  '122': 28.40,
  '123': 185.60,
  '124': 205.40,
  '125': 145.80,
  '126': 890.50,
  '127': 124.30,
  '128': 156.20,
  '129': 72.40,
  '130': 68.90,
  '131': 64.50,
  '132': 0.1050,
  '133': 9.40,
  '134': 4.50,
  '135': 0.0340,
  '136': 165.20,
  '137': 102.40,
  '138': 0.1520,
  '139': 1.65,
  '140': 34.20,
  '141': 0.3540,
  '142': 0.3420,
  '143': 6.20,
  '144': 0.0280,
  '145': 82.40,
  '146': 0.5420,
  '147': 4.80,
  '148': 2840.0,
  '149': 1.85,
  '150': 2450.0,
  '151': 2850.0,
  '152': 18200.0,
  '153': 9240.0,
  '154': 235.40,
  '155': 580.20,
  '156': 1.1420,
  '157': 1.0840,
  '158': 94.20,
  '159': 172.40,
  '160': 0.6520
};

export const updateCanonicalPricesFromRemote = (remotePrices: Record<string, number>) => {
  if (!remotePrices || typeof remotePrices !== 'object') return;
  for (const [k, v] of Object.entries(remotePrices)) {
    if (typeof v === 'number' && !isNaN(v) && v > 0) {
      CANONICAL_PRICES[k] = v;
    }
  }
};

export const getCanonicalPrice = (assetId: string, fallbackPrice?: number): number => {
  if (CANONICAL_PRICES[assetId]) {
    return CANONICAL_PRICES[assetId];
  }
  if (typeof fallbackPrice === 'number' && !isNaN(fallbackPrice) && fallbackPrice > 0) {
    return fallbackPrice;
  }
  return 100;
};

// Fixed global epoch reference point (Jan 1, 2024 00:00:00 UTC)
export const GLOBAL_EPOCH = 1704067200000;

// High-speed 32-bit FNV-1a seeded hash generator returning float in [-0.5, 0.5]
export function hashSlot(assetId: string, slotIndex: number): number {
  let h = 2166136261;
  const str = assetId || '1';
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  h = Math.imul(h ^ (slotIndex & 0xffff), 16777619);
  h = Math.imul(h ^ ((slotIndex >>> 16) & 0xffff), 16777619);
  return ((h >>> 0) / 4294967296) - 0.5;
}

export interface MarketOverrideConfig {
  direction: 'AUTO' | 'BUY' | 'SELL';
  startedAt?: number;
  expiresAt?: number;
  durationSeconds?: number;
  intensity?: 'gentle' | 'moderate' | 'strong';
  remainingSeconds?: number;
  targetPrice?: number;
  entryPrice?: number;
}

// Deterministic closed-form price at any slotIndex, identical on ALL client browsers
// Incorporates true market psychology: Accumulation, Markup, Distribution, Markdown, and Harmonic Swings
export function getSlotPrice(
  assetId: string,
  slotIndex: number,
  basePrice: number,
  intervalMs: number
): number {
  const numericId = parseInt((assetId || '1').replace(/\D/g, ''), 10) || 1;
  const precision = getPrecision(basePrice);
  
  // Phase seeds derived deterministically per asset
  const phi = numericId * 0.718281828;
  
  // 1. Macro Trend Cycle (~6-8 hour Wyckoff structural wave)
  const macroWave = Math.sin((slotIndex / 420) * 2 * Math.PI + phi) * 0.024;
  
  // 2. Intermediate Market Structure Swing (~90 min cycle, creating Double Bottoms / Double Tops)
  const swingWave = Math.cos((slotIndex / 96) * 2 * Math.PI + phi * 1.618) * 0.012;
  
  // 3. Fibonacci Retracement Wave (~24 min rhythm, simulating 0.382 / 0.618 pullbacks)
  const fiboWave = Math.sin((slotIndex / 24) * 2 * Math.PI + phi * 2.618) * 0.005;
  
  // 4. Fast Liquidity Search Wave (~8 min rhythm, testing local support/resistance)
  const microWave = Math.cos((slotIndex / 8) * 2 * Math.PI + phi * 3.141) * 0.0022;

  // 5. Psychological Rounding Anchor: assets naturally react near round institutional price numbers
  const roundScale = basePrice > 100 ? 5 : basePrice > 10 ? 0.5 : 0.005;
  const roundDistance = (basePrice % roundScale) / roundScale;
  const psychologicalMagnet = Math.sin(roundDistance * Math.PI * 2) * 0.0008;
  
  // 6. Natural Organic Noise (100% deterministic hash per slot on all devices)
  const organicNoise = hashSlot(assetId, slotIndex) * 0.0028;
  
  // Timeframe volatility scaling
  const tfScale = Math.sqrt(intervalMs / 60000);
  const totalOffsetFactor = (macroWave + swingWave + fiboWave + microWave + psychologicalMagnet + organicNoise) * tfScale;
  
  let price = basePrice * (1 + totalOffsetFactor);
  if (price <= 0 || isNaN(price)) price = basePrice;
  return Number(price.toFixed(precision));
}

// Generate an authentic psychology-based candle for a specific slot timestamp
export function getSlotCandle(
  assetId: string,
  slotTime: number,
  basePrice: number,
  intervalMs: number
): CandleData {
  const slotIndex = Math.floor((slotTime - GLOBAL_EPOCH) / intervalMs);
  const precision = getPrecision(basePrice);
  const pipSize = Math.pow(10, -precision);
  
  const open = getSlotPrice(assetId, slotIndex - 1, basePrice, intervalMs);
  const close = getSlotPrice(assetId, slotIndex, basePrice, intervalMs);
  
  const hHash = Math.abs(hashSlot(assetId, slotIndex + 5000000));
  const lHash = Math.abs(hashSlot(assetId, slotIndex + 9000000));
  const bodySize = Math.abs(close - open);
  const isBullish = close >= open;

  // Authentic Candlestick Anatomy:
  // In real psychology, wicks reflect rejection at swing highs/lows:
  // - Bullish expansion candles have smaller upper wicks and rejection lower wicks (buyers stepped in)
  // - Bearish expansion candles have smaller lower wicks and rejection upper wicks (sellers pushed down)
  // - When body is very small (< 1.5 pips), indecision wicks form (Doji / Spinning top)
  const minWickVol = Math.max(basePrice * 0.00035, pipSize * 3);
  const baseWickVol = Math.max(bodySize * 0.65, minWickVol);
  let upperWickExtra = hHash * baseWickVol;
  let lowerWickExtra = lHash * baseWickVol;

  if (isBullish) {
    lowerWickExtra *= 1.25; // Rejection at the base (Hammer / Bullish momentum)
    upperWickExtra *= 0.75;
  } else {
    upperWickExtra *= 1.25; // Rejection at the high (Shooting star / Bearish momentum)
    lowerWickExtra *= 0.75;
  }

  const high = Number(Math.max(open, close, Math.max(open, close) + upperWickExtra).toFixed(precision));
  const low = Number(Math.max(pipSize, Math.min(open, close, Math.min(open, close) - lowerWickExtra)).toFixed(precision));

  return {
    time: slotTime,
    open,
    high,
    low,
    close,
    volume: Math.floor(150 + Math.abs(hashSlot(assetId, slotIndex + 12000000)) * 950)
  };
}

// In-memory cache holding historical and live candles per asset and timeframe
const candleCache = new Map<string, CandleData[]>();

// Generate 100% deterministic, mathematically identical initial candles for all users
export const generateInitialCandles = (
  assetId: string,
  basePrice: number,
  timeFrame: string,
  count = 350
): CandleData[] => {
  const canonicalBase = getCanonicalPrice(assetId, basePrice);
  const normTf = normalizeTimeFrame(timeFrame);
  const intervalMs = getTimeFrameMs(normTf);
  const now = Date.now();
  const currentSlot = Math.floor(now / intervalMs) * intervalMs;
  
  const candles: CandleData[] = [];
  
  // Historical completed candles (perfect continuity with zero gaps)
  for (let i = count - 1; i >= 1; i--) {
    const slotTime = currentSlot - i * intervalMs;
    candles.push(getSlotCandle(assetId, slotTime, canonicalBase, intervalMs));
  }

  // Active live candle at currentSlot
  const currentSlotIndex = Math.floor((currentSlot - GLOBAL_EPOCH) / intervalMs);
  const activeOpen = getSlotPrice(assetId, currentSlotIndex - 1, canonicalBase, intervalMs);
  const activeTarget = getSlotPrice(assetId, currentSlotIndex, canonicalBase, intervalMs);
  const progress = Math.min(1, Math.max(0, (now - currentSlot) / intervalMs));
  const precision = getPrecision(canonicalBase);
  const pip = Math.pow(10, -precision);
  const baseVol = Math.max(canonicalBase * 0.00028, pip * 2.5);
  const subTickIndex = Math.floor(now / 250);
  const tickNoise = hashSlot(assetId, subTickIndex);
  const smoothProgress = progress * progress * (3 - 2 * progress);
  const currentLive = Number((activeOpen + (activeTarget - activeOpen) * smoothProgress + tickNoise * baseVol * 0.6).toFixed(precision));

  candles.push({
    time: currentSlot,
    open: activeOpen,
    high: Number(Math.max(activeOpen, currentLive).toFixed(precision)),
    low: Number(Math.min(activeOpen, currentLive).toFixed(precision)),
    close: currentLive,
    volume: Math.floor(50 + progress * 200)
  });

  return candles;
};

// Retrieve candles for asset and timeframe, creating persistent store if not exists
export const getCandleSeries = (
  assetId: string,
  basePrice: number,
  timeFrame: string
): CandleData[] => {
  const canonicalBase = getCanonicalPrice(assetId, basePrice);
  const normTf = normalizeTimeFrame(timeFrame);
  const key = `${assetId}_${normTf}`;
  const intervalMs = getTimeFrameMs(normTf);
  const now = Date.now();
  const currentSlot = Math.floor(now / intervalMs) * intervalMs;
  
  let series = candleCache.get(key);
  // If cache is empty or older than 5 candles, re-initialize deterministically
  if (!series || series.length === 0 || (series[series.length - 1].time < currentSlot - 5 * intervalMs)) {
    series = generateInitialCandles(assetId, canonicalBase, normTf, 350);
    candleCache.set(key, series);
  }
  return series;
};

// Compute the current live synchronized price for any asset at this exact millisecond
// Smooth transition mechanics: zero instantaneous jump or pumping when operator changes direction
// Master trades guide the actual candlestick in the trade direction with natural, organic market action
export const getSynchronizedLivePrice = (
  assetId: string,
  basePrice: number,
  override?: 'BUY' | 'SELL' | MarketOverrideConfig
): number => {
  const canonicalBase = getCanonicalPrice(assetId, basePrice);
  const now = Date.now();
  const intervalMs = 60000; // 1-minute base interval
  const currentSlot = Math.floor(now / intervalMs) * intervalMs;
  const currentSlotIndex = Math.floor((currentSlot - GLOBAL_EPOCH) / intervalMs);
  
  const slotOpen = getSlotPrice(assetId, currentSlotIndex - 1, canonicalBase, intervalMs);
  const slotTarget = getSlotPrice(assetId, currentSlotIndex, canonicalBase, intervalMs);
  const progress = Math.min(1, Math.max(0, (now - currentSlot) / intervalMs));
  const precision = getPrecision(canonicalBase);
  const pip = Math.pow(10, -precision);
  
  // Dynamic, asset-proportional micro-volatility (Bitcoin $78k moves smoothly, Gold $2.5k moves smoothly, Forex moves smoothly)
  const baseVol = Math.max(canonicalBase * 0.00028, pip * 2.5);

  // Original 250ms cadence tick engine with buttery-smooth Hermite interpolation between ticks
  const subTickIndex = Math.floor(now / 250);
  const subTickPhase = (now % 250) / 250;
  const smoothSubPhase = subTickPhase * subTickPhase * (3 - 2 * subTickPhase);
  const tick1 = hashSlot(assetId, subTickIndex);
  const tick2 = hashSlot(assetId, subTickIndex + 1);
  const interpolatedTick = tick1 + (tick2 - tick1) * smoothSubPhase;

  // Realistic multi-harmonic market vibrations (fast, energetic yet buttery smooth)
  const wave1 = Math.sin(now / 160) * 0.32;
  const wave2 = Math.cos(now / 380) * 0.22;
  const wave3 = Math.sin(now / 920) * 0.16;
  const microWobble = (wave1 + wave2 + wave3) * baseVol * 0.45;
  const microNoise = interpolatedTick * baseVol * 0.70;

  // Smooth S-curve transition between candle slot open and target
  const smoothProgress = progress * progress * (3 - 2 * progress);
  const naturalPrice = slotOpen + (slotTarget - slotOpen) * smoothProgress + microNoise + microWobble;
  
  // Extract override parameters
  let overrideDirection: 'BUY' | 'SELL' | undefined = undefined;
  let startedAt = currentSlot;
  let expiresAt = currentSlot + 60000;
  let durationSeconds = 60;
  let entryPrice: number | undefined = undefined;

  if (typeof override === 'string') {
    if (override === 'BUY' || override === 'SELL') {
      overrideDirection = override;
      startedAt = currentSlot;
      expiresAt = currentSlot + 60000;
      durationSeconds = 60;
    }
  } else if (override && (override.direction === 'BUY' || override.direction === 'SELL')) {
    const isStillActive = !override.expiresAt || override.expiresAt > now;
    const isRecent = override.expiresAt && (now - override.expiresAt < 20000); // 20s smooth decay window
    if (isStillActive || isRecent) {
      overrideDirection = override.direction;
      durationSeconds = override.durationSeconds || 60;
      startedAt = override.startedAt || (override.expiresAt ? override.expiresAt - durationSeconds * 1000 : currentSlot);
      expiresAt = override.expiresAt || (startedAt + durationSeconds * 1000);
      entryPrice = override.entryPrice;
    }
  }

  // If no active or recent override, return deterministic natural price
  if (!overrideDirection) {
    if (naturalPrice <= 0 || isNaN(naturalPrice)) return canonicalBase;
    return Number(naturalPrice.toFixed(precision));
  }

  // Active or decaying override:
  // Use entry strike price as anchor if provided, otherwise slotOpen
  const refPrice = (entryPrice && entryPrice > 0) ? entryPrice : slotOpen;
  const candleRef = slotOpen;

  // Realistic, authentic market move distance (0.05% - 0.09% of asset price)
  // Perfectly realistic candle body with natural organic fluctuations, without unnatural pumps
  const targetDistance = Math.max(canonicalBase * 0.0008, 6 * pip);

  if (now <= expiresAt) {
    // -------------------------------------------------------------
    // Active Trade Phase:
    // Steers the price and candle in the trade's direction naturally
    // -------------------------------------------------------------
    const totalMs = Math.max(5000, expiresAt - startedAt);
    const elapsedMs = Math.max(0, now - startedAt);
    const t = Math.min(1, Math.max(0, elapsedMs / totalMs));

    // Smooth cubic Hermite S-curve: starts smoothly, accelerates mid-trade, stabilizes at target
    const smoothT = t * t * (3 - 2 * t);

    // Initial price at start of trade
    const startP = refPrice;

    // Target price at expiry:
    // If BUY (CALL): naturally above startP (entryPrice) and candleRef (slotOpen)
    // If SELL (PUT): naturally below startP (entryPrice) and candleRef (slotOpen)
    let endP: number;
    if (overrideDirection === 'BUY') {
      const highestBase = Math.max(startP, candleRef);
      endP = highestBase + targetDistance;
    } else {
      const lowestBase = Math.min(startP, candleRef);
      endP = lowestBase - targetDistance;
    }

    // Organic base trajectory from startP to endP
    const targetTrajectory = startP + (endP - startP) * smoothT;

    // Natural micro-market volatility (breathing waves + micro-ticks)
    // Blends down smoothly as expiry approaches so the final strike is clean and solid
    const remainingRatio = Math.max(0.2, 1 - t * 0.7);
    const overrideWave1 = Math.sin(elapsedMs / 1300) * (targetDistance * 0.12 * remainingRatio);
    const overrideWave2 = Math.cos(elapsedMs / 2700) * (targetDistance * 0.08 * remainingRatio);
    const overrideMicroTick = (interpolatedTick * 0.5 + Math.sin(now / 180) * 0.3) * (baseVol * 0.55);

    let price = targetTrajectory + overrideWave1 + overrideWave2 + overrideMicroTick;

    // Soft guardrail: smoothly ensures the candle finishes securely on the winning side without sudden jumps
    if (t > 0.40) {
      const minWinningMargin = targetDistance * (0.05 + 0.50 * smoothT);
      if (overrideDirection === 'BUY') {
        price = Math.max(price, refPrice + minWinningMargin);
      } else {
        price = Math.min(price, refPrice - minWinningMargin);
      }
    }

    if (price <= 0 || isNaN(price)) price = canonicalBase;
    return Number(price.toFixed(precision));
  } else {
    // -------------------------------------------------------------
    // Post-Trade Phase (20s smooth relaxation back to natural cycle)
    // Zero sudden snaps, cliffs, or unnatural jumps
    // -------------------------------------------------------------
    const postElapsed = now - expiresAt;
    const decayT = Math.min(1, postElapsed / 20000);
    const smoothDecay = decayT * decayT * (3 - 2 * decayT);

    let lastEndP: number;
    if (overrideDirection === 'BUY') {
      lastEndP = Math.max(refPrice, candleRef) + targetDistance;
    } else {
      lastEndP = Math.min(refPrice, candleRef) - targetDistance;
    }

    const blendedPrice = lastEndP + (naturalPrice - lastEndP) * smoothDecay;
    if (blendedPrice <= 0 || isNaN(blendedPrice)) return canonicalBase;
    return Number(blendedPrice.toFixed(precision));
  }
};

// Feed live tick into active timeframes for an asset (optimized for zero garbage collection overhead and timeline durability)
export const pushLiveTick = (assetId: string, currentPrice: number) => {
  if (!currentPrice || isNaN(currentPrice) || currentPrice <= 0) return;
  const timeFrames: ('5s' | '15s' | '30s' | '1m' | '3m' | '5m' | '15m')[] = ['5s', '15s', '30s', '1m', '3m', '5m', '15m'];
  const now = Date.now();

  for (let i = 0; i < timeFrames.length; i++) {
    const tf = timeFrames[i];
    const key = `${assetId}_${tf}`;
    const series = candleCache.get(key);
    if (!series || series.length === 0) continue; // Lazy initialization on demand

    const intervalMs = getTimeFrameMs(tf);
    const currentSlot = Math.floor(now / intervalMs) * intervalMs;
    const lastIndex = series.length - 1;
    const lastCandle = series[lastIndex];

    if (!lastCandle) continue;

    if (lastCandle.time === currentSlot) {
      // Fast in-place mutation without object reallocation
      lastCandle.close = currentPrice;
      if (currentPrice > lastCandle.high) lastCandle.high = currentPrice;
      if (currentPrice < lastCandle.low) lastCandle.low = currentPrice;
    } else if (currentSlot > lastCandle.time) {
      // Durable backfill: if browser tab was in background, fill any missed completed candles seamlessly
      const missedCount = Math.floor((currentSlot - lastCandle.time) / intervalMs);
      if (missedCount > 1 && missedCount < 120) {
        for (let m = 1; m < missedCount; m++) {
          const missedTime = lastCandle.time + m * intervalMs;
          series.push(getSlotCandle(assetId, missedTime, currentPrice, intervalMs));
        }
      }

      // New candle interval starts
      const prevClose = series[series.length - 1].close;
      const newCandle: CandleData = {
        time: currentSlot,
        open: prevClose,
        high: Math.max(prevClose, currentPrice),
        low: Math.min(prevClose, currentPrice),
        close: currentPrice,
        volume: 25
      };
      series.push(newCandle);

      // Memory efficiency: maintain max 500 historical candles
      if (series.length > 500) {
        series.splice(0, series.length - 500);
      }
    }
  }
};
