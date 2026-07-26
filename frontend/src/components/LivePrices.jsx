import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const LivePrices = () => {
  const { prices } = useSocket();
  const pairs = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
  
  // Track previous prices to determine flash color
  const prevPricesRef = useRef({});
  const [flash, setFlash] = useState({});

  useEffect(() => {
    const newFlash = {};
    pairs.forEach(symbol => {
      const current = parseFloat(prices[symbol]);
      const prev = parseFloat(prevPricesRef.current[symbol]);
      
      if (current && prev && current !== prev) {
        newFlash[symbol] = current > prev ? 'up' : 'down';
      } else {
        newFlash[symbol] = flash[symbol] || null;
      }
    });
    
    setFlash(newFlash);
    prevPricesRef.current = { ...prices };
    
    const timeout = setTimeout(() => {
      setFlash({});
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [prices]);

  return (
    <div className="live-ticker-container">
      {pairs.map(symbol => {
        const currentPrice = prices[symbol];
        const name = symbol.replace('USDT', '');
        const flashState = flash[symbol];
        
        return (
          <div key={symbol} className="ticker-card">
            <div className="ticker-info">
              <span className="ticker-symbol text-muted">{name}/USDT</span>
              <span className={`ticker-price mono-num ${flashState === 'up' ? 'flash-up' : flashState === 'down' ? 'flash-down' : ''}`}>
                {currentPrice ? parseFloat(currentPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '---'}
              </span>
            </div>
            {flashState === 'up' && <ArrowUpRight size={24} className="text-success" />}
            {flashState === 'down' && <ArrowDownRight size={24} className="text-danger" />}
          </div>
        );
      })}
    </div>
  );
};

export default LivePrices;
