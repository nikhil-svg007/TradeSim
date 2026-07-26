import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('/portfolio/leaderboard');
        setLeaderboard(res.data.leaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title m-0">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-accent-gold" style={{color: 'var(--accent-gold)'}} />
              Global Leaderboard
            </div>
          </h2>
          <div className="badge badge-primary" style={{background: 'rgba(41, 98, 255, 0.1)', color: 'var(--accent-blue)', border: '1px solid rgba(41, 98, 255, 0.3)'}}>
            Top 50 Traders
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading rankings...</div>
        ) : (
          <div className="table-responsive mt-4">
            <table className="data-table leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Trader</th>
                  <th>Total Portfolio Value</th>
                  <th>Net Return</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((trader, index) => {
                  const initialBalance = 10000;
                  const returnPct = ((trader.totalPortfolioValue - initialBalance) / initialBalance) * 100;
                  const isProfit = returnPct >= 0;
                  const isCurrentUser = user && trader._id === user.id;

                  return (
                    <tr key={trader._id} className={isCurrentUser ? 'current-user-row' : ''}>
                      <td className="rank-cell mono-num">
                        {index === 0 && '🥇 '}
                        {index === 1 && '🥈 '}
                        {index === 2 && '🥉 '}
                        #{index + 1}
                      </td>
                      <td>
                        <div className="trader-info">
                          <div className="avatar sm">{trader.email.substring(0, 2).toUpperCase()}</div>
                          <span className={isCurrentUser ? 'fw-bold text-primary' : ''}>
                            {trader.email.split('@')[0]}
                            {isCurrentUser && ' (You)'}
                          </span>
                        </div>
                      </td>
                      <td className="fw-bold mono-num text-primary">
                        ${trader.totalPortfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                      <td className={`mono-num ${isProfit ? 'text-success' : 'text-danger'}`}>
                        <div className="flex items-center gap-2 justify-end fw-bold">
                          {isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {isProfit ? '+' : ''}{returnPct.toFixed(2)}%
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
  );
};

export default Leaderboard;
