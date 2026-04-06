import React, { useState } from 'react';
import { LogOut, MapPin, School, Save, Phone, Camera } from 'lucide-react';
import { calcRating, ratingStars, ratingColor } from './firebase';
 
// ════════════════════════════════════════════════════════════
// DriverProfile.jsx  —  صفحة السائق الشخصية
// ════════════════════════════════════════════════════════════
const DriverProfile = ({ driver, regions, colleges, settings, onUpdateDriver, onLogout }) => {
  const [seats,     setSeats]     = useState(driver.seats);
  const [price,     setPrice]     = useState(driver.price || '');
  const [resSearch, setResSearch] = useState(driver.resSearch || '');
  const [college,   setCollege]   = useState(driver.college  || '');
  const [showFromDD, setShowFromDD] = useState(false);
  const [showToDD,   setShowToDD]   = useState(false);
  const [fromQ, setFromQ] = useState('');
  const [toQ,   setToQ]   = useState('');
  const [saved, setSaved] = useState(false);
 
  const rating    = calcRating(driver.reviews);
  const available = seats - driver.bookedBy.length;
 
  const save = () => {
    onUpdateDriver({ ...driver, seats, price, resSearch, college });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
 
  const S = {
    card: { background: '#1a1035', borderRadius: 18, padding: '1.1rem', marginBottom: 12, border: '1px solid rgba(124,58,237,0.15)' },
    inp:  { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 13, fontWeight: 700, outline: 'none', fontFamily: 'inherit' },
    dd:   { background: '#1a1035', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, padding: 8, marginTop: 4 },
    ddItem: { padding: '8px 10px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  };
 
  const filteredR = regions.filter(r => r.includes(fromQ));
  const filteredC = colleges.filter(c => c.includes(toQ));
 
  return (
    <div style={{ maxWidth: 430, margin: '0 auto', padding: '1rem 1rem 4rem', background: '#0f0a1e', minHeight: '100vh' }} dir="rtl">
      <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#facc15', fontSize: 13, fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 12, fontFamily: 'inherit' }}>
        <LogOut size={14} /> تسجيل خروج
      </button>
 
      {/* بطاقة */}
      <div style={{ ...S.card, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, margin: '0 auto 10px', overflow: 'hidden' }}>
          {driver.personalPhoto ? <img src={driver.personalPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : driver.fullName.charAt(0)}
        </div>
        <div style={{ fontSize: 20, fontWeight: 900 }}>{driver.fullName}</div>
        <div style={{ fontSize: 12, color: '#7c5fb5', marginTop: 3 }}>{driver.carType} • {driver.lineType}</div>
        <div style={{ color: ratingColor(rating), fontSize: 14, fontWeight: 800, marginTop: 6 }}>
          {rating !== null ? ratingStars(rating) : 'لا يوجد تقييم بعد'}
          {driver.reviews.length > 0 && <span style={{ fontSize: 10, color: '#7c5fb5', marginRight: 5 }}>({driver.reviews.length} تقييم)</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 14 }}>
          {[['التكييف', driver.ac?'❄️':'—'], ['السعر', price||driver.price], ['المقاعد', `${available}/${seats}`]].map(([l,v]) => (
            <div key={l} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: 10 }}>
              <div style={{ fontSize: 10, color: '#7c5fb5', marginBottom: 3 }}>{l}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: l==='المقاعد'?'#22d3ee':l==='السعر'?'#facc15':'#fff' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
 
      {/* تعديل المسار */}
      <div style={S.card}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#facc15', marginBottom: 10 }}>✏️ تعديل المسار</div>
        <div style={{ fontSize: 11, color: '#7c5fb5', fontWeight: 700, marginBottom: 4 }}><MapPin size={11} style={{ display: 'inline' }} /> منطقة الانطلاق</div>
        <div onClick={() => { setShowFromDD(!showFromDD); setShowToDD(false); }} style={{ ...S.inp, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showFromDD ? 0 : 8 }}>
          <span style={{ color: resSearch ? '#fff' : '#4a3a6a' }}>{resSearch || 'اختر...'}</span><span style={{ color: '#7c5fb5' }}>▾</span>
        </div>
        {showFromDD && (
          <div style={S.dd}>
            <input style={{ ...S.inp, marginBottom: 6, padding: '7px 10px', fontSize: 12 }} placeholder="ابحث..." value={fromQ} onChange={e => setFromQ(e.target.value)} autoFocus />
            <div style={{ maxHeight: 120, overflowY: 'auto' }}>
              {filteredR.map(r => <div key={r} onClick={() => { setResSearch(r); setShowFromDD(false); setFromQ(''); }} style={S.ddItem} onMouseEnter={e=>e.target.style.background='rgba(168,85,247,0.2)'} onMouseLeave={e=>e.target.style.background='transparent'}>{r}</div>)}
            </div>
          </div>
        )}
        <div style={{ fontSize: 11, color: '#7c5fb5', fontWeight: 700, marginBottom: 4, marginTop: 8 }}><School size={11} style={{ display: 'inline' }} /> الوجهة</div>
        <div onClick={() => { setShowToDD(!showToDD); setShowFromDD(false); }} style={{ ...S.inp, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showToDD ? 0 : 10 }}>
          <span style={{ color: college ? '#fff' : '#4a3a6a' }}>{college || 'اختر...'}</span><span style={{ color: '#7c5fb5' }}>▾</span>
        </div>
        {showToDD && (
          <div style={S.dd}>
            <input style={{ ...S.inp, marginBottom: 6, padding: '7px 10px', fontSize: 12 }} placeholder="ابحث..." value={toQ} onChange={e => setToQ(e.target.value)} autoFocus />
            <div style={{ maxHeight: 120, overflowY: 'auto' }}>
              {filteredC.map(c => <div key={c} onClick={() => { setCollege(c); setShowToDD(false); setToQ(''); }} style={S.ddItem} onMouseEnter={e=>e.target.style.background='rgba(168,85,247,0.2)'} onMouseLeave={e=>e.target.style.background='transparent'}>{c}</div>)}
            </div>
          </div>
        )}
      </div>
 
      {/* تعديل الرحلة */}
      <div style={S.card}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#a855f7', marginBottom: 10 }}>✏️ تعديل الرحلة</div>
        <div style={{ fontSize: 11, color: '#7c5fb5', fontWeight: 700, marginBottom: 6 }}>عدد المقاعد المتاحة</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 999, padding: '6px 14px', marginBottom: 10 }}>
          <button onClick={() => setSeats(s => Math.max(driver.bookedBy.length, s - 1))} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,80,80,0.15)', color: '#ff6b6b', border: 'none', fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>−</button>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 24, fontWeight: 900 }}>{available}</span>
          <button onClick={() => setSeats(s => Math.min(40, s + 1))} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,200,83,0.15)', color: '#00C853', border: 'none', fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>+</button>
        </div>
        <div style={{ fontSize: 11, color: '#7c5fb5', fontWeight: 700, marginBottom: 6 }}>السعر الشهري د.ع</div>
        <input style={{ ...S.inp, marginBottom: 10 }} type="number" placeholder="السعر..." value={price} onChange={e => setPrice(e.target.value)} />
        <button onClick={save} style={{ width: '100%', padding: 12, borderRadius: 12, background: saved ? '#059669' : '#facc15', color: saved ? '#fff' : '#1a0b2e', fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.3s' }}>
          <Save size={15} /> {saved ? 'تم الحفظ ✓' : 'حفظ التعديلات'}
        </button>
      </div>
 
      {/* التقييمات السرية */}
      <div style={S.card}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#22d3ee', marginBottom: 10 }}>💬 ملاحظات الطلاب (سرية)</div>
        {driver.reviews.length > 0
          ? driver.reviews.map((rev, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: '9px 12px', marginBottom: 7, border: '1px solid rgba(124,58,237,0.1)' }}>
              <div style={{ color: '#facc15', fontSize: 12, marginBottom: 2 }}>{'★'.repeat(rev.stars)}</div>
              <div style={{ fontSize: 12, color: '#e2e8f0' }}>{rev.text}</div>
              <div style={{ fontSize: 10, color: '#7c5fb5', marginTop: 2 }}>{rev.date}</div>
            </div>
          ))
          : <div style={{ color: '#7c5fb5', fontSize: 12, textAlign: 'center', padding: '1rem', fontWeight: 700 }}>لا توجد ملاحظات بعد</div>
        }
      </div>
 
      {/* دعم */}
      <div style={{ background: '#1a1035', borderRadius: 14, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(124,58,237,0.1)' }}>
        <span style={{ fontSize: 12, color: '#7c5fb5', fontWeight: 700 }}>الدعم الفني</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" style={{ color: '#00C853', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12}/> واتساب</a>
          <a href={`https://instagram.com/${settings.instagram?.replace('@','')}`} target="_blank" rel="noreferrer" style={{ color: '#e879f9', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}><Camera size={12}/> إنستغرام</a>
        </div>
      </div>
    </div>
  );
};
 
export default DriverProfile;