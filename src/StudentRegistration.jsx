import React, { useState } from 'react';
 
const StudentRegistration = ({ regions, colleges, settings, onBack, onSubmit }) => {
  const [form, setForm] = useState({ fullName:'', phone:'', gender:'ذكر', lineStart:'', college:'' });
  const [showFromDD, setShowFromDD] = useState(false);
  const [showToDD,   setShowToDD]   = useState(false);
  const [fromQ, setFromQ] = useState('');
  const [toQ,   setToQ]   = useState('');
 
  const S = {
    wrap: { maxWidth:430, margin:'0 auto', padding:'1rem 1rem 4rem', background:'#0f0a1e', minHeight:'100vh' },
    card: { background:'#1a1035', borderRadius:18, padding:'1.1rem', marginBottom:12, border:'1px solid rgba(124,58,237,0.15)' },
    inp:  { width:'100%', padding:'11px 14px', borderRadius:10, border:'1px solid rgba(124,58,237,0.25)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:13, fontWeight:700, outline:'none', fontFamily:'inherit' },
    lbl:  { fontSize:11, color:'#7c5fb5', fontWeight:700, marginBottom:5 },
    dd:   { background:'#1a1035', border:'1px solid rgba(124,58,237,0.3)', borderRadius:12, padding:8, marginTop:4 },
  };
 
  const filteredR = regions.filter(r => r.includes(fromQ));
  const filteredC = colleges.filter(c => c.includes(toQ));
 
  const submit = e => {
    e.preventDefault();
    if (!form.fullName||!form.phone) return alert('أدخل الاسم والهاتف');
    if (!form.lineStart||!form.college) return alert('اختر المنطقة والجامعة');
    onSubmit(form);
  };
 
  return (
    <div style={S.wrap} dir="rtl">
      <button onClick={onBack} style={{ display:'flex',alignItems:'center',gap:5,color:'#facc15',fontSize:13,fontWeight:800,background:'none',border:'none',cursor:'pointer',marginBottom:12,fontFamily:'inherit' }}>← رجوع</button>
      <div style={{ fontSize:22,fontWeight:900,marginBottom:'1.2rem' }}>🎓 حساب طالب جديد</div>
      <form onSubmit={submit}>
        <div style={S.card}>
          <div style={S.lbl}>اسم الطالب</div>
          <input style={{ ...S.inp,marginBottom:10 }} placeholder="الاسم الكامل" value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} required />
          <div style={S.lbl}>رقم الهاتف</div>
          <input style={{ ...S.inp,marginBottom:10 }} placeholder="07XXXXXXXXX" type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} required />
          <div style={S.lbl}>الجنس</div>
          <div style={{ display:'flex',gap:8 }}>
            {['ذكر','أنثى'].map(g=><button key={g} type="button" onClick={()=>setForm(f=>({...f,gender:g}))} style={{ flex:1,padding:10,borderRadius:10,background:form.gender===g?'rgba(168,85,247,0.2)':'transparent',color:form.gender===g?'#fff':'#7c5fb5',border:`2px solid ${form.gender===g?'#a855f7':'rgba(124,58,237,0.25)'}`,fontSize:14,fontWeight:800,cursor:'pointer',fontFamily:'inherit' }}>{g}</button>)}
          </div>
        </div>
        <div style={S.card}>
          <div style={S.lbl}>منطقة السكن</div>
          <div onClick={()=>{setShowFromDD(!showFromDD);setShowToDD(false);}} style={{ ...S.inp,cursor:'pointer',display:'flex',justifyContent:'space-between',marginBottom:showFromDD?0:10 }}>
            <span style={{ color:form.lineStart?'#fff':'#4a3a6a' }}>{form.lineStart||'اختر منطقتك...'}</span><span style={{ color:'#7c5fb5' }}>▾</span>
          </div>
          {showFromDD&&<div style={S.dd}><input style={{ ...S.inp,marginBottom:6,padding:'7px 10px',fontSize:12 }} placeholder="ابحث..." value={fromQ} onChange={e=>setFromQ(e.target.value)} autoFocus /><div style={{ maxHeight:130,overflowY:'auto' }}>{filteredR.map(r=><div key={r} onClick={()=>{setForm(f=>({...f,lineStart:r}));setShowFromDD(false);setFromQ('');}} style={{ padding:'8px 10px',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer' }} onMouseEnter={e=>e.target.style.background='rgba(168,85,247,0.2)'} onMouseLeave={e=>e.target.style.background='transparent'}>{r}</div>)}</div></div>}
          <div style={{ ...S.lbl,marginTop:8 }}>الجامعة / كليتك</div>
          <div onClick={()=>{setShowToDD(!showToDD);setShowFromDD(false);}} style={{ ...S.inp,cursor:'pointer',display:'flex',justifyContent:'space-between',marginBottom:showToDD?0:10 }}>
            <span style={{ color:form.college?'#fff':'#4a3a6a' }}>{form.college||'اختر كليتك...'}</span><span style={{ color:'#7c5fb5' }}>▾</span>
          </div>
          {showToDD&&<div style={S.dd}><input style={{ ...S.inp,marginBottom:6,padding:'7px 10px',fontSize:12 }} placeholder="ابحث..." value={toQ} onChange={e=>setToQ(e.target.value)} autoFocus /><div style={{ maxHeight:130,overflowY:'auto' }}>{filteredC.map(c=><div key={c} onClick={()=>{setForm(f=>({...f,college:c}));setShowToDD(false);setToQ('');}} style={{ padding:'8px 10px',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer' }} onMouseEnter={e=>e.target.style.background='rgba(168,85,247,0.2)'} onMouseLeave={e=>e.target.style.background='transparent'}>{c}</div>)}</div></div>}
        </div>
        <button type="submit" style={{ width:'100%',padding:14,borderRadius:14,background:'#a855f7',color:'#fff',fontSize:16,fontWeight:900,border:'none',cursor:'pointer',fontFamily:'inherit' }}>✨ إنشاء الحساب الآن</button>
        <div style={{ background:'#1a1035',borderRadius:14,padding:'10px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid rgba(124,58,237,0.1)',marginTop:12 }}>
          <span style={{ fontSize:12,color:'#7c5fb5',fontWeight:700 }}>الدعم الفني</span>
          <div style={{ display:'flex',gap:12 }}>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" style={{ color:'#00C853',fontSize:12,fontWeight:800 }}>واتساب</a>
            <a href={`https://instagram.com/${settings.instagram?.replace('@','')}`} target="_blank" rel="noreferrer" style={{ color:'#e879f9',fontSize:12,fontWeight:800 }}>إنستغرام</a>
          </div>
        </div>
      </form>
    </div>
  );
};
 
export default StudentRegistration;