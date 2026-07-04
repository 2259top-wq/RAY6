import React, { useState, useEffect } from 'react';
import ChartWheel from './ChartWheel';
import { calculateNatalChart, calculateSynastryAspects, MAJOR_CITIES, normalizeAngle } from '../utils/astrology';
import { getTransitPrediction, PLANETS_IN_SIGNS, generateTransitOracle } from '../utils/interpretations';

export default function TransitView({ onSaveHistory, loadedItem }) {
  // Format current date and time for input fields
  const getNowStrings = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return { dateStr, timeStr };
  };

  const { dateStr: todayDate, timeStr: todayTime } = getNowStrings();

  const [formData, setFormData] = useState({
    name: '古典占星探索者',
    date: '2000-01-01',
    time: '12:00',
    cityIndex: '0',
    isManual: false,
    lat: '25.033',
    lon: '121.565',
    timezone: '8',

    transitDate: todayDate,
    transitTime: todayTime,
    houseSystem: 'Porphyry'
  });

  const [natalChart, setNatalChart] = useState(null);
  const [transitData, setTransitData] = useState(null);
  const [transitAspects, setTransitAspects] = useState([]);

  const [activeTab, setActiveTab] = useState('aspects');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (loadedItem && loadedItem.type === 'transit') {
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
        transitDate: loadedItem.transitDate,
        transitTime: loadedItem.transitTime,
        houseSystem: loadedItem.houseSystem || 'Porphyry'
      });
      calculateTransit(loadedItem);
    } else {
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

  const calculateTransit = (data) => {
    // 1. Calculate Natal Chart
    const nChart = calculateNatalChart(data.date, data.time, data.lat, data.lon, data.timezone, data.houseSystem);

    // 2. Calculate Transit coordinates at Target date/time
    // (We treat it as a temporary birth chart at the transit location. We can use same latitude/longitude, or set it to same time)
    // Actually, transit positions of planets are geocentric, which means they are the same worldwide, 
    // but we use the timezone of transit date to get correct UTC time.
    const tChart = calculateNatalChart(data.transitDate, data.transitTime, data.lat, data.lon, data.timezone, data.houseSystem);

    // 3. Aspects: from Transit (outer) to Natal (inner)
    const tAspects = calculateSynastryAspects(tChart.planets, nChart.planets);

    setNatalChart(nChart);
    setTransitData(tChart);
    setTransitAspects(tAspects);
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    const latNum = parseFloat(formData.lat);
    const lonNum = parseFloat(formData.lon);
    const tzNum = parseFloat(formData.timezone);

    if (isNaN(latNum) || isNaN(lonNum) || isNaN(tzNum)) {
      alert('請檢查輸入的數值是否正確');
      return;
    }

    const cityName = formData.isManual ? '自訂坐標' : MAJOR_CITIES[Number(formData.cityIndex)].name;

    const data = {
      type: 'transit',
      name: formData.name,
      date: formData.date,
      time: formData.time,
      lat: latNum,
      lon: lonNum,
      timezone: tzNum,
      cityName,
      transitDate: formData.transitDate,
      transitTime: formData.transitTime,
      houseSystem: formData.houseSystem,
      timestamp: Date.now()
    };

    calculateTransit(data);
    setSelectedItem(null);
    onSaveHistory(data);
  };

  const displayItem = hoveredItem || selectedItem;

  const renderDetailsPanel = () => {
    if (!displayItem) {
      return (
        <div className="details-glow-box" style={{ borderLeftColor: 'rgba(255, 255, 255, 0.15)' }}>
          <h4>✧ 流年預測與運勢詳解</h4>
          <p>在左側雙重星盤（內圈為你的本命盤，外圈為流年行星）中點擊流年相位線，或選取下方列表中的流年項目，此處將展示其運勢預測與行動指南。</p>
        </div>
      );
    }

    if (displayItem.type === 'aspect') {
      const asp = displayItem.data;
      const forecastText = getTransitPrediction(asp.p2, asp.p1, asp.aspectName);

      return (
        <div className="details-glow-box" style={{ borderLeftColor: asp.color }}>
          <h4>
            <span style={{ color: asp.color }}>{asp.aspectSymbol}</span>
            流年 {asp.p1Name} 影響 你的本命 {asp.p2Name} ({asp.aspectName} - {asp.exactAngle.toFixed(1)}°)
          </h4>
          <p><strong>運勢分析：</strong>{forecastText || `此時流年 ${asp.p1Name} 與你的本命 ${asp.p2Name} 呈 ${asp.aspectName}，促使你在相關的生活領域進行思維轉化或採取行動。`}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>相位意義：</strong>{asp.description}
          </p>
        </div>
      );
    }

    if (displayItem.type === 'planet') {
      const pKey = displayItem.key;
      const pName = displayItem.data.name;
      const zName = displayItem.data.zodiac.name;
      const signText = PLANETS_IN_SIGNS[pKey]?.[displayItem.data.zodiac.english] || '';

      return (
        <div className="details-glow-box" style={{ borderLeftColor: displayItem.data.color }}>
          <h4>
            <span style={{ color: displayItem.data.color }}>{displayItem.data.symbol}</span>
            當前流年 {pName} 運行於 {zName}
          </h4>
          <p><strong>天象氣氛：</strong>{signText ? signText.replace('你具有', '集體意識在此時傾向於').replace('你將', '大眾傾向於') : '正在為整個社會背景帶來特殊的心理能量氣候。'}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            流年行星代表當前大宇宙的行星背景氣候。它穿行於黃道星座時，會向所有人播撒對應星座的能量調性。
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="transit-view">
      <form onSubmit={handleCalculate} className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Birth Info */}
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--neon-cyan)' }}>
              1. 本命星盤配置 (內圈)
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label>姓名</label>
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
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <input
                  type="checkbox"
                  name="isManual"
                  checked={formData.isManual}
                  onChange={handleChange}
                />
                手動輸入出生地坐標
              </label>
              {!formData.isManual ? (
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
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    placeholder="緯度"
                    className="cosmic-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    name="lon"
                    value={formData.lon}
                    onChange={handleChange}
                    placeholder="經度"
                    className="cosmic-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    placeholder="時差"
                    className="cosmic-input"
                    style={{ flex: 1 }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Transit Date Info */}
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--neon-purple)' }}>
              2. 預測行運時間 (外圈)
            </h3>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>預測目標日期</label>
              <input
                type="date"
                name="transitDate"
                value={formData.transitDate}
                onChange={handleChange}
                className="cosmic-input"
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>預測目標時間</label>
              <input
                type="time"
                name="transitTime"
                value={formData.transitTime}
                onChange={handleChange}
                className="cosmic-input"
                required
              />
            </div>
            <div className="form-group">
              <label>宮位制選擇</label>
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
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-glass)', paddingTop: '1.2rem', marginTop: '1rem' }}>
          <button type="submit" className="cosmic-btn">繪製行運預測圖</button>
        </div>
      </form>

      {natalChart && transitData && (
        <div className="chart-layout">
          <div className="chart-wheel-container">
            {/* Draw a dual chart wheel: Inner is Natal, Outer overlay is Transit planets, center lines are transit-to-natal aspects */}
            <ChartWheel
              chartData={natalChart}
              transitData={{
                planets: transitData.planets,
                transitAspects: transitAspects
              }}
              onHover={setHoveredItem}
              activeHover={hoveredItem}
            />
          </div>

          <div className="chart-report-container">
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>♄ 行運預測：{formData.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                本命盤：{natalChart.birthDateLocal} | 行運預測時間：{formData.transitDate} {formData.transitTime}
              </p>
              
              {renderDetailsPanel()}
            </div>

            <div className="glass-card">
              <div className="report-tabs">
                <button
                  className={`report-tab-btn ${activeTab === 'aspects' ? 'active' : ''}`}
                  onClick={() => setActiveTab('aspects')}
                >
                  活躍流年相位 ({transitAspects.length})
                </button>
                <button
                  className={`report-tab-btn ${activeTab === 'transitPlanets' ? 'active' : ''}`}
                  onClick={() => setActiveTab('transitPlanets')}
                >
                  當前流年星點
                </button>
              </div>

              {activeTab === 'aspects' && (
                <div className="aspects-list">
                  {transitAspects.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                      此時流年行星對你的本命盤無顯著的主要相位衝突或增益。
                    </p>
                  ) : (
                    transitAspects.map((asp, idx) => (
                      <div
                        key={`trans-asp-${idx}`}
                        className="aspect-item-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedItem({ type: 'aspect', index: idx, data: asp })}
                      >
                        <div className="aspect-title">
                          <span className="names">
                            <span style={{ color: '#00f0ff' }}>流年 {asp.p1Symbol} {asp.p1Name}</span>
                            <span style={{ color: asp.color }}>{asp.aspectSymbol} {asp.aspectName}</span>
                            <span style={{ color: natalChart.planets[asp.p2].color }}>本命 {asp.p2Symbol} {asp.p2Name}</span>
                          </span>
                          <span className="aspect-badge" style={{ backgroundColor: `${asp.color}15`, color: asp.color, border: `1px solid ${asp.color}33` }}>
                            {asp.exactAngle.toFixed(1)}°
                          </span>
                        </div>
                        <p className="aspect-desc">
                          {getTransitPrediction(asp.p2, asp.p1, asp.aspectName) || asp.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'transitPlanets' && (
                <div className="astro-table-wrapper">
                  <table className="astro-table">
                    <thead>
                      <tr>
                        <th>流年天體</th>
                        <th>黃道位置</th>
                        <th>本命宮位影響</th>
                        <th>逆行狀態</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(transitData.planets).map(p => {
                        const natalHouse = natalChart ? calculateTransitHouse(p.longitude, natalChart.cusps) : '-';
                        return (
                          <tr 
                            key={p.key}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedItem({ type: 'planet', key: p.key, data: p, isTransit: true })}
                          >
                            <td style={{ color: '#00f0ff', fontWeight: 'bold' }}>
                              {p.symbol} {p.name}
                            </td>
                            <td>{p.zodiac.formatted}</td>
                            <td>進入本命第 {natalHouse} 宮</td>
                            <td style={{ color: p.isRetrograde ? '#ff3333' : '#00e5a3' }}>
                              {p.isRetrograde ? '逆行 ℞' : '順行'}
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
        </div>
      )}

      {/* 行運星曜脈動預報 (算出來的動態總結 - 約1000字) */}
      {transitAspects && (() => {
        const report = generateTransitOracle(transitAspects);
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
                  根據流年星體交互相位精密演算之時空運勢整合報告
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.8', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {report.sections.map((sec, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '0.6rem', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem' }}>◆</span> {sec.header}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {sec.content.split('\n').filter(p => p.trim()).map((pText, pIdx) => (
                      <p key={pIdx} style={{ textIndent: '2em', margin: 0, textAlign: 'justify' }}>
                        {pText}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}// Helper to calculate which house a longitude falls into relative to natal houses
function calculateTransitHouse(longitude, cusps) {
  for (let i = 1; i <= 12; i++) {
    const start = cusps[i];
    const end = cusps[i === 12 ? 1 : i + 1];
    if (start < end) {
      if (longitude >= start && longitude < end) return i;
    } else {
      if (longitude >= start || longitude < end) return i;
    }
  }
  return 1;
}
