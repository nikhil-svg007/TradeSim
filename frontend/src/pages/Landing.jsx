import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, BarChart3, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="var(--accent-gold)"/>
              <path d="M8 20L12 16L16 18L22 10L24 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 10V14H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1>TradeSim</h1>
          </div>
          <div className="landing-nav-buttons">
            <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Real-time Market Data
          </div>
          <h1 className="hero-title">
            Master Crypto Trading<br />
            <span className="hero-gradient">Without the Risk</span>
          </h1>
          <p className="hero-subtitle">
            Practice cryptocurrency trading with real market data from Binance. 
            Build your strategy, track your performance, and learn the markets—risk-free.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Trading Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              I Already Have an Account
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">$10K</div>
              <div className="stat-label">Virtual Balance</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Live</div>
              <div className="stat-label">Market Data</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">0%</div>
              <div className="stat-label">Risk Involved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need to Learn Trading</h2>
            <p className="section-subtitle">
              Professional-grade tools designed for serious learners
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon-blue">
                <TrendingUp size={24} />
              </div>
              <h3>Real-Time Prices</h3>
              <p>
                Live cryptocurrency prices streamed directly from Binance. 
                Experience real market conditions as they happen.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-green">
                <Shield size={24} />
              </div>
              <h3>Risk-Free Practice</h3>
              <p>
                Start with $10,000 in virtual funds. Make mistakes, learn strategies, 
                and build confidence without losing real money.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-yellow">
                <Zap size={24} />
              </div>
              <h3>Instant Execution</h3>
              <p>
                Execute trades instantly with our streamlined interface. 
                Focus on your strategy, not the platform.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-purple">
                <BarChart3 size={24} />
              </div>
              <h3>Performance Tracking</h3>
              <p>
                Detailed portfolio analytics and trade history. 
                Analyze your decisions and improve over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Start Trading in Minutes</h2>
            <p className="section-subtitle">
              No complex setup. No credit card required.
            </p>
          </div>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up in seconds with just your email and password</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Get Your Balance</h3>
              <p>Start with $10,000 virtual funds to practice with</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Start Trading</h3>
              <p>Buy and sell cryptocurrencies using real market data</p>
            </div>
          </div>
          <div className="how-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Learn Trading?</h2>
          <p>Join thousands of traders practicing risk-free</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <svg className="logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="var(--accent-gold)"/>
                <path d="M8 20L12 16L16 18L22 10L24 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 10V14H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1>TradeSim</h1>
            </div>
            <p>Professional crypto trading simulation</p>
          </div>
          <div className="footer-links">
            <div className="footer-link-group">
              <h4>Product</h4>
              <Link to="/login">Log In</Link>
              <Link to="/register">Sign Up</Link>
            </div>
            <div className="footer-link-group">
              <h4>Legal</h4>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 TradeSim. For educational purposes only. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
