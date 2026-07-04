import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import NatalView from './components/NatalView';
import SynastryView from './components/SynastryView';
import TransitView from './components/TransitView';
import TutorialView from './components/TutorialView';

export default function App() {
  const [view, setView] = useState('home');
  const [history, setHistory] = useState([]);
  const [loadedHistoryItem, setLoadedHistoryItem] = useState(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('astrology_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  const handleSaveHistory = (item) => {
    setHistory(prev => {
      // Avoid duplicate entries
      const filtered = prev.filter(x => 
        !(x.type === item.type && x.name === item.name && x.date === item.date && x.nameB === item.nameB && x.transitDate === item.transitDate)
      );
      // Keep up to 5 items
      const updated = [item, ...filtered].slice(0, 5);
      localStorage.setItem('astrology_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLoadHistory = (item) => {
    setLoadedHistoryItem(item);
    setView(item.type);
  };

  const handleNavigate = (targetView) => {
    setLoadedHistoryItem(null); // Clear loaded item when navigating manually
    setView(targetView);
  };

  return (
    <div className="app-container">
      {/* Premium Glassmorphic Header */}
      <header className="cosmic-header">
        <div className="logo-section" style={{ cursor: 'pointer' }} onClick={() => handleNavigate('home')}>
          <h1>
            星軌之鏡 <span>✦ Astrolabe</span>
          </h1>
        </div>
        <nav className="cosmic-nav">
          <button 
            className={`nav-btn ${view === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigate('home')}
          >
            首頁
          </button>
          <button 
            className={`nav-btn ${view === 'natal' ? 'active' : ''}`}
            onClick={() => handleNavigate('natal')}
          >
            本命盤解析
          </button>
          <button 
            className={`nav-btn ${view === 'synastry' ? 'active' : ''}`}
            onClick={() => handleNavigate('synastry')}
          >
            雙人合盤
          </button>
          <button 
            className={`nav-btn ${view === 'transit' ? 'active' : ''}`}
            onClick={() => handleNavigate('transit')}
          >
            行運預測
          </button>
          <button 
            className={`nav-btn ${view === 'tutorial' ? 'active' : ''}`}
            onClick={() => handleNavigate('tutorial')}
          >
            古典學術
          </button>
        </nav>
      </header>

      {/* Main Feature Layout */}
      <main className="main-content">
        {view === 'home' && (
          <HomeView 
            setView={handleNavigate} 
            history={history} 
            onLoadHistory={handleLoadHistory} 
          />
        )}
        {view === 'natal' && (
          <NatalView 
            onSaveHistory={handleSaveHistory} 
            loadedItem={loadedHistoryItem} 
          />
        )}
        {view === 'synastry' && (
          <SynastryView 
            onSaveHistory={handleSaveHistory} 
            loadedItem={loadedHistoryItem} 
          />
        )}
        {view === 'transit' && (
          <TransitView 
            onSaveHistory={handleSaveHistory} 
            loadedItem={loadedHistoryItem} 
          />
        )}
        {view === 'tutorial' && (
          <TutorialView />
        )}
      </main>

      {/* Cosmic Footer */}
      <footer className="cosmic-footer">
        <p style={{ marginBottom: '0.4rem' }}>
          星軌之鏡 ✦ 古典占星計算儀 © 2026 (v1.1.0)
        </p>
        <p style={{ fontSize: '0.75rem', opacity: '0.7' }}>
          理論源於西元二世紀克勞狄烏斯·托勒密（Claudius Ptolemaeus）所著之《占星四書》（Tetrabiblos）。
          本系統採用 100% 無版權爭議的原創文本及自主研發的高精度球面天文學算法構建。
        </p>
      </footer>
    </div>
  );
}
