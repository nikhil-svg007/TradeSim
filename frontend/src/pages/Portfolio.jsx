import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { TrendingUp, TrendingDown, Eye, X } from 'lucide-react';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');
  const { prices } = useSocket();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [portRes, watchRes] = await Promise.all([
        axios.get('/portfolio'),
        axios.get('/watchlist')
      ]);
      setPortfolio(portRes.data);
      setWatchlist(watchRes.data.symbols);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (e) => {
    e.preventDefault();
    if (!newSymbol) return;
    const formattedSymbol = newSymbol.toUpperCase() + (newSymbol.toUpperCase().endsWith('USDT') ? '' : 'USDT');
    try {
      const res = await axios.post('/watchlist/add', { symbol: formattedSymbol });
      setWatchlist(res.data.symbols);
      setNewSymbol('');
    } catch (error) {
      console.error('Error adding to watchlist', error);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {
      const res = await axios.delete(`/watchlist/${symbol}`);
      setWatchlist(res.data.symbols);
    } catch (error) {
      console.error('Error removing from watchlist', error);
    }
  };

  if (loading && !portfolio) return <div className="loading">Loading portfolio data...</div>;

  const isProfit = parseFloat(portfolio.totalPnl) >= 0;

  return (
    <div className="portfolio-page dashboard-grid">
      <div className="portfolio-main">
        <div className="portfolio-stats mb-4">
          <div className="stat-box">
            <span className="stat-label">Total Portfolio Value</span>
            <span className="stat-value mono-num">${parseFloat(portfolio.totalPortfolioValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Available Cash</span>
            <span className="stat-value mono-num">${parseFloat(portfolio.balance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Total Return</span>
            <div className="flex items-center gap-2">
              <span className={`stat-value mono-num ${isProfit ? 'text-success' : 'text-danger'}`}>
                {isProfit ? '+' : ''}${parseFloat(portfolio.totalPnl).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
              <div className={`badge ${isProfit ? 'badge-primary' : 'badge-danger'}`} style={{background: isProfit ? 'var(--trade-up-bg)' : 'var(--trade-down-bg)', color: isProfit ? 'var(--trade-up)' : 'var(--trade-down)'}}>
                {isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {parseFloat(portfolio.totalPnlPercent).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="card holdings-card">
          <h2 className="section-title">Your Assets</h2>
          {portfolio.holdings.length === 0 ? (
            <div className="empty-state">
              <p>You don't own any assets yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Balance</th>
                    <th>Avg Buy Price</th>
                    <th>Current Price</th>
                    <th>Holdings Value</th>
                    <th>Unrealized PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map(h => {
                    const livePrice = prices[h.symbol] || h.livePrice;
                    const currentValue = parseFloat(h.quantity) * parseFloat(livePrice);
                    const totalCost = parseFloat(h.totalCost);
                    
                    let pnl = currentValue - totalCost;
                    if (Math.abs(pnl) < 0.0001) pnl = 0;
                    const isRowProfit = pnl >= 0;
                    
                    return (
                      <tr key={h._id}>
                        <td className="fw-bold">{h.symbol.replace('USDT', '')}</td>
                        <td className="mono-num">{parseFloat(h.quantity).toFixed(6)}</td>
                        <td className="mono-num">${parseFloat(h.avgBuyPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="mono-num">${parseFloat(livePrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="fw-bold mono-num text-primary">${currentValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className={`mono-num ${isRowProfit && pnl > 0 ? 'text-success' : pnl < 0 ? 'text-danger' : ''}`}>
                          <div className="flex items-center gap-2 justify-end">
                            {pnl > 0 ? <TrendingUp size={14} /> : pnl < 0 ? <TrendingDown size={14} /> : null}
                            {pnl > 0 ? '+' : ''}${pnl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: Math.abs(pnl) < 1 && pnl !== 0 ? 4 : 2})}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="watchlist-sidebar">
        <div className="card watchlist-card">
          <h2 className="section-title">
            <div className="flex items-center gap-2">
              <Eye size={20} className="text-muted" />
              Watchlist
            </div>
          </h2>
          
          <form onSubmit={addToWatchlist} className="form-input-group mb-4">
            <input 
              type="text" 
              value={newSymbol} 
              onChange={(e) => setNewSymbol(e.target.value)} 
              placeholder="e.g. BTC" 
              style={{background: 'transparent', border: 'none', color: 'white', flex: 1, padding: '12px 0', outline: 'none'}}
            />
            <button type="submit" className="btn btn-sm btn-primary" style={{padding: '6px 12px', marginLeft: '8px'}}>Add</button>
          </form>

          {watchlist.length === 0 ? (
            <p className="text-muted text-sm text-center py-4">Your watchlist is empty.</p>
          ) : (
            <ul className="watchlist-list">
              {watchlist.map(symbol => {
                const livePrice = prices[symbol];
                const name = symbol.replace('USDT', '');
                return (
                  <li key={symbol} className="watchlist-item">
                    <div className="watchlist-info">
                      <span className="fw-bold">{name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="mono-num fw-medium">
                        ${livePrice ? parseFloat(livePrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '---'}
                      </span>
                      <button onClick={() => removeFromWatchlist(symbol)} className="btn-remove">
                        <X size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
