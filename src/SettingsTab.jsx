import React, { useState } from 'react';
import { Save } from 'lucide-react';
 
// ════════════════════════════════════════════════════════════
// SettingsTab.jsx  —  إعدادات المنصة
// أي تغيير يُطبق فوراً على جميع الصفحات
// ════════════════════════════════════════════════════════════
const SettingsTab = ({ settings, setSettings }) => {
  const [pass, setPass] = useState(settings.adminPass || '1234');
  const [wa,   setWa]   = useState(settings.whatsapp  || '');
  const [ig,   setIg]   = useState(settings.instagram || '');
  const [saved, setSaved] = useState(false);
 
  const save = () => {
    setSettings({ adminPass: pass, whatsapp: wa, instagram: ig });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
 
  const S = {
    inp: { width: '100%', padding: '13px 14px', borderRadius: 12, border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: 14, fontWeight: 700, outline: 'none', fontFamily: 'inherit', marginBottom: 14 },
  };
 
  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>🛡️</div>
        <div style={{ fontSize: 20, fontWeight: 900 }}>إعدادات المنصة المركزية</div>
        <div style={{ fontSize: 11, color: '#7c5fb5', marginTop: 4, fontWeight: 700 }}>أي تغيير يُطبق فوراً على جميع المستخدمين</div>
      </div>
 
      <div style={{ background: '#1f1050', borderRadius: 20, padding: '1.4rem', border: '1px solid rgba(124,58,237,0.2)' }}>
 
        {/* رمز الإدارة */}
        <div style={{ fontSize: 11, color: '#00e5ff', fontWeight: 700, marginBottom: 6 }}>🔑 رمز لوحة الإدارة</div>
        <input style={{ ...S.inp, textAlign: 'center', fontSize: 20, fontWeight: 900, letterSpacing: 8, color: '#00e5ff' }} value={pass} onChange={e => setPass(e.target.value)} />
 
        {/* واتساب وإنستغرام */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#00C853', fontWeight: 700, marginBottom: 6 }}>📞 واتساب الدعم الفني</div>
            <input style={{ ...S.inp, direction: 'ltr', textAlign: 'left', fontSize: 12 }} placeholder="9647XXXXXXXX" value={wa} onChange={e => setWa(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#e879f9', fontWeight: 700, marginBottom: 6 }}>📸 حساب الإنستغرام</div>
            <input style={{ ...S.inp, direction: 'ltr', textAlign: 'left', fontSize: 12 }} placeholder="@rahhal_app" value={ig} onChange={e => setIg(e.target.value)} />
          </div>
        </div>
 
        <button onClick={save} style={{ width: '100%', padding: '13px', borderRadius: 12, background: saved ? '#059669' : 'linear-gradient(135deg,#00bcd4,#0097a7)', color: '#fff', fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.3s' }}>
          <Save size={17} /> {saved ? '✓ تم الحفظ والتطبيق!' : 'حفظ الإعدادات السحابية'}
        </button>
      </div>
 
      <div style={{ background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 12, padding: '10px 14px', marginTop: 12, fontSize: 11, color: '#fb923c', fontWeight: 700 }}>
        🔔 تغيير رقم الواتساب أو الإنستغرام سيظهر فوراً في واجهة الطلاب والسائقين وصفحات التسجيل.
      </div>
    </div>
  );
};
 
export default SettingsTab;