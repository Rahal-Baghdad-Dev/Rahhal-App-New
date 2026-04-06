import React, { useState } from 'react';
import { LogOut, Search, MapPin, School, MessageSquare, Phone, Camera } from 'lucide-react';
import { calcRating, ratingColor } from './firebase';
import RatingModal from './RatingModal';
 
// ════════════════════════════════════════════════════════════
// StudentDashboard.jsx  —  صفحة الطالب
// ربط: onToggleBook, onSubmitReview → index.jsx → drivers
// ════════════════════════════════════════════════════════════
const StudentDashboard = ({
  student, drivers, regions, colleges, settings,
  onUpdateStudent, onToggleBook, onSubmitReview, onLogout,
}) => {
  const [fromLoc,    setFromLoc]    = useState(student.lineStart || '');
  const [toLoc,      setToLoc]      = useState(student.college   || '');
  const [showFromDD, setShowFromDD] = useState(false);
  const [showToDD,   setShowToDD]   = useState(false);
  const [fromQ,      setFromQ]      = useState('');
  const [toQ,        setToQ]        = useState('');
  const [ratingDriverId, setRatingDriverId] = useState(null);
  const [searched,   setSearched]   = useState(true);
 
  const filteredR = regions.filter(r => r.includes(fromQ));
  const filteredC = colleges.filter(c => c.includes(toQ));
 
  const matchedDrivers = drivers
    .filter(d => d.resSearch === fromLoc && d.college === toLoc)
    .sort((a, b) => (calcRating(b.reviews) || 0) - (calcRating(a.reviews) || 0));
 
  const ratingDriver = ratingDriverId ? drivers.find(d => d.id === ratingDriverId) : null;
 
  const doSearch = () => {
    if (!fromLoc || !toLoc) { alert('اختر المنطقة والجامعة'); return; }
    onUpdateStudent({ ...student, lineStart: fromLoc, college: toLoc });
    setSearched(true);
    setShowFromDD(false); setShowToDD(false);
  };
 
  const S = {
    card: { background: '#1a1035', borderRadius: 18, padding: '1.1rem', marginBottom: 12, border: '1px solid rgba(124,58,237,0.15)' },
    inp:  { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 13, fontWeight: 700, outline: 'none', fontFamily: 'inherit' },
    dd:   { background: '#1a1035', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, padding: 8, marginTop: 4 },
    ddItem: { padding: '8px 10px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  };
 
  return (
    <div style={{ maxWidth: 430, margin: '0 auto', padding: '1rem 1rem 4rem', background: '#0f0a1e', minHeight: '100vh' }} dir="rtl">
 
      <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#facc15', fontSize: 13, fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 12, fontFamily: 'inherit' }}>
        <LogOut size={14} /> تسجيل خروج
      </button>
 
      {/* بطاقة الطالب */}
      <div style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, flexShrink: 0 }}>{student.fullName.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{student.fullName}</div>
          <div style={{ fontSize: 11, color: '#a855f7', fontWeight: 700 }}>بطاقة طالب رحّال ✦</div>
          <div style={{ fontSize: 11, color: '#7c5fb5', marginTop: 2 }}>{fromLoc || student.lineStart} ← {toLoc || student.college}</div>
        </div>
      </div>
 
      {/* تعديل المسار + بحث */}
      <div style={S.card}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#facc15', marginBottom: 10 }}>✏️ تعديل المسار</div>
        <div style={{ fontSize: 11, color: '#7c5fb5', fontWeight: 700, marginBottom: 4 }}><MapPin size={11} style={{ display: 'inline' }} /> منطقة السكن</div>
        <div onClick={() => { setShowFromDD(!showFromDD); setShowToDD(false); }} style={{ ...S.inp, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showFromDD ? 0 : 8 }}>
          <span style={{ color: fromLoc ? '#fff' : '#4a3a6a' }}>{fromLoc || 'اختر منطقتك...'}</span>
          <span style={{ color: '#7c5fb5' }}>▾</span>
        </div>
        {showFromDD && (
          <div style={S.dd}>
            <input style={{ ...S.inp, marginBottom: 6, padding: '7px 10px', fontSize: 12 }} placeholder="ابحث..." value={fromQ} onChange={e => setFromQ(e.target.value)} autoFocus />
            <div style={{ maxHeight: 130, overflowY: 'auto' }}>
              {filteredR.map(r => <div key={r} onClick={() => { setFromLoc(r); setShowFromDD(false); setFromQ(''); }} style={S.ddItem} onMouseEnter={e=>e.target.style.background='rgba(168,85,247,0.2)'} onMouseLeave={e=>e.target.style.background='transparent'}>{r}</div>)}
            </div>
          </div>
        )}
        <div style={{ fontSize: 11, color: '#7c5fb5', fontWeight: 700, marginBottom: 4, marginTop: 8 }}><School size={11} style={{ display: 'inline' }} /> الجامعة / الكلية</div>
        <div onClick={() => { setShowToDD(!showToDD); setShowFromDD(false); }} style={{ ...S.inp, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showToDD ? 0 : 10 }}>
          <span style={{ color: toLoc ? '#fff' : '#4a3a6a' }}>{toLoc || 'اختر كليتك...'}</span>
          <span style={{ color: '#7c5fb5' }}>▾</span>
        </div>
        {showToDD && (
          <div style={S.dd}>
            <input style={{ ...S.inp, marginBottom: 6, padding: '7px 10px', fontSize: 12 }} placeholder="ابحث..." value={toQ} onChange={e => setToQ(e.target.value)} autoFocus />
            <div style={{ maxHeight: 130, overflowY: 'auto' }}>
              {filteredC.map(c => <div key={c} onClick={() => { setToLoc(c); setShowToDD(false); setToQ(''); }} style={S.ddItem} onMouseEnter={e=>e.target.style.background='rgba(168,85,247,0.2)'} onMouseLeave={e=>e.target.style.background='transparent'}>{c}</div>)}
            </div>
          </div>
        )}
        <button onClick={doSearch} style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#0891b2', color: '#fff', fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
          <Search size={15} /> بحث عن سائق
        </button>
      </div>
 
      {/* السائقون */}
      {searched && (
        matchedDrivers.length === 0
          ? <div style={{ ...S.card, textAlign: 'center', color: '#7c5fb5', padding: '2rem', fontSize: 13, fontWeight: 700 }}>لا يوجد سائقون على هذا المسار</div>
          : matchedDrivers.map(d => {
            const isFull   = d.bookedBy.length >= d.seats;
            const isBooked = d.bookedBy.includes(student.phone);
            const r = calcRating(d.reviews);
            return (
              <div key={d.id} style={{ ...S.card, border: `1px solid ${isBooked ? 'rgba(34,211,238,0.4)' : isFull && !isBooked ? 'rgba(100,100,100,0.2)' : 'rgba(124,58,237,0.15)'}`, opacity: isFull && !isBooked ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 17, flexShrink: 0, overflow: 'hidden' }}>
                    {d.personalPhoto ? <img src={d.personalPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : d.fullName.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{d.fullName} {isBooked ? '✅' : ''}</div>
                    <div style={{ fontSize: 11, color: '#7c5fb5' }}>{d.carType} • {d.lineType}</div>
                    <div style={{ color: ratingColor(r), fontSize: 12, fontWeight: 800 }}>
                      {r !== null ? '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r)) + ` ${r}` : '—'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 17, fontWeight: 900, color: '#22d3ee' }}>{d.price}</div>
                    <div style={{ fontSize: 10, color: '#7c5fb5' }}>د.ع/شهر</div>
                  </div>
                </div>
 
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 10 }}>
                  {[['السيارة', d.carType], ['المقاعد', isFull ? 'ممتلئ 🔴' : `${d.seats - d.bookedBy.length}/${d.seats} متاح`], ['التكييف', d.ac ? '❄️' : '—']].map(([l,v]) => (
                    <div key={l} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: '#7c5fb5', marginBottom: 2 }}>{l}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: l==='المقاعد'&&isFull?'#ff6b6b':'#fff' }}>{v}</div>
                    </div>
                  ))}
                </div>
 
                {d.routes?.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: '#7c5fb5' }}>يمر بـ: </span>
                    {d.routes.map(r => <span key={r} style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 999, padding: '2px 8px', fontSize: 10, fontWeight: 700, margin: 2, display: 'inline-block' }}>{r}</span>)}
                  </div>
                )}
 
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setRatingDriverId(d.id)} style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(124,58,237,0.15)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.25)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MessageSquare size={13} /> تقييم سري
                  </button>
                  <button
                    disabled={isFull && !isBooked}
                    onClick={() => onToggleBook(d.id, student.phone)}
                    style={{ flex: 1, padding: 12, borderRadius: 12, background: isBooked ? '#059669' : isFull ? 'rgba(100,100,100,0.15)' : '#7c3aed', color: isFull && !isBooked ? '#666' : '#fff', border: 'none', fontSize: 13, fontWeight: 800, cursor: isFull && !isBooked ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                    {isBooked ? '✅ تم الحجز' : isFull ? '🔴 ممتلئ' : 'حجز مقعد ✦'}
                  </button>
                </div>
              </div>
            );
          })
      )}
 
      {/* دعم فني */}
      <div style={{ background: '#1a1035', borderRadius: 14, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(124,58,237,0.1)', marginTop: 8 }}>
        <span style={{ fontSize: 12, color: '#7c5fb5', fontWeight: 700 }}>الدعم الفني</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" style={{ color: '#00C853', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12}/> واتساب</a>
          <a href={`https://instagram.com/${settings.instagram?.replace('@','')}`} target="_blank" rel="noreferrer" style={{ color: '#e879f9', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}><Camera size={12}/> إنستغرام</a>
        </div>
      </div>
 
      {/* مودال التقييم السري */}
      {ratingDriver && (
        <RatingModal
          driver={ratingDriver}
          student={student}
          onSubmit={(review) => onSubmitReview(ratingDriver.id, review)}
          onClose={() => setRatingDriverId(null)}
        />
      )}
    </div>
  );
};
 
export default StudentDashboard;