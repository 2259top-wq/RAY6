import React, { useState, useEffect } from 'react';
import ChartWheel from './ChartWheel';
import { calculateNatalChart, MAJOR_CITIES } from '../utils/astrology';
import { PLANETS_IN_SIGNS, PLANETS_IN_HOUSES, getAspectInterpretation, generateNatalOracle } from '../utils/interpretations';

export default function NatalView({ onSaveHistory, loadedItem }) {
  const [formData, setFormData] = useState({
    name: '古典占星探索者',
    date: '2000-01-01',
    time: '12:00',
    cityIndex: '0',
    isManual: false,
    lat: '25.033',
    lon: '121.565',
    timezone: '8',
    houseSystem: 'Porphyry'
  });

  const [chart, setChart] = useState(null);
  const [activeTab, setActiveTab] = useState('planets');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Load history item if supplied
  useEffect(() => {
    if (loadedItem) {
      const cityIdx = MAJOR_CITIES.findIndex(c => c.name === loadedItem.cityName);
      setFormData({
        name: loadedItem.name,
        date: loadedItem.date,
        time: loadedItem.time,
        cityIndex: cityIdx >= 0 ? String(cityIdx) : '0',
        isManual: cityIdx < 0,
        lat: String(loadedItem.lat),
        lon: String(loadedItem.lon),
        timezone: String(loadedItem.timezone),
        houseSystem: loadedItem.houseSystem || 'Porphyry'
      });
      const computed = calculateNatalChart(
        loadedItem.date,
        loadedItem.time,
        loadedItem.lat,
        loadedItem.lon,
        loadedItem.timezone,
        loadedItem.houseSystem || 'Porphyry'
      );
      setChart(computed);
    } else {
      // Generate default chart on mount
      handleCalculate();
    }
  }, [loadedItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // If not manual, fill city coords
      if (name === 'cityIndex' && !updated.isManual) {
        const city = MAJOR_CITIES[Number(value)];
        if (city) {
          updated.lat = String(city.lat);
          updated.lon = String(city.lon);
          updated.timezone = String(city.timezone);
        }
      }
      return updated;
    });
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    const latNum = parseFloat(formData.lat);
    const lonNum = parseFloat(formData.lon);
    const tzNum = parseFloat(formData.timezone);

    if (isNaN(latNum) || isNaN(lonNum) || isNaN(tzNum)) {
      alert('請輸入有效的數值');
      return;
    }

    const computed = calculateNatalChart(
      formData.date,
      formData.time,
      latNum,
      lonNum,
      tzNum,
      formData.houseSystem
    );
    setChart(computed);
    setSelectedItem(null);

    // Save to history
    const cityName = formData.isManual ? '自訂坐標' : MAJOR_CITIES[Number(formData.cityIndex)].name;
    onSaveHistory({
      type: 'natal',
      name: formData.name,
      date: formData.date,
      time: formData.time,
      lat: latNum,
      lon: lonNum,
      timezone: tzNum,
      cityName,
      houseSystem: formData.houseSystem,
      timestamp: Date.now()
    });
  };

  // Get active item details to display in the report text area
  const displayItem = hoveredItem || selectedItem;

  const renderDetailsPanel = () => {
    if (!displayItem) {
      return (
        <div className="details-glow-box" style={{ borderLeftColor: 'rgba(255, 255, 255, 0.15)' }}>
          <h4>✧ 星座與宮位詳解</h4>
          <p>在左側星盤中懸停鼠標或在下方表格中點擊任意「行星」或「相位」，此處將展示其深刻的古典占星解讀與生命啟示。</p>
        </div>
      );
    }

    if (displayItem.type === 'planet') {
      const pKey = displayItem.key;
      const pName = displayItem.data.name;
      const zName = displayItem.data.zodiac.name;
      const hNum = displayItem.data.house;

      const signText = PLANETS_IN_SIGNS[pKey]?.[displayItem.data.zodiac.english] || '解讀編寫中...';
      const houseText = PLANETS_IN_HOUSES[pKey]?.[hNum] || '解讀編寫中...';

      return (
        <div className="details-glow-box" style={{ borderLeftColor: displayItem.data.color }}>
          <h4>
            <span style={{ color: displayItem.data.color }}>{displayItem.data.symbol}</span>
            {pName} 落入 {zName} & 第 {hNum} 宮
          </h4>
          <p style={{ marginBottom: '0.75rem' }}><strong>星曜座落：</strong>{signText}</p>
          <p><strong>宮位配置：</strong>{houseText}</p>
        </div>
      );
    }

    if (displayItem.type === 'aspect') {
      const asp = displayItem.data;
      const text = getAspectInterpretation(asp.p1, asp.p2, asp.aspectName);
      return (
        <div className="details-glow-box" style={{ borderLeftColor: asp.color }}>
          <h4>
            <span style={{ color: asp.color }}>{asp.aspectSymbol}</span>
            {asp.p1Name} 與 {asp.p2Name} 呈 {asp.aspectName} ({asp.exactAngle.toFixed(1)}°)
          </h4>
          <p>{text}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>相位特質：</strong>{asp.description} (誤差容許度：{asp.diff.toFixed(1)}°)
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="natal-view">
      <form onSubmit={handleCalculate} className="glass-card" style={{ marginBottom: '2rem' }}>
        <div className="form-grid">
          <div className="form-group">
            <label>探索者姓名</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="cosmic-input"
              required
            />
          </div>
          <div className="form-group">
            <label>出生日期</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="cosmic-input"
              required
            />
          </div>
          <div className="form-group">
            <label>出生時間</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="cosmic-input"
              required
            />
          </div>
          <div className="form-group">
            <label>後天宮位制</label>
            <select
              name="houseSystem"
              value={formData.houseSystem}
              onChange={handleChange}
              className="cosmic-select"
            >
              <option value="Porphyry">波菲里制 (Porphyry)</option>
              <option value="Equal">等宮制 (Equal)</option>
            </select>
          </div>
        </div>

        <div className="form-grid" style={{ gridTemplateColumns: formData.isManual ? '1fr 1fr 1fr 1fr' : '2fr 1fr' }}>
          {!formData.isManual ? (
            <div className="form-group">
              <label>出生城市</label>
              <select
                name="cityIndex"
                value={formData.cityIndex}
                onChange={handleChange}
                className="cosmic-select"
              >
                {MAJOR_CITIES.map((city, idx) => (
                  <option key={idx} value={idx}>
                    {city.name} ({city.country}) - GMT+{city.timezone}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>緯度 (北緯為正，如 25.03)</label>
                <input
                  type="text"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  className="cosmic-input"
                />
              </div>
              <div className="form-group">
                <label>經度 (東經為正，如 121.56)</label>
                <input
                  type="text"
                  name="lon"
                  value={formData.lon}
                  onChange={handleChange}
                  className="cosmic-input"
                />
              </div>
              <div className="form-group">
                <label>時區時差 (GMT offset, 如 8)</label>
                <input
                  type="text"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="cosmic-input"
                />
              </div>
            </>
          )}

          <div className="form-group" style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: '1.2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isManual"
                checked={formData.isManual}
                onChange={handleChange}
              />
              手動輸入精確坐標
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="cosmic-btn">繪製本命星盤</button>
        </div>
      </form>

      {chart && (
        <div className="chart-layout">
          <div className="chart-wheel-container">
            <ChartWheel
              chartData={chart}
              onHover={setHoveredItem}
              activeHover={hoveredItem}
            />
          </div>

          <div className="chart-report-container">
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>☉ 宇宙報告：{formData.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                出生時間：{chart.birthDateLocal} (UTC{chart.timezone >= 0 ? `+${chart.timezone}` : chart.timezone}) | 
                宮位制：{chart.houseSystem === 'Equal' ? '等宮制' : '波菲里制'}
              </p>
              
              {renderDetailsPanel()}
            </div>

            <div className="glass-card">
              <div className="report-tabs">
                <button
                  className={`report-tab-btn ${activeTab === 'planets' ? 'active' : ''}`}
                  onClick={() => setActiveTab('planets')}
                >
                  星體落點
                </button>
                <button
                  className={`report-tab-btn ${activeTab === 'houses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('houses')}
                >
                  後天宮位
                </button>
                <button
                  className={`report-tab-btn ${activeTab === 'aspects' ? 'active' : ''}`}
                  onClick={() => setActiveTab('aspects')}
                >
                  相位矩陣
                </button>
              </div>

              {activeTab === 'planets' && (
                <div className="astro-table-wrapper">
                  <table className="astro-table">
                    <thead>
                      <tr>
                        <th>星體</th>
                        <th>黃道星座</th>
                        <th>落入宮位</th>
                        <th>狀態</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(chart.planets).map(p => (
                        <tr 
                          key={p.key} 
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedItem({ type: 'planet', key: p.key, data: p })}
                        >
                          <td style={{ color: p.color, fontWeight: 'bold' }}>
                            {p.symbol} {p.name}
                          </td>
                          <td>{p.zodiac.formatted}</td>
                          <td>第 {p.house} 宮</td>
                          <td style={{ color: p.isRetrograde ? '#ff3333' : '#00e5a3' }}>
                            {p.isRetrograde ? '逆行 ℞' : '順行'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'houses' && (
                <div className="astro-table-wrapper">
                  <table className="astro-table">
                    <thead>
                      <tr>
                        <th>宮位</th>
                        <th>宮頭位置</th>
                        <th>黃道度數</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chart.houses.map(h => (
                        <tr key={h.number}>
                          <td style={{ fontWeight: 'bold' }}>第 {h.number} 宮</td>
                          <td style={{ color: h.zodiac.color }}>{h.zodiac.name}</td>
                          <td>{h.zodiac.formatted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'aspects' && (
                <div className="aspects-list">
                  {chart.aspects.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                      未檢測到容許度範圍內的主要相位。
                    </p>
                  ) : (
                    chart.aspects.map((asp, idx) => (
                      <div
                        key={`asp-${idx}`}
                        className="aspect-item-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedItem({ type: 'aspect', index: idx, data: asp })}
                      >
                        <div className="aspect-title">
                          <span className="names">
                            <span style={{ color: chart.planets[asp.p1].color }}>{asp.p1Symbol} {asp.p1Name}</span>
                            <span style={{ color: asp.color }}>{asp.aspectSymbol} {asp.aspectName}</span>
                            <span style={{ color: chart.planets[asp.p2].color }}>{asp.p2Symbol} {asp.p2Name}</span>
                          </span>
                          <span className="aspect-badge" style={{ backgroundColor: `${asp.color}15`, color: asp.color, border: `1px solid ${asp.color}33` }}>
                            {asp.exactAngle.toFixed(1)}° (軌道差 {asp.diff.toFixed(1)}°)
                          </span>
                        </div>
                        <p className="aspect-desc">{asp.description}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 個人星體能量整合報告 (算出來的動態總結 - 約1000字) */}
      {chart && (() => {
        const report = generateNatalOracle(chart);
        if (!report) return null;
        return (
          <div className="glass-card" style={{ marginTop: '2.5rem', border: '1px solid rgba(0, 240, 255, 0.2)', background: 'linear-gradient(135deg, rgba(15, 10, 30, 0.7) 0%, rgba(10, 20, 35, 0.7) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--neon-cyan)' }}>✦</span>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--neon-gold)', margin: 0, fontSize: '1.25rem', letterSpacing: '0.05em' }}>
                  {report.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  根據您本命盤天體元素分佈與日月升黃金三角精密演算之個人整合報告
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.8', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {report.sections.map((sec, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '0.6rem', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem' }}>◆</span> {sec.header}
                  </h4>
                  <p style={{ textIndent: '2em', margin: 0, textAlign: 'justify' }}>
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
