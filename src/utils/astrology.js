import { Body, EclipticLongitude, SunPosition, SiderealTime, AstroTime } from 'astronomy-engine';

// Zodiac signs list and details
export const ZODIAC_SIGNS = [
  { name: '白羊座', english: 'Aries', symbol: '♈', start: 0, end: 30, element: 'Fire', quality: 'Cardinal', color: '#ffaa00' },
  { name: '金牛座', english: 'Taurus', symbol: '♉', start: 30, end: 60, element: 'Earth', quality: 'Fixed', color: '#118a7e' },
  { name: '雙子座', english: 'Gemini', symbol: '♊', start: 60, end: 90, element: 'Air', quality: 'Mutable', color: '#00f0ff' },
  { name: '巨蟹座', english: 'Cancer', symbol: '♋', start: 90, end: 120, element: 'Water', quality: 'Cardinal', color: '#bd5eff' },
  { name: '獅子座', english: 'Leo', symbol: '♌', start: 120, end: 150, element: 'Fire', quality: 'Fixed', color: '#ff7700' },
  { name: '處女座', english: 'Virgo', symbol: '♍', start: 150, end: 180, element: 'Earth', quality: 'Mutable', color: '#00e5a3' },
  { name: '天秤座', english: 'Libra', symbol: '♎', start: 180, end: 210, element: 'Air', quality: 'Cardinal', color: '#00bcff' },
  { name: '天蠍座', english: 'Scorpio', symbol: '♏', start: 210, end: 240, element: 'Water', quality: 'Fixed', color: '#3f00ff' },
  { name: '射手座', english: 'Sagittarius', symbol: '♐', start: 240, end: 270, element: 'Fire', quality: 'Mutable', color: '#ffa600' },
  { name: '摩羯座', english: 'Capricorn', symbol: '♑', start: 270, end: 300, element: 'Earth', quality: 'Cardinal', color: '#10635b' },
  { name: '水瓶座', english: 'Aquarius', symbol: '♒', start: 300, end: 330, element: 'Air', quality: 'Fixed', color: '#005cff' },
  { name: '雙魚座', english: 'Pisces', symbol: '♓', start: 330, end: 360, element: 'Water', quality: 'Mutable', color: '#9d00ff' }
];

export const PLANETS_METADATA = {
  Sun: { name: '太陽', english: 'Sun', symbol: '☉', color: '#ffcc00' },
  Moon: { name: '月亮', english: 'Moon', symbol: '☽', color: '#cccccc' },
  Mercury: { name: '水星', english: 'Mercury', symbol: '☿', color: '#00e5ff' },
  Venus: { name: '金星', english: 'Venus', symbol: '♀', color: '#ff99cc' },
  Mars: { name: '火星', english: 'Mars', symbol: '♂', color: '#ff3333' },
  Jupiter: { name: '木星', english: 'Jupiter', symbol: '♃', color: '#ff9900' },
  Saturn: { name: '土星', english: 'Saturn', symbol: '♄', color: '#aaaa66' },
  Uranus: { name: '天王星', english: 'Uranus', symbol: '♅', color: '#66ccff' },
  Neptune: { name: '海王星', english: 'Neptune', symbol: '♆', color: '#3366ff' },
  Pluto: { name: '冥王星', english: 'Pluto', symbol: '♇', color: '#9933ff' }
};

export const ASPECTS_METADATA = [
  { name: '合相', angle: 0, orb: 8, symbol: '☌', color: '#ffcc00', stroke: 'solid', description: '融合與強化能量' },
  { name: '六分相', angle: 60, orb: 6, symbol: '⚹', color: '#00e5ff', stroke: 'dashed', description: '和諧與發展機會' },
  { name: '四分相', angle: 90, orb: 8, symbol: '□', color: '#ff3333', stroke: 'solid', description: '張力與成長挑戰' },
  { name: '三分相', angle: 120, orb: 8, symbol: '△', color: '#bd5eff', stroke: 'solid', description: '順暢與天賦能量' },
  { name: '對分相', angle: 180, orb: 8, symbol: '☍', color: '#ff7700', stroke: 'solid', description: '對立與關係投射' }
];

