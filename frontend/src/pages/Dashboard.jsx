import React, { useState, useEffect } from 'react';
import LivePrices from '../components/LivePrices';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { TrendingUp, Wallet, Zap, Clock } from 'lucide-react';

const Dashboard = () => {
  const { prices } = useSocket();
  const { user } = useAuth();
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [type, setType] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  const currentPrice = prices[symbol];

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await axios.get('/portfolio');
      setBalance(parseFloat(res.data.balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post('/trade/execute', {
        symbol,
        type,
        quantity
      });
      setMessage(res.data.message);
      setQuantity('');
      fetchBalance(); // Refresh balance after trade
    } catch (err) {
      setError(err.response?.data?.error || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const estimatedValue = currentPrice && quantity ? (parseFloat(currentPrice) * parseFloat(quantity)).toFixed(2) : '0.00';
  const displaySymbol = symbol.replace('USDT', '');

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Trading Terminal</h1>
          <p className="dashboard-subtitle">Execute trades with real-time market data</p>
        </div>
        <div className="dashboard-stats">
          <div className="dashboard-stat">
            <Wallet size={18} className="stat-icon" />
            <div>
              <div className="stat-label">Balance</div>
              <div className="stat-value mono-num">${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
          </div>
        </div>
      </div>

      <LivePrices />
      
      <div className="dashboard-grid">
        <div className="trade-panel">
          <div className="trade-panel-header">
            <h2 className="trade-panel-title">Place Order</h2>
            <div className="trade-panel-badge">
              <Clock size={14} />
              <span>Real-time</span>
            </div>
          </div>

          <div className="trade-panel-body">
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleTrade}>
              <div className="trade-type-toggle">
                <button 
                  type="button" 
                  className={`trade-type-btn ${type === 'BUY' ? 'active buy' : ''}`}
                  onClick={() => setType('BUY')}
                >
                  <TrendingUp size={18} />
                  Buy
                </button>
                <button 
                  type="button" 
                  className={`trade-type-btn ${type === 'SELL' ? 'active sell' : ''}`}
                  onClick={() => setType('SELL')}
                >
                  <TrendingUp size={18} style={{transform: 'rotate(180deg)'}} />
                  Sell
                </button>
              </div>

              <div className="trade-form-group">
                <label className="trade-label">Select Asset</label>
                <div className="trade-select-wrapper">
                  <select 
                    value={symbol} 
                    onChange={(e) => setSymbol(e.target.value)}
                    className="trade-select"
                  >
                    <option value="BTCUSDT">Bitcoin (BTC)</option>
                    <option value="ETHUSDT">Ethereum (ETH)</option>
                    <option value="SOLUSDT">Solana (SOL)</option>
                  </select>
                  <div className="trade-price-display">
                    {currentPrice ? `$${parseFloat(currentPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '---'}
                  </div>
                </div>
              </div>

              <div className="trade-form-group">
                <label className="trade-label">
                  Quantity
                  <span className="trade-label-sub">
                    {type === 'BUY' ? `Available: $${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'Check portfolio'}
                  </span>
                </label>
                <div className="trade-input-wrapper">
                  <input 
                    type="number" 
                    step="0.000001"
                    min="0.000001"
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    required 
                    placeholder="0.00"
                    className="trade-input mono-num"
                  />
                  <span className="trade-input-suffix">{displaySymbol}</span>
                </div>
              </div>
              
              <div className="trade-summary">
                <div className="trade-summary-row">
                  <span className="trade-summary-label">Estimated Total</span>
                  <span className="trade-summary-value mono-num">${estimatedValue} USDT</span>
                </div>
              </div>

              <button type="submit" disabled={loading || !currentPrice} className={`trade-submit-btn ${type === 'BUY' ? 'buy' : 'sell'}`}>
                <Zap size={18} />
                {loading ? 'Processing...' : `${type} ${displaySymbol}`}
              </button>
            </form>
          </div>
        </div>

        <div className="info-panel">
          <div className="info-card">
            <div className="info-card-header">
              <h3 className="info-card-title">Quick Guide</h3>
            </div>
            <div className="info-card-content">
              <div className="info-item">
                <div className="info-icon">
                  <TrendingUp size={20} />
                </div>
                <div className="info-text">
                  <h4>Real-Time Data</h4>
                  <p>Prices stream live from Binance WebSocket</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <Wallet size={20} />
                </div>
                <div className="info-text">
                  <h4>Virtual Balance</h4>
                  <p>Start with $10,000 to practice trading</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <Zap size={20} />
                </div>
                <div className="info-text">
                  <h4>Instant Execution</h4>
                  <p>Zero slippage, zero fees, instant fills</p>
                </div>
              </div>
            </div>
          </div>

          <div className="market-status-card">
            <div className="market-status-header">
              <div className="status-dot"></div>
              <span>Market Status</span>
            </div>
            <div className="market-status-content">
              <div className="status-item">
                <span className="status-label">Connection</span>
                <span className="status-value text-success">Connected</span>
              </div>
              <div className="status-item">
                <span className="status-label">Latency</span>
                <span className="status-value">&lt; 50ms</span>
              </div>
              <div className="status-item">
                <span className="status-label">Data Source</span>
                <span className="status-value">Binance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
