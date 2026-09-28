import React, { memo, useEffect, useRef, useState } from 'react';

interface TradingViewChartProps {
  tvSymbol: string;
  theme?: 'dark' | 'light';
  interval?: string;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = memo(({
  tvSymbol,
  theme = 'dark',
  interval = '15',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerId] = useState(() => `tv_chart_${Math.random().toString(36).substring(2, 9)}`);
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initWidget = () => {
      if (!isMounted || !containerRef.current || typeof (window as any).TradingView === 'undefined') return;

      containerRef.current.innerHTML = '';
      const widgetDiv = document.createElement('div');
      widgetDiv.id = containerId;
      widgetDiv.style.width = '100%';
      widgetDiv.style.height = '100%';
      containerRef.current.appendChild(widgetDiv);

      try {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: interval,
          timezone: 'Asia/Kolkata',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: theme === 'light' ? '#ffffff' : '#0d131f',
          enable_publishing: false,
          hide_top_toolbar: true,
          hide_legend: false,
          save_image: false,
          hide_side_toolbar: true,
          container_id: containerId,
          studies: [],
          overrides: {
            // Indian Flag (Tiranga) Palette
            'mainSeriesProperties.candleStyle.upColor': '#00C853',
            'mainSeriesProperties.candleStyle.downColor': '#FF671F',
            'mainSeriesProperties.candleStyle.wickUpColor': '#00C853',
            'mainSeriesProperties.candleStyle.wickDownColor': '#FF671F',
            'mainSeriesProperties.candleStyle.borderUpColor': '#00C853',
            'mainSeriesProperties.candleStyle.borderDownColor': '#FF671F',
            'mainSeriesProperties.candleStyle.drawWick': true,
            'mainSeriesProperties.candleStyle.drawBorder': true,
            'mainSeriesProperties.hollowCandleStyle.upColor': '#00C853',
            'mainSeriesProperties.hollowCandleStyle.downColor': '#FF671F',
            'mainSeriesProperties.haStyle.upColor': '#00C853',
            'mainSeriesProperties.haStyle.downColor': '#FF671F',
            'mainSeriesProperties.barStyle.upColor': '#00C853',
            'mainSeriesProperties.barStyle.downColor': '#FF671F',
            'paneProperties.background': theme === 'light' ? '#ffffff' : '#0b1118',
            'paneProperties.vertGridProperties.color': theme === 'light' ? '#f1f5f9' : '#162231',
            'paneProperties.horzGridProperties.color': theme === 'light' ? '#f1f5f9' : '#162231',
          },
        });
        setIsWidgetLoaded(true);
      } catch (err) {
        console.warn('TradingView widget initialization:', err);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }

    return () => {
      isMounted = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [tvSymbol, theme, interval, containerId]);

  const bgHex = theme === 'light' ? 'ffffff' : '0d131f';
  const iframeSrc = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_futures_widget&symbol=${encodeURIComponent(
    tvSymbol
  )}&interval=${encodeURIComponent(interval)}&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=0&saveimage=0&toolbarbg=${bgHex}&studies=%5B%5D&theme=${theme}&style=1&timezone=Asia%2FKolkata&locale=en`;

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 flex flex-col">
      <div ref={containerRef} className="w-full h-full" />
      {!isWidgetLoaded && (
        <iframe
          key={`${tvSymbol}-${theme}-${interval}`}
          title={`TradingView Chart - ${tvSymbol}`}
          src={iframeSrc}
          className="w-full h-full border-0 absolute inset-0 block"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: theme === 'light' ? '#ffffff' : '#0d131f',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      )}
    </div>
  );
});

TradingViewChart.displayName = 'TradingViewChart';
