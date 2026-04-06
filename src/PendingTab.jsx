// ════════════════════════════════════════════════════════════
// PendingTab.jsx
// ════════════════════════════════════════════════════════════
import React from 'react';
import { CheckCircle, XCircle, Trash2, Save } from 'lucide-react';
 
const PhotoCard = ({ emoji, label, src }) => {
  const open = () => { if (src) { const w = window.open(); w.document.write(`<img src="${src}" style="max-width:100%;max-height:100vh"/>`); } };
  return (
    <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.1)', overflow: 'hidden' }}>
      <div onClick={open} style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, cursor: 'pointer' }}>
        {src ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={label} /> : <span>{emoji}</span>}
      </div>
      <div style={{ fontSize: 10, color: '#7c5fb5', padding: '3px 7px' }}>{label}</div>
      <div style={{ display: 'flex', gap: 3, padding: '3px 5px 5px' }}>
        <button onClick={() => alert('تم حذف الصورة')} style={{ flex: 1, padding: 4, borderRadius: 7, background: 'rgba(255,80,80,0.12)', color: '#ff6b6b', border: 'none', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}><Trash2 size={8} /> حذف</button>
        <button onClick={() => alert('تم الحفظ')} style={{ flex: 1, padding: 4, borderRadius: 7, background: 'rgba(0,200,83,0.12)', color: '#00C853', border: 'none', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}><Save size={8} /> حفظ</button>
      </div>
    </div>
  );
};
 
const IBox = ({ label, value }) => (
  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(124,58,237,0.1)' }}>
    <div style={{ fontSize: 10, color: '#7c5fb5', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{value || '—'}</div>
  </div>
);
 
export const PendingTab = ({ pending, setPending, drivers, setDrivers }) => {
  const approve = (driver) => {
    setDrivers([...drivers, { ...driver, isApproved: true, banned: false, warned: false, reviews: [], bookedBy: [] }]);
    setPending(pending.filter(d => d.id !== driver.id));
    alert(`✅ تم تفعيل حساب ${driver.fullName}`);
  };
  const reject = (driver) => {
    if (!window.confirm(`رفض طلب ${driver.fullName}؟`)) return;
    setPending(pending.filter(d => d.id !== driver.id));
    alert('تم رفض الطلب');
  };
 
  if (pending.length === 0) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#7c5fb5', fontSize: 13, fontWeight: 700 }}>✅ لا توجد طلبات معلقة</div>
  );
 
  return (
    <div>
      {pending.map(d => (
        <div key={d.id} style={{ background: '#1f1050', borderRadius: 18, padding: '1.1rem', marginBottom: 12, border: '1px solid rgba(251,146,60,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(251,146,60,0.2)', color: '#fb923c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 17, flexShrink: 0, overflow: 'hidden' }}>
              {d.personalPhoto ? <img src={d.personalPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : d.fullName.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{d.fullName}</div>
              <div style={{ fontSize: 11, color: '#7c5fb5' }}>{d.phone}</div>
            </div>
            <span style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c', borderRadius: 999, padding: '3px 10px', fontSize: 10, fontWeight: 800, animation: 'pulse 2s infinite' }}>انتظار موافقة</span>
          </div>
 
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 10 }}>
            <IBox label="السيارة"    value={d.carType} />
            <IBox label="اللوحة"     value={d.plateNumber} />
            <IBox label="التكييف"    value={d.ac ? '❄️' : 'لا'} />
            <IBox label="الخط"       value={d.lineType} />
            <IBox label="السعر"      value={d.price ? `${d.price} د.ع` : '—'} />
            <IBox label="الركاب"     value={d.seats} />
          </div>
          <IBox label="المسار" value={`${d.resSearch || '؟'} ← ${d.college || '؟'}`} />
          {d.routes?.length > 0 && (
            <div style={{ marginTop: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: '#7c5fb5' }}>يمر بـ: </span>
              {d.routes.map(r => <span key={r} style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', borderRadius: 999, padding: '2px 8px', fontSize: 10, fontWeight: 700, margin: 2, display: 'inline-block' }}>{r}</span>)}
            </div>
          )}
 
          <div style={{ fontSize: 12, fontWeight: 800, color: '#fb923c', margin: '10px 0 6px' }}>📸 الوثائق المرفوعة</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
            <PhotoCard emoji="🤳" label="سيلفي حي"     src={d.personalPhoto} />
            <PhotoCard emoji="🪪" label="إجازة القيادة" src={d.licensePhoto} />
            <PhotoCard emoji="📋" label="السنوية"        src={d.sanawiaPhoto} />
          </div>
 
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => approve(d)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#059669', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><CheckCircle size={15} /> تفعيل الحساب</button>
            <button onClick={() => reject(d)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,80,80,0.12)', color: '#ff6b6b', border: '1px solid rgba(255,80,80,0.25)', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><XCircle size={15} /> رفض الطلب</button>
          </div>
        </div>
      ))}
    </div>
  );
};
 
export default PendingTab;