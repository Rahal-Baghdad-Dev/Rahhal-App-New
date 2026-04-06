import React, { useState } from 'react';
import { Plus } from 'lucide-react';
 
// ════════════════════════════════════════════════════════════
// PlacesTab.jsx  —  إدارة المناطق والكليات
// أي إضافة/حذف تنعكس فوراً على استمارات التسجيل
// ════════════════════════════════════════════════════════════
export const PlacesTab = ({ regions, setRegions, colleges, setColleges }) => {
  const [newR, setNewR] = useState('');
  const [newC, setNewC] = useState('');
 
  const addR = () => { const v=newR.trim(); if(!v||regions.includes(v))return; setRegions([...regions,v]); setNewR(''); };
  const addC = () => { const v=newC.trim(); if(!v||colleges.includes(v))return; setColleges([...colleges,v]); setNewC(''); };
 
  const S = {
    card: { background: '#1f1050', borderRadius: 18, padding: '1.1rem', border: '1px solid rgba(124,58,237,0.2)' },
    inp:  { flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 13, fontWeight: 700, outline: 'none', fontFamily: 'inherit' },
    tag:  (color='cyan') => ({ background: `rgba(${color==='cyan'?'34,211,238':'167,139,250'},0.1)`, color: color==='cyan'?'#22d3ee':'#c4b5fd', border: `1px solid rgba(${color==='cyan'?'34,211,238':'167,139,250'},0.25)`, borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5, margin: 2 }),
  };
 
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* المناطق */}
        <div style={S.card}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#22d3ee', marginBottom: 10 }}>📍 المناطق السكنية ({regions.length})</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: 40, marginBottom: 10 }}>
            {regions.map(r => (
              <span key={r} style={S.tag('cyan')}>{r}<span onClick={() => setRegions(regions.filter(x=>x!==r))} style={{ cursor: 'pointer', color: '#7c5fb5', fontSize: 12, lineHeight: 1 }}>×</span></span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input style={S.inp} placeholder="أضف منطقة..." value={newR} onChange={e=>setNewR(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addR();}} />
            <button onClick={addR} style={{ padding: '10px 14px', borderRadius: 10, background: '#00e5ff', color: '#120a2e', border: 'none', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center' }}><Plus size={15}/></button>
          </div>
        </div>
 
        {/* الكليات */}
        <div style={S.card}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa', marginBottom: 10 }}>🏛️ الجامعات والكليات ({colleges.length})</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: 40, marginBottom: 10 }}>
            {colleges.map(c => (
              <span key={c} style={S.tag('purple')}>{c}<span onClick={() => setColleges(colleges.filter(x=>x!==c))} style={{ cursor: 'pointer', color: '#7c5fb5', fontSize: 12, lineHeight: 1 }}>×</span></span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input style={S.inp} placeholder="أضف جامعة..." value={newC} onChange={e=>setNewC(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addC();}} />
            <button onClick={addC} style={{ padding: '10px 14px', borderRadius: 10, background: '#7c3aed', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center' }}><Plus size={15}/></button>
          </div>
        </div>
      </div>
      <div style={{ background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 12, padding: '10px 14px', marginTop: 12, fontSize: 11, color: '#fb923c', fontWeight: 700 }}>
        ⚠️ أي إضافة أو حذف تنعكس فوراً على استمارات التسجيل للسائقين والطلاب الجدد.
      </div>
    </div>
  );
};
 
export default PlacesTab;