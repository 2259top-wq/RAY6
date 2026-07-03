import React from 'react';
import { ZODIAC_SIGNS, PLANETS_METADATA, normalizeAngle } from '../utils/astrology';

export default function ChartWheel({ chartData, transitData = null, onHover = null, activeHover = null }) {
  if (!chartData) return null;

  const cx = 250;
  const cy = 250;
  const asc = chartData.asc;
  const cusps = chartData.cusps;

  // Helper to convert longitude to SVG coordinates
  const getCoords = (longitude, radius) => {
    // ASC is drawn at 180 degrees (left), signs increase counter-clockwise
    const angleDeg = 180 - (longitude - asc);
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad) // Subtract y because SVG y goes down
    };
  };

  // Build radii configuration
  const rZodiacOuter = 230;
  const rZodiacInner = 200;
  const rHouseOuter = 200;
  const rHouseInner = 130;
  const rAspectsOuter = 130;

  // Render Zodiac Ring Segments
  const zodiacLines = [];
  const zodiacSymbols = [];
  const zodiacColors = [];

  for (let i = 0; i < 12; i++) {
    const startLong = i * 30;
    const midLong = startLong + 15;
    const endLong = (i + 1) * 30;

    const pStart = getCoords(startLong, rZodiacOuter);
    const pStartInner = getCoords(startLong, rZodiacInner);
    const pMid = getCoords(midLong, (rZodiacOuter + rZodiacInner) / 2);
    
    // Line separating signs
    zodiacLines.push(
      <line
        key={`zline-${i}`}
        x1={pStart.x}
        y1={pStart.y}
        x2={pStartInner.x}
        y2={pStartInner.y}
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1"
      />
    );

    // Text glyph for the sign
    const sign = ZODIAC_SIGNS[i];
    zodiacSymbols.push(
      <text
        key={`zsym-${i}`}
        x={pMid.x}
        y={pMid.y + 5} // center adjust
        fill={sign.color}
        fontSize="14"
        textAnchor="middle"
        style={{ cursor: 'default', fontWeight: 'bold', filter: `drop-shadow(0 0 2px ${sign.color}44)` }}
      >
        {sign.symbol}
      </text>
    );
  }

  // Render House Cusps Lines
  const houseLines = [];
  const houseLabels = [];
  for (let i = 1; i <= 12; i++) {
    const long = cusps[i];
    const pStart = getCoords(long, rHouseOuter);
    const pEnd = getCoords(long, rHouseInner);

    // ASC and MC are highlighted angles
    const isAngle = i === 1 || i === 10;
    const strokeColor = isAngle 
      ? 'rgba(255, 204, 0, 0.65)' 
      : 'rgba(255, 255, 255, 0.15)';
    const strokeW = isAngle ? '2.5' : '1';

    houseLines.push(
      <g key={`house-cusp-${i}`}>
        <line
          x1={pStart.x}
          y1={pStart.y}
          x2={pEnd.x}
          y2={pEnd.y}
          stroke={strokeColor}
          strokeWidth={strokeW}
        />
        {isAngle && (
          <text
            x={getCoords(long, rHouseInner - 12).x}
            y={getCoords(long, rHouseInner - 12).y + 4}
            fill="#ffcc00"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            {i === 1 ? 'ASC' : 'MC'}
          </text>
        )}
      </g>
    );

    // Draw house number in the middle of each house
    const nextLong = cusps[i === 12 ? 1 : i + 1];
    const diff = normalizeAngle(nextLong - long);
    const midHouseLong = normalizeAngle(long + diff / 2);
    const pLabel = getCoords(midHouseLong, 142); // middle of house section

    houseLabels.push(
      <text
        key={`house-lbl-${i}`}
        x={pLabel.x}
        y={pLabel.y + 4}
        fill="rgba(255, 255, 255, 0.3)"
        fontSize="10"
        textAnchor="middle"
        style={{ cursor: 'default' }}
      >
        {i}
      </text>
    );
  }

  // Draw Planet positions (single or dual overlay)
  const drawPlanets = [];
  const activePlanets = chartData.planets;

  // Helper to adjust radii of overlapping items
  const resolveOverlaps = (planetList, baseRadius) => {
    const list = Object.values(planetList).sort((a, b) => a.longitude - b.longitude);
    const resultRadii = {};
    list.forEach(p => {
      resultRadii[p.key] = baseRadius;
    });

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const p1 = list[i];
        const p2 = list[j];
        const diff = Math.abs(p1.longitude - p2.longitude) % 360;
        const dist = diff > 180 ? 360 - diff : diff;
        if (dist < 6) {
          // Push p2 slightly inward
          resultRadii[p2.key] = resultRadii[p1.key] === baseRadius ? baseRadius - 18 : baseRadius;
        }
      }
    }
    return resultRadii;
  };

  const natalRadii = resolveOverlaps(activePlanets, transitData ? 150 : 165);

  // Render Natal Planets
  Object.values(activePlanets).forEach(p => {
    const radius = natalRadii[p.key];
    const coords = getCoords(p.longitude, radius);
    const isHovered = activeHover && activeHover.type === 'planet' && activeHover.key === p.key;

    drawPlanets.push(
      <g
        key={`p-natal-${p.key}`}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => onHover && onHover({ type: 'planet', key: p.key, data: p, isTransit: false })}
        onMouseLeave={() => onHover && onHover(null)}
      >
        {/* Hover Highlight Ring */}
        {isHovered && (
          <circle
            cx={coords.x}
            cy={coords.y}
            r="16"
            fill="none"
            stroke={p.color}
            strokeWidth="1.5"
            strokeDasharray="2 2"
            opacity="0.8"
          />
        )}
        <circle
          cx={coords.x}
          cy={coords.y}
          r="10"
          fill="rgba(10, 14, 35, 0.9)"
          stroke={isHovered ? p.color : 'rgba(255, 255, 255, 0.4)'}
          strokeWidth="1"
        />
        <text
          x={coords.x}
          y={coords.y + 3.5}
          fill={p.color}
          fontSize="11"
          textAnchor="middle"
          fontWeight="bold"
        >
          {p.symbol}
        </text>
        {p.isRetrograde && (
          <text
            x={coords.x + 8}
            y={coords.y - 4}
            fill="#ff3333"
            fontSize="7"
            fontWeight="bold"
          >
            ℞
          </text>
        )}
      </g>
    );
  });

  // Render Transit Planets (if dual chart)
  if (transitData) {
    const transitPlanets = transitData.planets;
    const transitRadii = resolveOverlaps(transitPlanets, 185);

    Object.values(transitPlanets).forEach(p => {
      const radius = transitRadii[p.key];
      const coords = getCoords(p.longitude, radius);
      const isHovered = activeHover && activeHover.type === 'planet' && activeHover.key === p.key && activeHover.isTransit;

      drawPlanets.push(
        <g
          key={`p-transit-${p.key}`}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHover && onHover({ type: 'planet', key: p.key, data: p, isTransit: true })}
          onMouseLeave={() => onHover && onHover(null)}
        >
          {/* Hover Ring */}
          {isHovered && (
            <circle
              cx={coords.x}
              cy={coords.y}
              r="16"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              opacity="0.8"
            />
          )}
          <polygon
            points={`${coords.x},${coords.y-9} ${coords.x+8.5},${coords.y+6} ${coords.x-8.5},${coords.y+6}`}
            fill="rgba(10, 14, 35, 0.9)"
            stroke={isHovered ? '#00f0ff' : 'rgba(0, 240, 255, 0.5)'}
            strokeWidth="1"
          />
          <text
            x={coords.x}
            y={coords.y + 4.5}
            fill={p.color}
            fontSize="10"
            textAnchor="middle"
            fontWeight="bold"
          >
            {p.symbol}
          </text>
          {p.isRetrograde && (
            <text
              x={coords.x + 7}
              y={coords.y - 7}
              fill="#ff3333"
              fontSize="7"
              fontWeight="bold"
            >
              ℞
            </text>
          )}
        </g>
      );
    });
  }

  // Draw Aspect Lines (Inner wheel)
  const drawAspects = [];
  const activeAspects = transitData 
    ? transitData.transitAspects // Overlay shows transit-to-natal aspects
    : chartData.aspects;

  activeAspects.forEach((asp, idx) => {
    // If it's transit-to-natal aspect, p1 is transit planet, p2 is natal planet
    const p1Long = transitData ? transitData.planets[asp.p1].longitude : chartData.planets[asp.p1].longitude;
    const p2Long = chartData.planets[asp.p2].longitude;

    const pt1 = getCoords(p1Long, rAspectsOuter);
    const pt2 = getCoords(p2Long, rAspectsOuter);

    const isHovered = activeHover && activeHover.type === 'aspect' && activeHover.index === idx;

    drawAspects.push(
      <g key={`aspect-line-${idx}`}>
        <line
          x1={pt1.x}
          y1={pt1.y}
          x2={pt2.x}
          y2={pt2.y}
          stroke={asp.color}
          strokeWidth={isHovered ? '2.5' : '1'}
          strokeDasharray={asp.stroke === 'dashed' ? '3 3' : 'none'}
          opacity={isHovered ? '0.9' : '0.4'}
          style={{ cursor: 'pointer', transition: 'stroke-width 0.2s, opacity 0.2s' }}
          onMouseEnter={() => onHover && onHover({ type: 'aspect', index: idx, data: asp })}
          onMouseLeave={() => onHover && onHover(null)}
        />
        {/* Transparent thick line to make hovering easier */}
        <line
          x1={pt1.x}
          y1={pt1.y}
          x2={pt2.x}
          y2={pt2.y}
          stroke="transparent"
          strokeWidth="8"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHover && onHover({ type: 'aspect', index: idx, data: asp })}
          onMouseLeave={() => onHover && onHover(null)}
        />
      </g>
    );
  });

  return (
    <div className="astrolabe-container">
      <svg
        viewBox="0 0 500 500"
        className="astrolabe-svg"
        style={{ width: '100%', height: '100%', maxWidth: '500px' }}
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bd5eff" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#0d1127" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center Glow */}
        <circle cx={cx} cy={cy} r={rHouseOuter} fill="url(#centerGlow)" />

        {/* Outer Boundary */}
        <circle
          cx={cx}
          cy={cy}
          r={rZodiacOuter}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.5"
        />

        {/* Inner Rings */}
        <circle
          cx={cx}
          cy={cy}
          r={rZodiacInner}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.5"
        />
        <circle
          cx={cx}
          cy={cy}
          r={rHouseInner}
          fill="rgba(6, 8, 20, 0.3)"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={cy}
          r="8"
          fill="rgba(255, 255, 255, 0.1)"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
        />

        {/* Zodiac segments & lines */}
        <g id="zodiac-segments">{zodiacLines}</g>
        <g id="zodiac-symbols">{zodiacSymbols}</g>

        {/* House lines & labels */}
        <g id="house-cusps">{houseLines}</g>
        <g id="house-labels">{houseLabels}</g>

        {/* Aspect lines */}
        <g id="aspects">{drawAspects}</g>

        {/* Planet nodes */}
        <g id="planets">{drawPlanets}</g>
      </svg>
    </div>
  );
}
