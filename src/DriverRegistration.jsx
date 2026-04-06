import React, { useState } from 'react';
import { Plus, Star } from 'lucide-react';
 
const DriverRegistration = ({ regions, colleges, settings, onBack, onSubmit }) => {
  const [form, setForm] = useState({ fullName:'', phone:'', carType:'', plateNumber:'', price:'', seats:4, ac:true, lineType:'مختلط', resSearch:'', college:'', routes:[], personalPhoto:null, licensePhoto:null, sanawiaPhoto:null });
  const [showFromDD, setShowFromDD] = useState(false);
  const [showToDD,   setShowToDD]   = useState(false);
  const [fromQ, setFromQ] = useState('');
  const [toQ,   setToQ]   = useState('');
  const [routeInp, setRouteInp] = useState('');
 
  const S = {
    wrap: { maxWidth:430, margin:'0 auto', padding:'1rem 1rem 4rem', background:'#0f0a1e', minHeight:'100vh' },
    card: { background:'#1a1035', borderRadius:18, padding:'1.1rem', marginBottom:12, border:'1px solid rgba(124,58,237,0.15)' },
    inp:  { width:'100%', padding:'11px 14px', borderRadius:10, border:'1px solid rgba(124,58,237,0.25)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:13, fontWeight:700, outline:'none', fontFamily:'inherit' },
    lbl:  { fontSize:11, color:'#7c5fb5', fontWeight:700, marginBottom:5 },
    dd:   { background:'#1a1035', border:'1px solid rgba(124,58,237,0.3)', borderRadius:12, padding:8, marginTop:4 },
  };
 
  const handleFile = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(f => ({ ...f, [field]: reader.result }));
    reader.readAsDataURL(file);
  };
 
  const addRoute = () => {
    const v = routeInp.trim();
    if (!v || form.routes.includes(v)) return;
    setForm(f => ({ ...f, routes: [...f.routes, v] }));
    setRouteInp('');
  };
 
  const filteredR = regions.filter(r => r.includes(fromQ));
  const filteredC = colleges.filter(c => c.includes(toQ));
 
  const UploadBox = ({ field, emoji, label, capture }) => (
    <label style={{ display:'block', border:'2px dashed rgba(124,58,237,0.3)', borderRadius:14, padding:'1rem', textAlign:'center', cursor:'pointer', position:'relative', borderColor:form[field]?'#a855f7':'rgba(124,58,237,0.3)', background:form[field]?'rgba(168,85,247,0.05)':'transparent' }}>
      <input type="file" accept="image/*" capture={capture||undefined} style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%' }} onChange={e=>handleFile(field,e.target.files[0])} />
      {form[field]
        ? <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}><img src={form[field]} style={{ height:70, borderRadius:10, objectFit:'cover' }} alt="" /><span style={{ fontSize:11, color:'#a855f7', fontWeight:700 }}>تم ✓</span></div>
        : <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, color:'#7c5fb5' }}><span style={{ fontSize:26 }}>{emoji}</span><span style={{ fontSize:11, fontWeight:700 }}>{label}</span></div>
      }
    </label>
  );
 
  const submit = e => {
    e.preventDefault();
    if (!form.fullName||!form.phone) return alert('أدخل الاسم والهاتف');
    if (!form.personalPhoto) return alert('يرجى رفع صورة سيلفي حية');
    if (!form.resSearch||!form.college) return alert('اختر المنطقة والجامعة');
    onSubmit(form);
  };
 
  return (
    <div style={S.wrap} dir="rtl">
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, color:'#facc15', fontSize:13, fontWeight:800, background:'none', border:'none', cursor:'pointer', marginBottom:12, fontFamily:'inherit' }}>← رجوع</button>
      <div style={{ fontSize:22, fontWeight:900, marginBottom:'1.2rem' }}>🚗 تسجيل سائق جديد</div>
      <form onSubmit={submit}>
        <div style={S.card}>
          <div style={S.lbl}>الاسم الثلاثي</div>
          <input style={{ ...S.inp, marginBottom:10 }} placeholder="الاسم الكامل" value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} required />
          <div style={S.lbl}>رقم الهاتف</div>
          <input style={S.inp} placeholder="07XXXXXXXXX" type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} required />
        </div>
        <div style={S.card}>
          <div style={S.lbl}>📸 صورة سيلفي حية</div>
          <div style={{ marginBottom:10 }}><UploadBox field="personalPhoto" emoji="🤳" label="التقط صورة حية" capture="user" /></div>
          <div style={S.lbl}>📋 صورة السنوية</div>
          <UploadBox field="sanawiaPhoto" emoji="📋" label="ارفع صورة السنوية" />
        </div>
        <div style={S.card}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <div><div style={S.lbl}>نوع السيارة</div><input style={S.inp} placeholder="كيا..." value={form.carType} onChange={e=>setForm(f=>({...f,carType:e.target.value}))} required /></div>
            <div><div style={S.lbl}>رقم اللوحة</div><input style={S.inp} placeholder="ب٢٣٤٥" value={form.plateNumber} onChange={e=>setForm(f=>({...f,plateNumber:e.target.value}))} required /></div>
          </div>
          <div style={S.lbl}>السعر الشهري (د.ع)</div>
          <input style={{ ...S.inp, marginBottom:10 }} type="number" placeholder="80000" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required />
          <div style={S.lbl}>عدد الركاب</div>
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(0,0,0,0.2)', borderRadius:999, padding:'6px 14px' }}>
            <button type="button" onClick={()=>setForm(f=>({...f,seats:Math.max(1,f.seats-1)}))} style={{ width:34,height:34,borderRadius:'50%',background:'rgba(255,80,80,0.15)',color:'#ff6b6b',border:'none',fontSize:18,fontWeight:800,cursor:'pointer' }}>−</button>
            <span style={{ flex:1,textAlign:'center',fontSize:24,fontWeight:900 }}>{form.seats}</span>
            <button type="button" onClick={()=>setForm(f=>({...f,seats:Math.min(40,f.seats+1)}))} style={{ width:34,height:34,borderRadius:'50%',background:'rgba(0,200,83,0.15)',color:'#00C853',border:'none',fontSize:18,fontWeight:800,cursor:'pointer' }}>+</button>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.lbl}>منطقة الانطلاق</div>
          <div onClick={()=>{setShowFromDD(!showFromDD);setShowToDD(false);}} style={{ ...S.inp,cursor:'pointer',display:'flex',justifyContent:'space-between',marginBottom:showFromDD?0:8 }}>
            <span style={{ color:form.resSearch?'#fff':'#4a3a6a' }}>{form.resSearch||'اختر...'}</span><span style={{ color:'#7c5fb5' }}>▾</span>
          </div>
          {showFromDD&&<div style={S.dd}><input style={{ ...S.inp,marginBottom:6,padding:'7px 10px',fontSize:12 }} placeholder="ابحث..." value={fromQ} onChange={e=>setFromQ(e.target.value)} autoFocus /><div style={{ maxHeight:120,overflowY:'auto' }}>{filteredR.map(r=><div key={r} onClick={()=>{setForm(f=>({...f,resSearch:r}));setShowFromDD(false);setFromQ('');}} style={{ padding:'8px 10px',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer' }} onMouseEnter={e=>e.target.style.background='rgba(168,85,247,0.2)'} onMouseLeave={e=>e.target.style.background='transparent'}>{r}</div>)}</div></div>}
          <div style={{ ...S.lbl,marginTop:8 }}>الوجهة (الجامعة)</div>
          <div onClick={()=>{setShowToDD(!showToDD);setShowFromDD(false);}} style={{ ...S.inp,cursor:'pointer',display:'flex',justifyContent:'space-between',marginBottom:showToDD?0:10 }}>
            <span style={{ color:form.college?'#fff':'#4a3a6a' }}>{form.college||'اختر...'}</span><span style={{ color:'#7c5fb5' }}>▾</span>
          </div>
          {showToDD&&<div style={S.dd}><input style={{ ...S.inp,marginBottom:6,padding:'7px 10px',fontSize:12 }} placeholder="ابحث..." value={toQ} onChange={e=>setToQ(e.target.value)} autoFocus /><div style={{ maxHeight:120,overflowY:'auto' }}>{filteredC.map(c=><div key={c} onClick={()=>{setForm(f=>({...f,college:c}));setShowToDD(false);setToQ('');}} style={{ padding:'8px 10px',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer' }} onMouseEnter={e=>e.target.style.background='rgba(168,85,247,0.2)'} onMouseLeave={e=>e.target.style.background='transparent'}>{c}</div>)}</div></div>}
          <div style={S.lbl}>🗺️ المناطق التي يمر بها</div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:5,minHeight:24,marginBottom:6 }}>
            {form.routes.map(r=><span key={r} style={{ background:'rgba(124,58,237,0.15)',color:'#c4b5fd',border:'1px solid rgba(124,58,237,0.3)',borderRadius:999,padding:'4px 10px',fontSize:11,fontWeight:700,display:'inline-flex',alignItems:'center',gap:4 }}>{r}<span onClick={()=>setForm(f=>({...f,routes:f.routes.filter(x=>x!==r)}))} style={{ cursor:'pointer',color:'#7c5fb5',fontSize:12 }}>×</span></span>)}
          </div>
          <div style={{ display:'flex',gap:6,marginBottom:10 }}>
            <input style={{ ...S.inp,flex:1 }} placeholder="منطقة يمر بها..." value={routeInp} onChange={e=>setRouteInp(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addRoute();}}} />
            <button type="button" onClick={addRoute} style={{ padding:'10px 14px',borderRadius:10,background:'#22d3ee',color:'#120a2e',border:'none',fontWeight:800,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center' }}><Plus size={15}/></button>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.lbl}>❄️ التكييف</div>
          <div style={{ display:'flex',gap:8,marginBottom:10 }}>
            {[true,false].map(v=><button key={String(v)} type="button" onClick={()=>setForm(f=>({...f,ac:v}))} style={{ flex:1,padding:10,borderRadius:10,background:form.ac===v?(v?'#059669':'#334155'):'transparent',color:form.ac===v?'#fff':'#7c5fb5',border:`2px solid ${form.ac===v?(v?'#059669':'#334155'):'rgba(124,58,237,0.25)'}`,fontSize:13,fontWeight:800,cursor:'pointer',fontFamily:'inherit' }}>{v?'❄️ يوجد':'بدون تكييف'}</button>)}
          </div>
          <div style={S.lbl}>👤 نوع الخط</div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:10 }}>
            {['مختلط','طالبات إناث','طلبة ذكور'].map(t=><button key={t} type="button" onClick={()=>setForm(f=>({...f,lineType:t}))} style={{ padding:10,borderRadius:10,background:form.lineType===t?'rgba(168,85,247,0.2)':'transparent',color:form.lineType===t?'#fff':'#7c5fb5',border:`2px solid ${form.lineType===t?'#a855f7':'rgba(124,58,237,0.25)'}`,fontSize:12,fontWeight:800,cursor:'pointer',fontFamily:'inherit' }}>{t}</button>)}
          </div>
          <div style={S.lbl}>🪪 إجازة السوق</div>
          <UploadBox field="licensePhoto" emoji="🪪" label="ارفع إجازة القيادة" />
        </div>
        <button type="submit" style={{ width:'100%',padding:14,borderRadius:14,background:'#facc15',color:'#1a0b2e',fontSize:16,fontWeight:900,border:'none',cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
          <Star size={18} fill="#1a0b2e" /> إرسال الطلب
        </button>
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
 
export default DriverRegistration;