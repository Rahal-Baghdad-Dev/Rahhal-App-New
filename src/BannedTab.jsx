import React, { useState } from 'react';
import { Search } from 'lucide-react';
 
// ════════════════════════════════════════════════════════════
// BannedTab.jsx  —  قائمة المحظورين (سائقون + طلاب)
// ════════════════════════════════════════════════════════════
const BannedTab = ({ drivers, setDrivers, students, setStudents }) => {
  const [type,   setType]   = useState('drivers');
  const [search, setSearch] = useState('');
 
  const bannedD = drivers.filter(d => d.banned);
  const bannedS = students.filter(s => s.banned);
 
  const list = (type === 'drivers' ? bannedD : bannedS).filter(
    p => !search || p.fullName?.includes(search) || p.phone?.includes(search)
  );
 
  const unbanDriver  = (d) => { setDrivers(drivers.map(x   => x.id === d.id ? { ...x, banned: false } : x));   alert(`✅ تم رفع حظر ${d.fullName}`); };
  const unbanStudent = (s) => { setStudents(students.map(x => x.id === s.id ? { ...x, banned: false } : x)); alert(`✅ تم رفع حظر ${s.fullName}`); };
 
  const S = {
    inp: { width: '100%', padding: '10px 38px 10px 14px', borderRadius: 10, border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 13, fontWeight: 700, outline: 'none', fontFamily: 'inherit' },
  };
 
  return (
    <div>
      {/* نوع */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[['drivers',`سائقون (${bannedD.length})`],['students',`طلاب (${bannedS.length})`]].map(([v,l]) => (
          <button key={v} onClick={() => { setType(v); setSearch(''); }} style={{ flex: 1, padding: '9px', borderRadius: 999, background: type===v?'#ff4444':'rgba(255,255,255,0.04)', color: type===v?'#fff':'#7c5fb5', border: type===v?'none':'1px solid rgba(255,50,50,0.2)', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>{l}</button>
        ))}
      </div>
 
      {/* بحث */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={14} style={{ position: 'absolute', right: 12, top: 12, color: '#7c5fb5' }} />
        <input style={S.inp} placeholder="البحث في قائمة المحظورين..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
 
      {/* القائمة */}
      <div style={{ background: '#1f1050', borderRadius: 18, padding: '0.8rem', border: '1px solid rgba(255,50,50,0.1)' }}>
        {list.length === 0
          ? <div style={{ textAlign: 'center', padding: '2rem', color: '#7c5fb5', fontSize: 13, fontWeight: 700 }}>🛡️ لا يوجد محظورون</div>
          : list.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderBottom: '1px solid rgba(255,50,50,0.08)' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,80,80,0.1)', color: '#ff6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, opacity: 0.7, flexShrink: 0 }}>{p.fullName?.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#94a3b8' }}>{p.fullName}</div>
                <div style={{ fontSize: 11, color: '#7c5fb5' }}>{p.phone}</div>
              </div>
              <button onClick={() => type === 'drivers' ? unbanDriver(p) : unbanStudent(p)} style={{ padding: '6px 14px', borderRadius: 999, background: 'rgba(0,200,83,0.12)', color: '#00C853', border: '1px solid rgba(0,200,83,0.2)', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>رفع الحظر ✓</button>
            </div>
          ))
        }
      </div>
 
      <div style={{ background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 12, padding: '10px 14px', marginTop: 12, fontSize: 11, color: '#fb923c', fontWeight: 700 }}>
        ⚠️ رفع الحظر يُعيد المستخدم فوراً للخدمة. السائق سيظهر للطلاب وسيتمكن الطالب من الحجز مجدداً.
      </div>
    </div>
  );
};
 
export default BannedTab;