export const MAJOR_CITIES = [
  { name: '台北市', country: '台灣', lat: 25.033, lon: 121.565, timezone: 8 },
  { name: '新北市', country: '台灣', lat: 25.016, lon: 121.462, timezone: 8 },
  { name: '台中市', country: '台灣', lat: 24.147, lon: 120.673, timezone: 8 },
  { name: '台南市', country: '台灣', lat: 22.990, lon: 120.200, timezone: 8 },
  { name: '高雄市', country: '台灣', lat: 22.627, lon: 120.301, timezone: 8 },
  { name: '東京', country: '日本', lat: 35.676, lon: 139.650, timezone: 9 },
  { name: '首爾', country: '韓國', lat: 37.566, lon: 126.978, timezone: 9 },
  { name: '北京', country: '中國', lat: 39.904, lon: 116.407, timezone: 8 },
  { name: '上海', country: '中國', lat: 31.230, lon: 121.473, timezone: 8 },
  { name: '香港', country: '香港', lat: 22.319, lon: 114.169, timezone: 8 },
  { name: '新加坡', country: '新加坡', lat: 1.352, lon: 103.820, timezone: 8 },
  { name: '倫敦', country: '英國', lat: 51.507, lon: -0.128, timezone: 0 },
  { name: '巴黎', country: '法國', lat: 48.856, lon: 2.352, timezone: 1 },
  { name: '紐約', country: '美國', lat: 40.712, lon: -74.006, timezone: -5 },
  { name: '洛杉磯', country: '美國', lat: 34.052, lon: -118.243, timezone: -8 },
  { name: '舊金山', country: '美國', lat: 37.774, lon: -122.419, timezone: -8 },
  { name: '雪梨', country: '澳洲', lat: -33.868, lon: 151.209, timezone: 10 }
];

// Helper to normalize degree to [0, 360)
export function normalizeAngle(deg) {
  return (deg % 360 + 360) % 360;
}

// Get zodiac details for a longitude
export function getZodiacDetails(longitude) {
  const norm = normalizeAngle(longitude);
  const index = Math.floor(norm / 30);
  const sign = ZODIAC_SIGNS[index];
  const relativeDeg = norm - sign.start;
  const deg = Math.floor(relativeDeg);
  const min = Math.floor((relativeDeg - deg) * 60);
  return {
    ...sign,
    degrees: deg,
    minutes: min,
    formatted: `${deg}° ${sign.name} ${min}'`
  };
}

// Get retrograde status of planet
function isRetrograde(body, time) {
  if (body === Body.Sun || body === Body.Moon) return false;
  const p1 = EclipticLongitude(body, time);
  const t2 = time.AddDays(0.02);
  const p2 = EclipticLongitude(body, t2);
  let diff = p2 - p1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

// Calculate ASC, MC, and Obliquity
export function calculateAscMc(date, latitude, longitude) {
  const time = new AstroTime(date);
  const gast = SiderealTime(time); // GAST in hours
  const gastDeg = gast * 15;
  const ramc = normalizeAngle(gastDeg + longitude);

  // Compute obliquity of ecliptic (epsilon)
  const T = time.tt / 36525.0;
  const epsilon = 23.4392911 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600.0;

  const ramcRad = (ramc * Math.PI) / 180;
  const epsRad = (epsilon * Math.PI) / 180;

  // MC calculation
  const mcRad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad));
  let mc = (mcRad * 180) / Math.PI;
  mc = normalizeAngle(mc);

  // Ascendant calculation (safe latitude to avoid infinity)
  const safeLat = Math.max(-89.9, Math.min(89.9, latitude));
  const latRad = (safeLat * Math.PI) / 180;
  
  const y = Math.cos(ramcRad);
  const x = -(Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  const ascRad = Math.atan2(y, x);
  let asc = (ascRad * 180) / Math.PI;
  asc = normalizeAngle(asc);

  return { asc, mc, ramc, obliquity: epsilon };
}

// Get house index for a longitude
export function getHouseNumber(longitude, cusps) {
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

// Calculate house cusps
export function calculateHouses(asc, mc, system = 'Porphyry') {
  const cusps = {};
  if (system === 'Equal') {
    // Equal House starting from Ascendant
    for (let i = 1; i <= 12; i++) {
      cusps[i] = normalizeAngle(asc + (i - 1) * 30);
    }
  } else {
    // Porphyry House System
    const dsc = normalizeAngle(asc + 180);
    const ic = normalizeAngle(mc + 180);

    // Quad 1: MC to ASC (Houses 10, 11, 12)
    const w1 = normalizeAngle(asc - mc) / 3;
    cusps[10] = mc;
    cusps[11] = normalizeAngle(mc + w1);
    cusps[12] = normalizeAngle(mc + w1 * 2);

    // Quad 2: ASC to IC (Houses 1, 2, 3)
    const w2 = normalizeAngle(ic - asc) / 3;
    cusps[1] = asc;
    cusps[2] = normalizeAngle(asc + w2);
    cusps[3] = normalizeAngle(asc + w2 * 2);

    // Quad 3: IC to DSC (Houses 4, 5, 6)
    const w3 = normalizeAngle(dsc - ic) / 3;
    cusps[4] = ic;
    cusps[5] = normalizeAngle(ic + w3);
    cusps[6] = normalizeAngle(ic + w3 * 2);

    // Quad 4: DSC to MC (Houses 7, 8, 9)
    const w4 = normalizeAngle(mc - dsc) / 3;
    cusps[7] = dsc;
    cusps[8] = normalizeAngle(dsc + w4);
    cusps[9] = normalizeAngle(dsc + w4 * 2);
  }
  return cusps;
}

// Detect aspects between planetary positions
export function calculateAspects(planets) {
  const aspects = [];
  const keys = Object.keys(planets);

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const p1Key = keys[i];
      const p2Key = keys[j];
      const pos1 = planets[p1Key].longitude;
      const pos2 = planets[p2Key].longitude;

      const diff = Math.abs(pos1 - pos2) % 360;
      const angle = diff > 180 ? 360 - diff : diff;

      for (const asp of ASPECTS_METADATA) {
        if (Math.abs(angle - asp.angle) <= asp.orb) {
          aspects.push({
            p1: p1Key,
            p2: p2Key,
            p1Name: PLANETS_METADATA[p1Key].name,
            p2Name: PLANETS_METADATA[p2Key].name,
            p1Symbol: PLANETS_METADATA[p1Key].symbol,
            p2Symbol: PLANETS_METADATA[p2Key].symbol,
            aspectName: asp.name,
            aspectSymbol: asp.symbol,
            angle: asp.angle,
            exactAngle: angle,
            diff: Math.abs(angle - asp.angle),
            color: asp.color,
            stroke: asp.stroke,
            description: asp.description
          });
        }
      }
    }
  }
  return aspects;
}

