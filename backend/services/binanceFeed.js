import WebSocket from 'ws';
import { updatePrice, getPrices } from './priceRegistry.js';

let io; // Will store the Socket.IO instance

export const initBinanceFeed = (socketIoInstance) => {
  io = socketIoInstance;
  
  // Binance WebSocket endpoint for multiple streams
  // @trade stream sends real-time execution prices
  const streams = ['btcusdt@trade', 'ethusdt@trade', 'solusdt@trade'];
  const wsUrl = `wss://stream.binance.com:9443/ws/${streams.join('/')}`;
  
  const ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    console.log('Connected to Binance WebSocket stream');
  });

  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data);
      // 's' is symbol, 'p' is price
      if (parsed.s && parsed.p) {
        const symbol = parsed.s; // e.g., 'BTCUSDT'
        const price = parsed.p;  // e.g., '65000.12'
        
        // Update in-memory registry
        updatePrice(symbol, price);
        
        // Broadcast the updated prices to all connected clients
        if (io) {
          io.emit('price-update', getPrices());
        }
      }
    } catch (error) {
      console.error('Error parsing Binance message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Binance WebSocket connection closed. Reconnecting in 5s...');
    setTimeout(() => initBinanceFeed(io), 5000);
  });

  ws.on('error', (err) => {
    console.error('Binance WebSocket error:', err);
    ws.close();
  });
};
