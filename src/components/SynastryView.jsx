import React, { useState, useEffect } from 'react';
import ChartWheel from './ChartWheel';
import { calculateNatalChart, calculateSynastryAspects, MAJOR_CITIES } from '../utils/astrology';
import { calculateCompatibility, getAspectInterpretation, generateSynastryOracle } from '../utils/interpretations';

export default function SynastryView({ onSaveHistory, loadedItem }) {
  const [formData, setFormData] = useState({
    nameA: '探索者甲',
    dateA: '2000-01-01',
    timeA: '12:00',
    cityIndexA: '0',
    isManualA: false,
    latA: '25.033',
    lonA: '121.565',
    timezoneA: '8',

    nameB: '探索者乙',
    dateB: '2002-05-15',
    timeB: '18:30',
    cityIndexB: '5', // Tokyo
    isManualB: false,
    latB: '35.676',
    lonB: '139.650',
    timezoneB: '9',

    houseSystem: 'Porphyry'
  });

  const [chartA, setChartA] = useState(null);
  const [chartB, setChartB] = useState(null);
  const [synastryAspects, setSynastryAspects] = useState([]);
  const [compReport, setCompReport] = useState(null);

  const [activeTab, setActiveTab] = useState('aspects');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (loadedItem && loadedItem.type === 'synastry') {
      const cityIdxA = MAJOR_CITIES.findIndex(c => c.name === loadedItem.cityNameA);
      const cityIdxB = MAJOR_CITIES.findIndex(c => c.name === loadedItem.cityNameB);
      setFormData({
        nameA: loadedItem.name,
        dateA: loadedItem.date,
        timeA: loadedItem.time,
        cityIndexA: cityIdxA >= 0 ? String(cityIdxA) : '0',
        isManualA: cityIdxA < 0,
        latA: String(loadedItem.lat),
        lonA: String(loadedItem.lon),
        timezoneA: String(loadedItem.timezone),

        nameB: loadedItem.nameB,
        dateB: loadedItem.dateB,
        timeB: loadedItem.timeB,
        cityIndexB: cityIdxB >= 0 ? String(cityIdxB) : '0',
        isManualB: cityIdxB < 0,
        latB: String(loadedItem.latB),
        lonB: String(loadedItem.lonB),
        timezoneB: String(loadedItem.timezoneB),

        houseSystem: loadedItem.houseSystem || 'Porphyry'
      });
      calculateSynastry(loadedItem);
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

      // Auto coords fill for Person A
      if (name === 'cityIndexA' && !updated.isManualA) {
        const city = MAJOR_CITIES[Number(value)];
        if (city) {
          updated.latA = String(city.lat);
          updated.lonA = String(city.lon);
          updated.timezoneA = String(city.timezone);
        }
      }

      // Auto coords fill for Person B
      if (name === 'cityIndexB' && !updated.isManualB) {
        const city = MAJOR_CITIES[Number(value)];
        if (city) {
          updated.latB = String(city.lat);
          updated.lonB = String(city.lon);
          updated.timezoneB = String(city.timezone);
        }
      }
      return updated;
    });
  };

  const calculateSynastry = (data) => {
    const cA = calculateNatalChart(data.date, data.time, data.lat, data.lon, data.timezone, data.houseSystem);
    const cB = calculateNatalChart(data.dateB, data.timeB, data.latB, data.lonB, data.timezoneB, data.houseSystem);
    const sAspects = calculateSynastryAspects(cA.planets, cB.planets);
    const compatibility = calculateCompatibility(sAspects);

    setChartA(cA);
    setChartB(cB);
    setSynastryAspects(sAspects);
    setCompReport(compatibility);
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    const latA = parseFloat(formData.latA);
    const lonA = parseFloat(formData.lonA);
    const tzA = parseFloat(formData.timezoneA);

    const latB = parseFloat(formData.latB);
    const lonB = parseFloat(formData.lonB);
    const tzB = parseFloat(formData.timezoneB);

    if (isNaN(latA) || isNaN(lonA) || isNaN(tzA) || isNaN(latB) || isNaN(lonB) || isNaN(tzB)) {
      alert('請檢查輸入的數值是否正確');
      return;
    }

    const cityA = formData.isManualA ? '自訂坐標' : MAJOR_CITIES[Number(formData.cityIndexA)].name;
    const cityB = formData.isManualB ? '自訂坐標' : MAJOR_CITIES[Number(formData.cityIndexB)].name;

    const data = {
      type: 'synastry',
      name: formData.nameA,
      date: formData.dateA,
      time: formData.timeA,
      lat: latA,
      lon: lonA,
      timezone: tzA,
      cityNameA: cityA,

      nameB: formData.nameB,
      dateB: formData.dateB,
      timeB: formData.timeB,
      latB,
      lonB,
      timezoneB: tzB,
      cityNameB: cityB,

      houseSystem: formData.houseSystem,
      timestamp: Date.now()
    };

    calculateSynastry(data);
    setSelectedItem(null);
    onSaveHistory(data);
  };

  const displayItem = hoveredItem || selectedItem;

  const renderDetailsPanel = () => {
    if (!displayItem) {
      return (
        <div className="details-glow-box" style={{ borderLeftColor: 'rgba(255, 255, 255, 0.15)' }}>
          <h4>✧ 雙人合盤互動詳解</h4>
          <p>在左側雙重星盤（內圈為 {formData.nameA}，外圈為 {formData.nameB}）中點擊相位線，或在下方表格中選取特定配置，此處將展示其深刻的親密關係能量與宿命解析。</p>
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
            {formData.nameA} 的 {asp.p1Name} 與 {formData.nameB} 的 {asp.p2Name} 呈 {asp.aspectName} ({asp.exactAngle.toFixed(1)}°)
          </h4>
          <p>{text}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            這項合盤相位揭示了雙方靈魂在日常互動中的化學反應。和諧相位（三分相、六分相）代表自然契合的天賦，而挑戰相位（四分相、對分相）則指出雙方需要攜手修行、學習和理解的生命課題。
          </p>
        </div>
      );
    }

    if (displayItem.type === 'comparison') {
      const pKey = displayItem.key;
      const name = displayItem.name;
      const pA = chartA.planets[pKey];
      const pB = chartB.planets[pKey];

      return (
        <div className="details-glow-box" style={{ borderLeftColor: pA.color }}>
          <h4>双方 {name} 落點比較</h4>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>{formData.nameA} 的 {name}：</strong>落於 {pA.zodiac.name} 第 {pA.house} 宮。
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>{formData.nameB} 的 {name}：</strong>落於 {pB.zodiac.name} 第 {pB.house} 宮。
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-glass)', paddingTop: '0.5rem' }}>
            {name === 'Sun' && '太陽落點比較：反映雙方核心意志與人生追求的契合度。若星座元素相合（如火象與風象），代表人生方向彼此支持；若元素冲突，則可能在重大決策上需要協調。'}
            {name === 'Moon' && '月亮落點比較：揭示雙方情感安全感與親密習慣的默契度。月亮元素和諧能確保雙方在生活日常中相處舒適，反之則需要多溝通情感底線。'}
            {name === 'Mercury' && '水星落點比較：反映雙方的溝通模式與思想碰撞。水星相位好代表能無話不說，否則容易出現思想雞同鴨講的狀況。'}
            {name === 'Venus' && '金星落點比較：體現戀愛喜好、審美與價值觀。金星的強烈連結能帶來深厚的愛意與浪漫吸引力。'}
            {name === 'Mars' && '火星落點比較：揭示雙方的激情、行動力分配與潛在的脾氣衝突。'}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="synastry-view">
      <form onSubmit={handleCalculate} className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Person A Inputs */}
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--neon-cyan)' }}>
              第一人配置 (內圈)
            </h3>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>姓名</label>
              <input
                type="text"
                name="nameA"
                value={formData.nameA}
                onChange={handleChange}
                className="cosmic-input"
                required
              />
            </div>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
              <div className="form-group">
                <label>出生日期</label>
                <input
                  type="date"
                  name="dateA"
                  value={formData.dateA}
                  onChange={handleChange}
                  className="cosmic-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>出生時間</label>
                <input
                  type="time"
                  name="timeA"
                  value={formData.timeA}
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
                  name="isManualA"
                  checked={formData.isManualA}
                  onChange={handleChange}
                />
                手動輸入坐標
              </label>
              {!formData.isManualA ? (
                <select
                  name="cityIndexA"
                  value={formData.cityIndexA}
                  onChange={handleChange}
                  className="cosmic-select"
                >
                  {MAJOR_CITIES.map((city, idx) => (
                    <option key={idx} value={idx}>
                      {city.name} ({city.country})
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    name="latA"
                    value={formData.latA}
                    onChange={handleChange}
                    placeholder="緯度"
                    className="cosmic-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    name="lonA"
                    value={formData.lonA}
                    onChange={handleChange}
                    placeholder="經度"
                    className="cosmic-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    name="timezoneA"
                    value={formData.timezoneA}
                    onChange={handleChange}
                    placeholder="時差"
                    className="cosmic-input"
                    style={{ flex: 1 }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Person B Inputs */}
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--neon-gold)' }}>
              第二人配置 (外圈)
            </h3>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>姓名</label>
              <input
                type="text"
                name="nameB"
                value={formData.nameB}
                onChange={handleChange}
                className="cosmic-input"
                required
              />
            </div>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
              <div className="form-group">
                <label>出生日期</label>
                <input
                  type="date"
                  name="dateB"
                  value={formData.dateB}
                  onChange={handleChange}
                  className="cosmic-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>出生時間</label>
                <input
                  type="time"
                  name="timeB"
                  value={formData.timeB}
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
                  name="isManualB"
                  checked={formData.isManualB}
                  onChange={handleChange}
                />
                手動輸入坐標
              </label>
              {!formData.isManualB ? (
                <select
                  name="cityIndexB"
                  value={formData.cityIndexB}
                  onChange={handleChange}
                  className="cosmic-select"
                >
                  {MAJOR_CITIES.map((city, idx) => (
                    <option key={idx} value={idx}>
                      {city.name} ({city.country})
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    name="latB"
                    value={formData.latB}
                    onChange={handleChange}
                    placeholder="緯度"
                    className="cosmic-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    name="lonB"
                    value={formData.lonB}
                    onChange={handleChange}
                    placeholder="經度"
                    className="cosmic-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    name="timezoneB"
                    value={formData.timezoneB}
                    onChange={handleChange}
                    placeholder="時差"
                    className="cosmic-input"
                    style={{ flex: 1 }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1.2rem', marginTop: '1rem' }}>
          <div className="form-group" style={{ width: '200px' }}>
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
          <button type="submit" className="cosmic-btn">繪製雙人合盤</button>
        </div>
      </form>

      {chartA && chartB && (
        <div className="chart-layout">
          <div className="chart-wheel-container">
            {/* Draw a double chart wheel: Inner is Chart A, Outer overlay is Chart B planets, center lines are cross-chart aspects */}
            <ChartWheel
              chartData={chartA}
              transitData={{
                planets: chartB.planets,
                transitAspects: synastryAspects
              }}
              onHover={setHoveredItem}
              activeHover={hoveredItem}
            />
          </div>

          <div className="chart-report-container">
            {compReport && (
              <div className="compatibility-header">
                <div className="score-badge">
                  <span className="score-num">{compReport.score}</span>
                  <span className="score-lbl">契合分數</span>
                </div>
                <div className="score-info">
                  <h3>關係契合評級：{compReport.grade}</h3>
                  <p>
                    雙方星盤產生了 {compReport.harmonyCount} 個和諧連結（合相、三分相、六分相），
                    與 {compReport.challengeCount} 個磨合點（四分相、對分相）。
                  </p>
                </div>
              </div>
            )}

            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.8rem' }}>雙人合盤深度解析</h3>
              {renderDetailsPanel()}
            </div>

            <div className="glass-card">
              <div className="report-tabs">
                <button
                  className={`report-tab-btn ${activeTab === 'aspects' ? 'active' : ''}`}
                  onClick={() => setActiveTab('aspects')}
                >
                  合盤相位 ({synastryAspects.length})
                </button>
                <button
                  className={`report-tab-btn ${activeTab === 'placements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('placements')}
                >
                  雙方星曜落點
                </button>
              </div>

              {activeTab === 'aspects' && (
                <div className="aspects-list">
                  {synastryAspects.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                      未檢測到雙方星體間的顯著主要相位。
                    </p>
                  ) : (
                    synastryAspects.map((asp, idx) => (
                      <div
                        key={`syn-asp-${idx}`}
                        className="aspect-item-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedItem({ type: 'aspect', index: idx, data: asp })}
                      >
                        <div className="aspect-title">
                          <span className="names">
                            <span style={{ color: chartA.planets[asp.p1].color }}>{formData.nameA} 的 {asp.p1Symbol} {asp.p1Name}</span>
                            <span style={{ color: asp.color }}>{asp.aspectSymbol} {asp.aspectName}</span>
                            <span style={{ color: chartB.planets[asp.p2].color }}>{formData.nameB} 的 {asp.p2Symbol} {asp.p2Name}</span>
                          </span>
                          <span className="aspect-badge" style={{ backgroundColor: `${asp.color}15`, color: asp.color, border: `1px solid ${asp.color}33` }}>
                            {asp.exactAngle.toFixed(1)}°
                          </span>
                        </div>
                        <p className="aspect-desc">{asp.description}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'placements' && (
                <div className="astro-table-wrapper">
                  <table className="astro-table">
                    <thead>
                      <tr>
                        <th>守護星</th>
                        <th>{formData.nameA} 的位置 (內圈)</th>
                        <th>{formData.nameB} 的位置 (外圈)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(chartA.planets).map(pKey => {
                        const pA = chartA.planets[pKey];
                        const pB = chartB.planets[pKey];
                        return (
                          <tr 
                            key={pKey}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedItem({ type: 'comparison', key: pKey, name: pA.name })}
                          >
                            <td style={{ color: pA.color, fontWeight: 'bold' }}>
                              {pA.symbol} {pA.name}
                            </td>
                            <td>{pA.zodiac.name} (第 {pA.house} 宮)</td>
                            <td>{pB.zodiac.name} (第 {pB.house} 宮)</td>
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

      {/* 雙人星軌能量共振報告 (算出來的動態總結 - 約1000字) */}
      {chartA && chartB && compReport && (() => {
        const report = generateSynastryOracle(compReport.score, synastryAspects);
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
                  根據雙方個人行星交互相位精密演算之親密關係整合報告
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
