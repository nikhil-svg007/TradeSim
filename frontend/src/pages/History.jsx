import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Search, ArrowRightLeft } from 'lucide-react';

const History = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [filterSymbol, setFilterSymbol] = useState('');

  useEffect(() => {
    fetchTrades();
  }, [page, filterType, filterSymbol]);

  const fetchTrades = async () => {
    try {
      const params = { page, limit: 10 };
      if (filterType) params.type = filterType;
      if (filterSymbol) params.symbol = filterSymbol;

      const res = await axios.get('/trade', { params });
      setTrades(res.data.trades);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching trades', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1); 
    fetchTrades();
  };

  return (
    <div className="history-page">
      <div className="card">
        <h2 className="section-title">
          <div className="flex items-center gap-2">
            <HistoryIcon size={20} className="text-muted" />
            Trade History
          </div>
        </h2>
        
        <form onSubmit={handleFilterSubmit} className="filters-form flex items-center gap-2 mb-4">
          <div className="form-input-group" style={{maxWidth: '200px'}}>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{background: 'transparent', border: 'none', color: 'var(--text-primary)', flex: 1, padding: '12px 0', outline: 'none'}}>
              <option value="" style={{color: 'black'}}>All Types</option>
              <option value="BUY" style={{color: 'black'}}>Buy</option>
              <option value="SELL" style={{color: 'black'}}>Sell</option>
            </select>
          </div>
          <div className="form-input-group" style={{maxWidth: '300px'}}>
            <Search size={16} className="text-muted" style={{marginRight: '8px'}} />
            <input 
              type="text" 
              placeholder="Symbol (e.g. BTC)" 
              value={filterSymbol} 
              onChange={(e) => setFilterSymbol(e.target.value.toUpperCase())}
              style={{background: 'transparent', border: 'none', color: 'var(--text-primary)', flex: 1, padding: '12px 0', outline: 'none'}}
            />
          </div>
        </form>

        {loading ? (
          <div className="loading">Loading history...</div>
        ) : trades.length === 0 ? (
          <div className="empty-state">No trades found matching your criteria.</div>
        ) : (
          <>
            <div className="table-responsive mt-4">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date / Time</th>
                    <th>Action</th>
                    <th>Asset</th>
                    <th>Quantity</th>
                    <th>Execution Price</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map(trade => (
                    <tr key={trade._id}>
                      <td className="text-muted text-sm">{new Date(trade.executedAt).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${trade.type === 'BUY' ? 'badge-primary' : 'badge-danger'}`} style={{background: trade.type === 'BUY' ? 'var(--trade-up-bg)' : 'var(--trade-down-bg)', color: trade.type === 'BUY' ? 'var(--trade-up)' : 'var(--trade-down)'}}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="fw-bold">{trade.symbol.replace('USDT', '')}</td>
                      <td className="mono-num">{parseFloat(trade.quantity).toFixed(6)}</td>
                      <td className="mono-num">${parseFloat(trade.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="fw-bold mono-num text-primary">${parseFloat(trade.totalValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="btn btn-sm btn-secondary"
                >
                  Previous
                </button>
                <span className="page-info fw-medium">Page {page} of {totalPages}</span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className="btn btn-sm btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;
