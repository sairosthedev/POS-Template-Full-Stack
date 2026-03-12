import React, { useState, useEffect } from 'react';
import { 
  MonitorSmartphone, LayoutDashboard, Boxes, 
  CreditCard, LineChart, UsersRound, Store,
  UtensilsCrossed, Zap, WifiOff, ShieldCheck,
  CheckCircle2, ArrowRight
} from 'lucide-react';
import './index.css';

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Background Shapes */}
      <div className="bg-gradient-shapes">
        <div className="bg-shape-1"></div>
        <div className="bg-shape-2"></div>
        <div className="bg-shape-3"></div>
      </div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#" className="logo">
            <MonitorSmartphone className="logo-icon" size={28} />
            Salestrack
          </a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#benefits">Benefits</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#pricing">Pricing</a>
          </div>
          <a href="https://app.salestrack.co.zw/app/dashboard" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
            Access App
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="container hero-content">
          <div className="badge">
            <Store size={16} /> Retail & Hospitality Optimized
          </div>
          <h1 className="hero-title">The Ultimate Point of Sale System for Your Business</h1>
          <p className="hero-subtitle">
            Salestrack POS is a powerful and user-friendly Point of Sale system designed for businesses of all sizes. Join other businesses using Salestrack today.
          </p>
          <div className="hero-cta">
            <a href="https://app.salestrack.co.zw/auth/register" className="btn btn-primary">
              Get Started for Free <ArrowRight size={18} />
            </a>
            <a href="#features" className="btn btn-outline">
              Explore Features
            </a>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="section">
        <div className="container stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-value">200+</div>
            <div className="stat-label">Companies use Salestrack POS</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-value">100%</div>
            <div className="stat-label">Satisfaction from our users</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-value">2</div>
            <div className="stat-label">Years of providing the system</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Everything in One Place</h2>
            <p className="section-subtitle">Key features designed to help you run and scale your business effortlessly.</p>
          </div>
          <div className="features-grid">
            <div className="glass-card">
              <div className="feature-icon-wrapper"><MonitorSmartphone /></div>
              <h3 className="feature-title">Mobile POS App</h3>
              <p className="feature-desc">Fully functional mobile app that allows you to process sales on the go. Whether at your store or attending an event.</p>
            </div>
            <div className="glass-card">
              <div className="feature-icon-wrapper"><LayoutDashboard /></div>
              <h3 className="feature-title">Web Dashboard</h3>
              <p className="feature-desc">Gives you full control over your business. Track sales, manage products, and analyze reports in real-time.</p>
            </div>
            <div className="glass-card">
              <div className="feature-icon-wrapper"><Boxes /></div>
              <h3 className="feature-title">Inventory Management</h3>
              <p className="feature-desc">Avoid stockouts with a smart system. Add, edit, categorize products, track stock, and receive low-stock alerts.</p>
            </div>
            <div className="glass-card">
              <div className="feature-icon-wrapper"><CreditCard /></div>
              <h3 className="feature-title">Fast & Secure Payments</h3>
              <p className="feature-desc">Supports multiple payment methods including cash, mobile payments, and card transactions securely.</p>
            </div>
            <div className="glass-card">
              <div className="feature-icon-wrapper"><LineChart /></div>
              <h3 className="feature-title">Real-Time Sales Tracking</h3>
              <p className="feature-desc">Gain valuable insights with daily, weekly, or monthly sales tracking to make data-driven decisions.</p>
            </div>
            <div className="glass-card">
              <div className="feature-icon-wrapper"><UsersRound /></div>
              <h3 className="feature-title">Multi-User & Store Control</h3>
              <p className="feature-desc">Manage teams efficiently by assigning different roles, restricting or granting access to different parts of the system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience & Split Layout */}
      <section id="benefits" className="section">
        <div className="container split-section">
          <div>
            <h2 className="section-title">Who Can Use Salestrack POS?</h2>
            <p className="section-subtitle mb-8" style={{marginLeft: 0, textAlign: 'left'}}>
              Whether you're running a small shop or a multi-branch business, Salestrack POS helps you manage sales, inventory, and customers efficiently.
            </p>
            
            <div className="glass-card mb-4" style={{display:'flex', alignItems:'center', gap:'1rem', padding:'1.5rem'}}>
              <Store size={32} color="var(--primary)" />
              <div>
                <h4 style={{fontSize:'1.1rem', marginBottom:'0.2rem'}}>Retail & Wholesale Businesses</h4>
                <p style={{color:'var(--text-muted)'}}>Supermarkets, grocery stores, mini-marts</p>
              </div>
            </div>

            <div className="glass-card" style={{display:'flex', alignItems:'center', gap:'1rem', padding:'1.5rem'}}>
              <UtensilsCrossed size={32} color="var(--secondary)" />
              <div>
                <h4 style={{fontSize:'1.1rem', marginBottom:'0.2rem'}}>Hospitality & Service</h4>
                <p style={{color:'var(--text-muted)'}}>Restaurants, cafés, and fast food outlets</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="section-title mb-8">Explore the Benefits</h2>
            <div className="step-item">
              <div className="step-number"><Zap size={20} /></div>
              <div className="step-content">
                <h3>User-Friendly & Efficient</h3>
                <p>Easy-to-use interface that speeds up sales processing and improves customer experience.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number"><WifiOff size={20} /></div>
              <div className="step-content">
                <h3>Works Online & Offline</h3>
                <p>No internet? No problem! Sales continue offline and sync automatically when reconnected.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number"><ShieldCheck size={20} /></div>
              <div className="step-content">
                <h3>Scalable & Secure</h3>
                <p>Whether you’re a startup or a growing business, Salestrack POS scales with you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start / How to */}
      <section className="section" style={{background: 'rgba(255,255,255,0.02)'}}>
        <div className="container text-center mb-12">
          <h2 className="section-title">Starting with Salestrack is Easy</h2>
        </div>
        <div className="container stats-grid">
          <div className="glass-card text-center" style={{padding:'3rem 2rem'}}>
            <div style={{fontSize:'3rem', fontWeight:'800', opacity:0.2, marginBottom:'-2rem'}}>01</div>
            <h3 className="feature-title">Sign Up</h3>
            <p className="feature-desc">Create your account by registering your business. Fast, secure, and ready in minutes.</p>
          </div>
          <div className="glass-card text-center" style={{padding:'3rem 2rem'}}>
            <div style={{fontSize:'3rem', fontWeight:'800', opacity:0.2, marginBottom:'-2rem'}}>02</div>
            <h3 className="feature-title">Set Up Your Store</h3>
            <p className="feature-desc">Add store(s), assign users, load products, and available stock entries effortlessly.</p>
          </div>
          <div className="glass-card text-center" style={{padding:'3rem 2rem'}}>
            <div style={{fontSize:'3rem', fontWeight:'800', opacity:0.2, marginBottom:'-2rem'}}>03</div>
            <h3 className="feature-title">Start Selling</h3>
            <p className="feature-desc">Process sales via mobile app or web, track real-time inventory, and print receipts.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Happy Customers</h2>
            <p className="section-subtitle">What businesses think about Salestrack POS.</p>
          </div>
          <div className="testimonials-grid">
            <div className="glass-card testimonial-card">
              <p>Salestrack POS made managing my supermarket much easier. I can track sales, manage inventory, and monitor everything from the web dashboard. Highly recommended!</p>
              <div className="testimonial-author">
                <div className="avatar">TM</div>
                <div className="author-info">
                  <h4>Tawanda M</h4>
                  <span>Supermarket Owner</span>
                </div>
              </div>
            </div>
            <div className="glass-card testimonial-card">
              <p>Our staff finds it super easy to use, and the mobile app lets us process orders quickly. Salestrack POS has simplified everything for our restaurant.</p>
              <div className="testimonial-author">
                <div className="avatar">BN</div>
                <div className="author-info">
                  <h4>Blessing N.</h4>
                  <span>Restaurant Manager</span>
                </div>
              </div>
            </div>
            <div className="glass-card testimonial-card">
              <p>I love how the system works offline without interruptions. It’s reliable, fast, and the reporting helps me track profits in real-time.</p>
              <div className="testimonial-author">
                <div className="avatar">RK</div>
                <div className="author-info">
                  <h4>Ruth K.</h4>
                  <span>Retail Store Owner</span>
                </div>
              </div>
            </div>
            <div className="glass-card testimonial-card">
              <p>I run three hardware stores, and Salestrack POS allows me to monitor all branches from a single dashboard. Inventory tracking is a lifesaver!</p>
              <div className="testimonial-author">
                <div className="avatar">FD</div>
                <div className="author-info">
                  <h4>Farai D.</h4>
                  <span>Hardware Chain Owner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Simple, Flexible Pricing</h2>
            <p className="section-subtitle">For anyone. Comes with all unlimited features. Don't worry, there is no catch.</p>
          </div>
          <div className="glass-card pricing-card">
            <h3 style={{fontSize:'2rem', color:'var(--primary)'}}>Once Off</h3>
            <div className="price">Free</div>
            <ul className="pricing-features">
              <li><CheckCircle2 size={18} color="var(--primary)"/> Unlimited Products</li>
              <li><CheckCircle2 size={18} color="var(--primary)"/> Unlimited Transactions</li>
              <li><CheckCircle2 size={18} color="var(--primary)"/> Real-Time Reporting</li>
              <li><CheckCircle2 size={18} color="var(--primary)"/> Offline Support</li>
              <li><CheckCircle2 size={18} color="var(--primary)"/> Mobile & Web Access</li>
            </ul>
            <a href="https://app.salestrack.co.zw/auth/register" className="btn btn-primary" style={{width:'100%', padding:'1rem'}}>
              Get Started Now
            </a>
            <p style={{marginTop:'1.5rem', color:'var(--text-muted)', fontSize:'0.9rem'}}>Contact us for more info</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col" style={{gridColumn: 'span 1'}}>
              <a href="#" className="logo mb-4" style={{fontSize: '1.2rem', color:'white'}}>
                <MonitorSmartphone className="logo-icon" size={24} />
                Salestrack
              </a>
              <p style={{color:'var(--text-muted)'}}>The ultimate Point of Sale system bridging the gap between online flexibility and offline reliability.</p>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="https://www.salestrack.co.zw/faqs-pos">FAQ</a></li>
                <li><a href="https://www.salestrack.co.zw/contact-us">Contact Us</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="https://www.salestrack.co.zw/">POS</a></li>
                <li><a href="https://www.salestrack.co.zw/erp">ERP</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="https://www.salestrack.co.zw/terms-of-use">Terms of Use</a></li>
                <li><a href="https://www.salestrack.co.zw/privacy-policy">Privacy Policy</a></li>
                <li><a href="https://www.salestrack.co.zw/cookie-policy">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>Connect with us at <a href="mailto:info@salestrack.co.zw" style={{color:'var(--primary)', textDecoration:'none'}}>info@salestrack.co.zw</a></p>
            <p style={{marginTop: '0.5rem'}}>&copy; 2025 Salestrack. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
