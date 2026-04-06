import React, { useState } from 'react';
import { Search, AlertTriangle, Ban, Send, Trash2, Save } from 'lucide-react';
import { calcRating, ratingStars, ratingColor } from './firebase';
 
// ── مكوّن صورة وثيقة ─────────────────────────────────────────
const PhotoCard = ({ emoji, label, src }) => {
  const openImg = () => {
    if (src) { const w = window.open(); w.document.write(`<img src="${src}" style="max-width:100%;max-height:100vh"/>`); }
  };
  return (
    <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.1)', overflow: 'hidden' }}>
      <div onClick={openImg} style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, cursor: src ? 'pointer' : 'default', position: 'relative' }}>
        {src ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={label} /> : <span>{emoji}</span>}
        {src && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>🔍</div>}
      </div>
      <div style={{ fontSize: 10, color: '#7c5fb5', padding: '4px 8px' }}>{label}</div>
      <div style={{ display: 'flex', gap: 4, padding: '4px 6px 6px' }}>
        <button onClick={() => alert('تم حذف الصورة')} style={{ flex: 1, padding: 5, borderRadius: 8, background: 'rgba(255,80,80,0.12)', color: '#ff6b6b', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <Trash2 size={9} /> حذف
        </button>
        <button onClick={() => alert('تم الحفظ')} style={{ flex: 1, padding: 5, borderRadius: 8, background: 'rgba(0,200,83,0.12)', color: '#00C853', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <Save size={9} /> حفظ
        </button>
      </div>
    </div>
  );
};
 
// ════════════════════════════════════════════════════════════
const DriversTab = ({ drivers, setDrivers }) => {
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [selDriver, setSelDriver] = useState(null);
  const [notif,   setNotif]   = useState('');
 
  const active = drivers.filter(d => d.isApproved && !d.banned);
 
  const filtered = active.filter(d => {
    const q = !search || d.fullName?.includes(search) || d.phone?.includes(search);
    const r = calcRating(d.reviews);
    const f = filter === 'all'
      || (filter === 'top' && (r || 0) >= 4)
      || (filter === 'mid' && (r || 0) >= 2.5 && (r || 0) < 4)
      || (filter === 'low' && r !== null && (r || 0) < 2.5);
    return q && f;
  }).sort((a, b) => (calcRating(b.reviews) || 0) - (calcRating(a.reviews) || 0));
 
  const warn = (driver) => {
    setDrivers(drivers.map(d => d.id === driver.id ? { ...d, warned: true } : d));
    setSelDriver(null);
    alert(`⚠️ تم إرسال تحذير رسمي لـ ${driver.fullName}`);
  };
 
  const ban = (driver) => {
    if (!window.confirm(`حظر ${driver.fullName}؟`)) return;
    setDrivers(drivers.map(d => d.id === driver.id ? { ...d, banned: true } : d));
    setSelDriver(null);
  };
 
  const sendNotif = (driver) => {
    if (!notif.trim()) { alert('اكتب التنبيه أولاً'); return; }
    alert(`📨 تم إرسال التنبيه لـ ${driver.fullName}:\n"${notif}"`);
    setNotif('');
  };
 
  const S = {
    inp: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 13, fontWeight: 700, outline: 'none', fontFamily: 'inherit' },
    btn: (bg, color) => ({ padding: '11px', borderRadius: 12, background: bg, color, border: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', width: '100%', marginTop: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }),
    ibox: { background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(124,58,237,0.1)' },
  };
 
  return (
    <div>
      {/* بحث */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', right: 12, top: 12, color: '#7c5fb5' }} />
          <input style={{ ...S.inp, paddingRight: 36 }} placeholder="ابحث بالاسم أو الرقم..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {[['all','الكل'],['top','★ 4+'],['mid','★ 3-4'],['low','أقل من 3']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: '8px 14px', borderRadius: 999, background: filter===v?'#00e5ff':'rgba(255,255,255,0.04)', color: filter===v?'#120a2e':'#7c5fb5', border: filter===v?'none':'1px solid rgba(124,58,237,0.25)', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>{l}</button>
        ))}
      </div>
 
      {/* قائمة */}
      {filtered.length === 0
        ? <div style={{ textAlign: 'center', padding: '2rem', color: '#7c5fb5', fontSize: 13, fontWeight: 700 }}>لا توجد نتائج</div>
        : filtered.map(d => {
          const r = calcRating(d.reviews);
          return (
            <div key={d.id} onClick={() => { setSelDriver(d); setNotif(''); }} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1f1050', borderRadius: 14, padding: '11px 14px', marginBottom: 8, cursor: 'pointer', border: `1px solid ${d.warned ? 'rgba(251,146,60,0.3)' : 'rgba(124,58,237,0.15)'}`, transition: 'all 0.2s' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 17, flexShrink: 0, overflow: 'hidden' }}>
                {d.personalPhoto ? <img src={d.personalPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : d.fullName.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{d.fullName} {d.warned ? '⚠️' : ''}</div>
                <div style={{ fontSize: 11, color: '#7c5fb5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.phone} • {d.resSearch} ← {d.college}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>مقاعد: {d.seats - d.bookedBy.length}/{d.seats} • {d.lineType}</div>
              </div>
              <div style={{ textAlign: 'left', flexShrink: 0 }}>
                <div style={{ color: ratingColor(r), fontSize: 12, fontWeight: 800 }}>{r !== null ? `${'★'.repeat(Math.round(r))} ${r}` : '—'}</div>
                <div style={{ fontSize: 10, color: '#7c5fb5' }}>{d.reviews.length} تقييم</div>
              </div>
              <span style={{ color: '#7c5fb5', fontSize: 18 }}>›</span>
            </div>
          );
        })
      }
 
      {/* مودال السائق */}
      {selDriver && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setSelDriver(null); }}>
          <div style={{ background: '#1a1035', borderRadius: '26px 26px 0 0', padding: '1.4rem', width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(124,58,237,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#00e5ff' }}>بطاقة السائق {selDriver.warned ? '⚠️' : ''}</div>
              <button onClick={() => setSelDriver(null)} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer' }}>×</button>
            </div>
 
            {/* رأس البطاقة */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, margin: '0 auto 8px', overflow: 'hidden' }}>
                {selDriver.personalPhoto ? <img src={selDriver.personalPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : selDriver.fullName.charAt(0)}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{selDriver.fullName}</div>
              <div style={{ fontSize: 12, color: '#7c5fb5' }}>{selDriver.carType} • {selDriver.lineType}</div>
              {(() => { const r = calcRating(selDriver.reviews); return (
                <div style={{ color: ratingColor(r), fontSize: 15, fontWeight: 800, marginTop: 5 }}>
                  {ratingStars(r)}
                  <span style={{ fontSize: 11, color: '#7c5fb5', marginRight: 6 }}>({selDriver.reviews.length} تقييم)</span>
                </div>
              ); })()}
            </div>
 
            {/* معلومات */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[['الهاتف', selDriver.phone], ['السعر', `${selDriver.price} د.ع`], ['المسار', `${selDriver.resSearch} ← ${selDriver.college}`], ['المقاعد', `${selDriver.seats - selDriver.bookedBy.length}/${selDriver.seats}`], ['اللوحة', selDriver.plateNumber], ['التكييف', selDriver.ac ? '❄️ يوجد' : 'لا يوجد']].map(([l,v]) => (
                <div key={l} style={S.ibox}><div style={{ fontSize: 10, color: '#7c5fb5', marginBottom: 2 }}>{l}</div><div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{v}</div></div>
              ))}
            </div>
 
            {/* مناطق المرور */}
            {selDriver.routes?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#7c5fb5', marginBottom: 5, fontWeight: 700 }}>يمر بـ:</div>
                {selDriver.routes.map(r => <span key={r} style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700, margin: 2, display: 'inline-block' }}>{r}</span>)}
              </div>
            )}
 
            {/* الوثائق */}
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00e5ff', marginBottom: 8 }}>📸 الوثائق والصور</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
              <PhotoCard emoji="🤳" label="سيلفي حي"     src={selDriver.personalPhoto} />
              <PhotoCard emoji="🪪" label="إجازة القيادة" src={selDriver.licensePhoto} />
              <PhotoCard emoji="📋" label="السنوية"        src={selDriver.sanawiaPhoto} />
            </div>
 
            {/* التقييمات السرية */}
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00e5ff', marginBottom: 8 }}>💬 التقييمات السرية ({selDriver.reviews.length})</div>
            <div style={{ maxHeight: 160, overflowY: 'auto', marginBottom: 12 }}>
              {selDriver.reviews.length > 0
                ? selDriver.reviews.map((rev, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '9px 12px', marginBottom: 7, border: '1px solid rgba(124,58,237,0.1)' }}>
                    <div style={{ color: '#facc15', fontSize: 12, marginBottom: 3 }}>{'★'.repeat(rev.stars)} — {rev.by}</div>
                    <div style={{ fontSize: 12, color: '#e2e8f0' }}>{rev.text}</div>
                    <div style={{ fontSize: 10, color: '#7c5fb5', marginTop: 2 }}>{rev.date}</div>
                  </div>
                ))
                : <div style={{ color: '#7c5fb5', fontSize: 12, textAlign: 'center', padding: '1rem' }}>لا توجد تقييمات بعد</div>
              }
            </div>
 
            {/* إرسال تنبيه */}
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00e5ff', marginBottom: 6 }}>📢 إرسال تنبيه</div>
            <textarea value={notif} onChange={e => setNotif(e.target.value)} rows={2} placeholder="اكتب التنبيه للسائق..." style={{ ...S.inp, borderRadius: 10, resize: 'none', marginBottom: 6, width: '100%' }} />
            <button onClick={() => sendNotif(selDriver)} style={S.btn('linear-gradient(135deg,#0891b2,#0e7490)', '#fff')}><Send size={14} /> إرسال التنبيه</button>
            <button onClick={() => warn(selDriver)} style={S.btn('rgba(251,146,60,0.12)', '#fb923c')}><AlertTriangle size={14} /> تحذير رسمي</button>
            <button onClick={() => ban(selDriver)} style={S.btn('rgba(255,50,50,0.12)', '#ff4444')}><Ban size={14} /> حظر السائق</button>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default DriversTab;