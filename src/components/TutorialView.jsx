import React, { useState } from 'react';

export default function TutorialView() {
  const [activeSection, setActiveSection] = useState('history');

  const sections = [
    { id: 'history', label: '1. 歷史源流與《占星四書》' },
    { id: 'philosophy', label: '2. 古典四大元素與物理哲學' },
    { id: 'math', label: '3. 坐標天文學與 ASC/MC 三角公式' },
    { id: 'houses', label: '4. 宮位分區幾何學 (Equal / Porphyry)' }
  ];

  const handleScrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(`sec-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="chart-layout" style={{ position: 'relative' }}>
      {/* Sidebar Navigation */}
      <div className="chart-wheel-container" style={{ top: '6rem', alignSelf: 'start', zIndex: 10 }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '0.8rem', color: 'var(--neon-gold)' }}>
            文獻大綱
          </h3>
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => handleScrollTo(sec.id)}
              className="nav-btn"
              style={{
                textAlign: 'left',
                width: '100%',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                background: activeSection === sec.id ? 'var(--panel-glass-hover)' : 'transparent',
                borderColor: activeSection === sec.id ? 'var(--border-glass-active)' : 'transparent',
                color: activeSection === sec.id ? 'var(--neon-cyan)' : 'var(--text-secondary)'
              }}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Content */}
      <div className="chart-report-container" style={{ maxWidth: '850px' }}>
        {/* Section 1 */}
        <section id="sec-history" className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--neon-gold)', marginBottom: '1.2rem', fontSize: '1.8rem' }}>
            一、 西洋占星之歷史源流與《占星四書》
          </h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2em' }}>
            西洋占星術（Western Astrology）的歷史脈絡可追溯至西元前兩千年美索不達米亞（Mesopotamia）平原的兩河流域文化。
            古巴比倫人通過長期的夜空觀測，建立了最早的「國家級天象預警系統」，用以預測君王吉凶、農作物豐收及戰爭動態。
            隨著波斯帝國的擴張，巴比倫的曆法與黃道概念傳入埃及與希臘，並在西元前四世紀希臘化時代（Hellenistic period）經歷了關鍵的整合，
            形成了以「個人出生星盤（Natal Horoscope）」為核心的現代占星雛形。
          </p>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2em' }}>
            西元二世紀，生活在埃及亞歷山大港的偉大天文學家與數學家**克勞狄烏斯·托勒密（Claudius Ptolemaeus）**，寫下了里程碑式的著作——《占星四書》（Tetrabiblos，意為「四部書」）。
            托勒密在這部著作中，首次將亞里斯多德的物理學宇宙觀引入占星學，試圖將占星術從巫術、迷信中剝離出來，將其重新定義為一門基於「天體輻射與物理性質對地球環境施加影響」的經驗自然科學。
          </p>
          <div style={{ borderLeft: '3px solid var(--neon-cyan)', paddingLeft: '1rem', margin: '1.5rem 0', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
            「天體以其本質對空氣施加影響，隨之作用於地球上的動植物，並最終形塑人類的身體氣質與命運特徵。」 —— 《占星四書》第一卷·第一章
          </div>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', textIndent: '2em' }}>
            《占星四書》統整了行星守護、黃道宮位、相位關係等希臘化古典體系，為後世阿拉伯占星與中世紀歐洲古典占星的復興奠定了堅不可摧的理論基礎。
          </p>
        </section>

        {/* Section 2 */}
        <section id="sec-philosophy" className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--neon-gold)', marginBottom: '1.2rem', fontSize: '1.8rem' }}>
            二、 古典四大元素與物理哲學基石
          </h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2em' }}>
            托勒密古典占星的核心哲學，立足於古希臘物質觀中的「四種基本物理特質」：**熱（Heat）、濕（Moisture）、冷（Cold）、乾（Dryness）**。
            天體的運動導致這四種力量在地球大氣中產生不同的混合，進而形成「四大元素（Four Elements）」：
          </p>
          <div className="astro-table-wrapper" style={{ margin: '1.5rem 0' }}>
            <table className="astro-table">
              <thead>
                <tr>
                  <th>元素</th>
                  <th>特質組合</th>
                  <th>代表星座</th>
                  <th>心理調性</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: 'var(--neon-gold)', fontWeight: 'bold' }}>🔥 火象 (Fire)</td>
                  <td>熱 + 乾 (Hot & Dry)</td>
                  <td>白羊座、獅子座、射手座</td>
                  <td>主動、外顯、侵略性、開創精神</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>🌱 土象 (Earth)</td>
                  <td>冷 + 乾 (Cold & Dry)</td>
                  <td>金牛座、處女座、摩羯座</td>
                  <td>務實、物質導向、穩健、結構化</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>💨 風象 (Air)</td>
                  <td>熱 + 濕 (Hot & Moist)</td>
                  <td>雙子座、天秤座、水瓶座</td>
                  <td>心智流動、溝通、社交、理性主義</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--neon-purple)', fontWeight: 'bold' }}>💧 水象 (Water)</td>
                  <td>冷 + 濕 (Cold & Moist)</td>
                  <td>巨蟹座、天蠍座、雙魚座</td>
                  <td>感性、同理心、深層意識、情感保護</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', textIndent: '2em' }}>
            行星的本質亦由此定義：例如，**太陽**代表絕對的「熱與乾」，具有滋養生命與蒸發水分的力量；**月亮**則富含「冷與濕」，控制地球的潮汐與夜間露水。
            占星學的解析本質上是通過星盤中行星、黃道與宮位所含物理特質的相生相剋、加成與抑制，來推算一個人的氣質（Temperament）平衡。
          </p>
        </section>

        {/* Section 3 */}
        <section id="sec-math" className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--neon-gold)', marginBottom: '1.2rem', fontSize: '1.8rem' }}>
            三、 坐標天文學與 ASC / MC 球面三角學運算
          </h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2em' }}>
            古典占星的精確度取決於天文坐標系的精確轉換。占星排盤主要在**黃道坐標系（Ecliptic Coordinate System）**中進行，
            其基準面為地球繞太陽公轉的黃道面，經度自春分點（Aries 0°）起算。
          </p>
          
          <h3 style={{ color: 'var(--text-primary)', margin: '1rem 0 0.5rem 0', fontSize: '1.1rem' }}>
            1. 黃赤交角與歲差 (Obliquity & Precession)
          </h3>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2em' }}>
            由於地球自轉軸的進動（Precession），天球赤道與黃道的交點（春分點）每年西移約 50.3 角秒。
            西洋占星主要採用**回歸黃道（Tropical Zodiac）**，以春分點作為黃道第一度起點；這與印度占星採用的「恆星黃道（Sidereal Zodiac）」不同。
            黃赤交角（$\varepsilon$）隨時間緩慢漂移，可通過 Laskar (1986) 演算法求得：
          </p>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--neon-cyan)', margin: '1rem 0' }}>
            T = (JD - 2451545.0) / 36525.0 <br />
            ε = 23.4392911 - (46.8150 * T + 0.00059 * T^2 - 0.001813 * T^3) / 3600
          </div>

          <h3 style={{ color: 'var(--text-primary)', margin: '1rem 0 0.5rem 0', fontSize: '1.1rem' }}>
            2. 中天 (MC) 計算公式
          </h3>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2em' }}>
            中天（Midheaven, MC）是當地子午圈與黃道交匯在南方地平線之上的點。其黃道經度（λ_MC）取決於地方恆星時（LST）對應的赤經（RAMC）：
          </p>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--neon-cyan)', margin: '1rem 0', textAlign: 'center' }}>
            tan(λ_MC) = tan(RAMC) / cos(ε) <br />
            λ_MC = atan2(sin(RAMC), cos(RAMC) * cos(ε))
          </div>

          <h3 style={{ color: 'var(--text-primary)', margin: '1rem 0 0.5rem 0', fontSize: '1.1rem' }}>
            3. 上升點 (ASC) 計算公式
          </h3>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2em' }}>
            上升點（Ascendant, ASC）是東方地平圈與黃道的交點。它受觀測者地理緯度（$\phi$）的強烈影響，計算公式為球面三角學之割線投影：
          </p>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--neon-cyan)', margin: '1rem 0', textAlign: 'center' }}>
            y = cos(RAMC) <br />
            x = -(sin(RAMC) * cos(ε) + tan(φ) * sin(ε)) <br />
            λ_ASC = atan2(y, x)
          </div>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', textIndent: '2em' }}>
            其中，在編寫代碼時，必須使用 `Math.atan2(y, x)` 以便自動適應全圓四周（0° 至 360°）的象限判定，防範除以零或正切反三角函數產生的二義性錯誤。
          </p>
        </section>

        {/* Section 4 */}
        <section id="sec-houses" className="glass-card">
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--neon-gold)', marginBottom: '1.2rem', fontSize: '1.8rem' }}>
            四、 宮位分區幾何學 (Equal / Porphyry / Placidus)
          </h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2em' }}>
            星盤的後天宮位（Houses）代表個人在世俗生活中的各個具體領域。宮位劃分法分為兩大類：
          </p>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2em' }}>
            **1. 等宮制 (Equal House System)**：<br />
            最古老的宮位劃分法之一。將上升點（ASC）所處的經度作為第一宮起點，此後每隔 30 度順序劃分為一個宮位。其幾何學意義在於保證每個生活宮位具有相同的黃道弧長，不易受極地極限緯度（Latitude extremes）的畸變干擾。
          </p>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2em' }}>
            **2. 波菲里制 (Porphyry House System)**：<br />
            由西元三世紀新柏拉圖主義哲學家波菲里（Porphyry）提出。其劃分邏輯是先求出 ASC 與 MC 的黃道經度差，將該象限（Quadrant）在黃道上進行三等分。
            這使得 MC 恰好落於第十宮的宮頭，DSC 落於第七宮宮頭，IC 落於第四宮宮頭。
          </p>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', textIndent: '2em' }}>
            **3. 普拉西度制 (Placidus House System)**：<br />
            現代占星最主流的四分儀宮位制。它基於「時間的幾何劃分」，將天體從升起（地平圈）到抵達中天（子午圈）的半弧運動時間（Diurnal Semi-Arc）進行三等分。
            此系統能細緻反映行星在不同時間維度上的運動，但在極地高緯度地區（例如挪威、阿拉斯加）會因為太陽永不升起或永不落下而失效。
          </p>
        </section>
      </div>
    </div>
  );
}
