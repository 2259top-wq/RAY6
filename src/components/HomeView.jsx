import React from 'react';

export default function HomeView({ setView, history, onLoadHistory }) {
  return (
    <div className="home-view">
      <div className="hero-section">
        <h2 className="hero-title">天球之鏡：托勒密古典星盤</h2>
        <p className="hero-subtitle">
          西洋占星術（Western Astrology）起源於西元前兩千年的美索不達米亞與古巴比倫。
          最核心的理論基礎來自西元二世紀天文學家克勞狄烏斯·托勒密（Claudius Ptolemaeus）所著的《占星四書》（Tetrabiblos）。
          該著作統整了希臘化時代的古典占星體系，確立了行星、黃道十二宮與後天宮位的對應規律，為後世的西方占星奠定了科學與哲學基礎。
        </p>
        <button className="cosmic-btn" onClick={() => setView('natal')}>
          開啟我的本命盤
        </button>
      </div>

      <div className="features-grid">
        <div className="glass-card feature-card" onClick={() => setView('natal')}>
          <h3>☉ 本命盤解析 (Natal Chart)</h3>
          <p>輸入精確的出生時間與經緯度，繪製個人專屬的天宮圖，分析十顆守護行星落入黃道宮位與後天宮位的能量分布，解密靈魂藍圖。</p>
        </div>

        <div className="glass-card feature-card" onClick={() => setView('synastry')}>
          <h3>♀ 雙人合盤 (Synastry / Composite)</h3>
          <p>重疊兩個靈魂的宇宙地圖，分析雙方行星之間的角度連結（合相、三分相、對分相），解讀雙方互動中的和諧天賦與宿命磨合考驗。</p>
        </div>

        <div className="glass-card feature-card" onClick={() => setView('transit')}>
          <h3>♄ 流年行運 (Transits Forecast)</h3>
          <p>將當前或未來特定時刻的宇宙天體位置（外圈流年），重疊於你的個人本命盤（內圈本命），預測當前宇宙能量對你的心理與現實衝擊。</p>
        </div>
      </div>

      {history && history.length > 0 && (
        <div className="history-section glass-card">
          <h2>★ 最近繪製的星盤</h2>
          <div className="history-list">
            {history.map((item, index) => (
              <div 
                key={`history-${index}`} 
                className="history-item"
                onClick={() => onLoadHistory(item)}
              >
                <div>
                  <span className="name">{item.name}</span>
                  {item.type === 'synastry' && (
                    <span className="name"> ＆ {item.nameB}</span>
                  )}
                </div>
                <div className="details">
                  {item.type === 'natal' && `本命盤 - ${item.date} ${item.time} (${item.cityName})`}
                  {item.type === 'synastry' && `雙人合盤 - ${item.name} & ${item.nameB}`}
                  {item.type === 'transit' && `行運盤 - ${item.name} (${item.transitDate})`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tetrabiblos-intro glass-card">
        <h2>《占星四書》的古典占星核心</h2>
        <p>
          在托勒密的古典體系中，宇宙被理解為一個相互關聯的有機整體。天體的運動透過其產生的「熱、濕、乾、冷」物理本質，對地球上的生命與人類心理施加微妙的影響。
          黃道十二宮則代表了太陽一年運行的不同季節節奏（二至二分點），反映出萬物成長、繁茂、收割與沉寂的生命週期。
        </p>
        <p>
          本站遵循托勒密古典希臘占星體系，採用嚴謹的球面三角學運算，提供高精度的星盤計算與解讀，
          幫助您透過亙古不變的星光軌跡，洞察命運的起承轉合。
        </p>
      </div>
    </div>
  );
}