// Calculate comprehensive Natal Chart
export function calculateNatalChart(birthDateStr, birthTimeStr, lat, lon, timezone, houseSystem = 'Porphyry') {
  // Parse birth Date and Time
  const [year, month, day] = birthDateStr.split('-').map(Number);
  const [hour, minute] = birthTimeStr.split(':').map(Number);

  // Offset to UTC
  const dateLocal = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const utcMs = dateLocal.getTime() - timezone * 60 * 60 * 1000;
  const birthDateUtc = new Date(utcMs);

  const time = new AstroTime(birthDateUtc);

  // Compute angles
  const { asc, mc, ramc } = calculateAscMc(birthDateUtc, lat, lon);
  const cusps = calculateHouses(asc, mc, houseSystem);

  // Calculate planets
  const planets = {};
  const bodies = {
    Sun: Body.Sun,
    Moon: Body.Moon,
    Mercury: Body.Mercury,
    Venus: Body.Venus,
    Mars: Body.Mars,
    Jupiter: Body.Jupiter,
    Saturn: Body.Saturn,
    Uranus: Body.Uranus,
    Neptune: Body.Neptune,
    Pluto: Body.Pluto
  };

  for (const [key, body] of Object.entries(bodies)) {
    let long;
    if (key === 'Sun') {
      long = SunPosition(time).elon;
    } else {
      long = EclipticLongitude(body, time);
    }
    const zodiac = getZodiacDetails(long);
    const house = getHouseNumber(long, cusps);
    const retro = isRetrograde(body, time);

    planets[key] = {
      key,
      name: PLANETS_METADATA[key].name,
      symbol: PLANETS_METADATA[key].symbol,
      color: PLANETS_METADATA[key].color,
      longitude: long,
      zodiac,
      house,
      isRetrograde: retro
    };
  }

  const aspects = calculateAspects(planets);

  // House array for display
  const housesArray = [];
  for (let i = 1; i <= 12; i++) {
    housesArray.push({
      number: i,
      longitude: cusps[i],
      zodiac: getZodiacDetails(cusps[i])
    });
  }

  return {
    birthDateLocal: `${birthDateStr} ${birthTimeStr}`,
    birthDateUtc,
    latitude: lat,
    longitude: lon,
    timezone,
    asc,
    mc,
    ramc,
    cusps,
    houses: housesArray,
    planets,
    aspects,
    houseSystem
  };
}

// Calculate Synastry Aspects (Person A planet to Person B planet)
export function calculateSynastryAspects(planetsA, planetsB) {
  const aspects = [];

  for (const [keyA, pA] of Object.entries(planetsA)) {
    for (const [keyB, pB] of Object.entries(planetsB)) {
      const diff = Math.abs(pA.longitude - pB.longitude) % 360;
      const angle = diff > 180 ? 360 - diff : diff;

      for (const asp of ASPECTS_METADATA) {
        if (Math.abs(angle - asp.angle) <= asp.orb) {
          aspects.push({
            p1: keyA,
            p2: keyB,
            p1Name: pA.name,
            p2Name: pB.name,
            p1Symbol: pA.symbol,
            p2Symbol: pB.symbol,
            aspectName: asp.name,
            aspectSymbol: asp.symbol,
            angle: asp.angle,
            exactAngle: angle,
            diff: Math.abs(angle - asp.angle),
            color: asp.color,
            stroke: asp.stroke,
            description: asp.description
          });
        }
      }
    }
  }
  return aspects;
}
