import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Eye, EyeOff, Car, GraduationCap, ShieldCheck, Phone } from 'lucide-react';

import AdminDashboard      from './AdminDashboard';
import DriverProfile       from './DriverProfile';
import StudentDashboard    from './StudentDashboard';
import DriverRegistration  from './DriverRegistration';
import StudentRegistration from './StudentRegistration';

import {
  getDrivers,  saveDrivers,
  getStudents, saveStudents,
  getPending,  savePending,
  getRegions,  saveRegions,
  getColleges, saveColleges,
  getSettings, saveSettings,
} from './firebase';

const App = () => {
  const [view, setView]               = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  const [drivers,  _setDrivers]  = useState(getDrivers);
  const [students, _setStudents] = useState(getStudents);
  const [pending,  _setPending]  = useState(getPending);
  const [regions,  _setRegions]  = useState(getRegions);
  const [colleges, _setColleges] = useState(getColleges);
  const [settings, _setSettings] = useState(getSettings);

  const setDrivers  = v => { _setDrivers(v);  saveDrivers(v);  };
  const setStudents = v => { _setStudents(v); saveStudents(v); };
  const setPending  = v => { _setPending(v);  savePending(v);  };
  const setRegions  = v => { _setRegions(v);  saveRegions(v);  };
  const setColleges = v => { _setColleges(v); saveColleges(v); };
  const setSettings = v => { _setSettings(v); saveSettings(v); };

  const [phone,      setPhone]      = useState('');
  const [adminPass,  setAdminPass]  = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [showAdmin,  setShowAdmin]  = useState(false);
  const [passErr,    setPassErr]    = useState(false);

  const handleLogin = () => {
    if (!phone.trim()) return;
    const driver = drivers.find(d => d.phone === phone && d.isApproved && !d.banned);
    if (driver) { setCurrentUser({ type: 'driver', data: driver }); setView('driver'); return; }
    const pend = pending.find(d => d.phone === phone);
    if (pend) { alert('⏳ طلبك قيد المراجعة من الإدارة'); return; }
    const student = students.find(s => s.phone === phone && !s.banned);
    if (student) { setCurrentUser({ type: 'student', data: student }); setView('student'); return; }
    alert('الرقم غير مسجل. يرجى التسجيل أدناه.');
  };

  const handleAdminLogin = () => {
    if (adminPass === settings.adminPass) {
      setPassErr(false); setAdminPass(''); setShowAdmin(false); setView('admin');
    } else {
      setPassErr(true);
      setTimeout(() => setPassErr(false), 2000);
    }
  };

  const logout = () => { setCurrentUser(null); setView('landing'); setPhone(''); };

  const approveDriver = (driver) => {
    const approved = { ...driver, isApproved: true, banned: false, warned: false, reviews: [], bookedBy: [] };
    setDrivers([...drivers, approved]);
    setPending(pending.filter(d => d.id !== driver.id));
  };

  const updateDriver = (updated) => {
    setDrivers(drivers.map(d => d.id === updated.id ? updated : d));
    if (currentUser?.type === 'driver') setCurrentUser({ type: 'driver', data: updated });
  };

  const updateStudent = (updated) => {
    setStudents(students.map(s => s.id === updated.id ? updated : s));
    if (currentUser?.type === 'student') setCurrentUser({ type: 'student', data: updated });
  };

  const submitReview = (driverId, review) => {
    setDrivers(drivers.map(d =>
      d.id === driverId ? { ...d, reviews: [...d.reviews, review] } : d
    ));
  };

  const toggleBook = (driverId, studentPhone) => {
    setDrivers(drivers.map(d => {
      if (d.id !== driverId) return d;
      const booked = d.bookedBy.includes(studentPhone);
      return { ...d, bookedBy: booked ? d.bookedBy.filter(p => p !== studentPhone) : [...d.bookedBy, studentPhone] };
    }));
  };

  const onDriverSubmit = (formData) => {
    const newDriver = { ...formData, id: Date.now(), isApproved: false, banned: false, warned: false, reviews: [], bookedBy: [] };
    setPending([...pending, newDriver]);
    setView('landing');
    alert('✅ تم إرسال طلبك! سيتم التفعيل خلال 24 ساعة.');
  };

  const onStudentSubmit = (formData) => {
    if (students.find(s => s.phone === formData.phone)) { alert('⚠️ هذا الرقم مسجل مسبقاً'); return; }
    const newStudent = { ...formData, id: Date.now(), bookedDriverId: null, banned: false };
    setStudents([...students, newStudent]);
    setCurrentUser({ type: 'student', data: newStudent });
    setView('student');
  };

  // ── الصفحة الرئيسية مع تحسينات التناسق للهاتف ──────────────────
  const LandingPage = () => (
    <div style={{ 
      width: '100%', 
      maxWidth: '420px', 
      margin: '0 auto', 
      padding: '1.5rem', 
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ fontSize: 'clamp(32px, 10vw, 42px)', fontWeight: 900, color: '#facc15', letterSpacing: 1 }}>رحّال ✦</div>
        <div style={{ fontSize: '14px', color: '#7c3aed', marginTop: 4, fontWeight: 700 }}>منصة النقل الجامعي الذكي</div>
      </div>

      <div style={{ 
        background: '#1a1035', 
        borderRadius: 24, 
        padding: '1.5rem', 
        border: '1px solid rgba(124,58,237,0.2)',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: 12, color: '#7c5fb5', marginBottom: 12, fontWeight: 700, textAlign: 'right' }}>مسجل سابقاً؟ ادخل رقمك</div>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Phone size={18} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#7c5fb5' }} />
          <input
            style={{ 
              width: '100%', 
              padding: '14px 45px 14px 15px', 
              borderRadius: 14, 
              border: '1px solid rgba(124,58,237,0.3)', 
              background: 'rgba(255,255,255,0.04)', 
              color: '#fff', 
              fontSize: 16, 
              fontWeight: 700, 
              outline: 'none', 
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
            placeholder="07XXXXXXXXX"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <button onClick={handleLogin} style={{ 
          width: '100%', 
          padding: 15, 
          borderRadius: 14, 
          background: '#facc15', 
          color: '#1a0b2e', 
          fontSize: 16, 
          fontWeight: 800, 
          border: 'none', 
          cursor: 'pointer', 
          fontFamily: 'inherit',
          transition: 'transform 0.1s'
        }}>
          دخول للحساب ✦
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button onClick={() => setView('driver_reg')} style={{ background: '#1a1035', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '1.25rem', cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>
          <Car size={32} style={{ color: '#facc15', margin: '0 auto 8px', display: 'block' }} />
          <div style={{ fontSize: 13, fontWeight: 800 }}>سائق جديد</div>
        </button>
        <button onClick={() => setView('student_reg')} style={{ background: '#1a1035', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '1.25rem', cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>
          <GraduationCap size={32} style={{ color: '#a855f7', margin: '0 auto 8px', display: 'block' }} />
          <div style={{ fontSize: 13, fontWeight: 800 }}>طالب جديد</div>
        </button>
      </div>

      {!showAdmin ? (
        <button onClick={() => setShowAdmin(true)} style={{ 
          width: '100%', 
          padding: 12, 
          borderRadius: 12, 
          background: 'transparent', 
          color: '#7c5fb5', 
          border: '1px solid rgba(124,58,237,0.15)', 
          fontSize: 12, 
          fontWeight: 700, 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 6,
          marginTop: '0.5rem'
        }}>
          <ShieldCheck size={14} /> لوحة الإدارة
        </button>
      ) : (
        <div style={{ background: '#1a1035', borderRadius: 18, padding: '1.25rem', border: `1px solid ${passErr ? '#ff4444' : 'rgba(124,58,237,0.2)'}` }}>
          <div style={{ fontSize: 11, color: '#7c5fb5', textAlign: 'center', marginBottom: 10, fontWeight: 700 }}>🔐 رمز الدخول</div>
          <input
            type={showPass ? 'text' : 'password'}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: 12, 
              border: '1px solid rgba(124,58,237,0.25)', 
              background: 'rgba(255,255,255,0.04)', 
              color: '#00e5ff', 
              fontSize: 22, 
              fontWeight: 900, 
              letterSpacing: 6, 
              textAlign: 'center', 
              outline: 'none', 
              boxSizing: 'border-box',
              marginBottom: 10
            }}
            placeholder="••••"
            value={adminPass}
            onChange={e => setAdminPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdminLogin} style={{ flex: 2, padding: 12, borderRadius: 10, background: '#facc15', color: '#1a0b2e', fontWeight: 800, border: 'none' }}>دخول</button>
            <button onClick={() => setShowAdmin(false)} style={{ flex: 1, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 700, border: 'none' }}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      overflowX: 'hidden', 
      fontFamily: 'Tajawal, sans-serif', 
      background: '#0f0a1e', 
      color: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }} dir="rtl">
      {view === 'landing'     && <LandingPage />}
      {view === 'driver_reg'  && <DriverRegistration  regions={regions} colleges={colleges} settings={settings} onBack={() => setView('landing')} onSubmit={onDriverSubmit} />}
      {view === 'student_reg' && <StudentRegistration regions={regions} colleges={colleges} settings={settings} onBack={() => setView('landing')} onSubmit={onStudentSubmit} />}
      
      {/* باقي الصفحات كما هي في الكود الأصلي */}
      {view === 'student'     && currentUser?.type === 'student' && (
        <StudentDashboard
          student={currentUser.data}
          drivers={drivers.filter(d => d.isApproved && !d.banned)}
          regions={regions} colleges={colleges} settings={settings}
          onUpdateStudent={updateStudent}
          onToggleBook={toggleBook}
          onSubmitReview={submitReview}
          onLogout={logout}
        />
      )}
      {view === 'driver' && currentUser?.type === 'driver' && (
        <DriverProfile
          driver={drivers.find(d => d.id === currentUser.data.id) || currentUser.data}
          regions={regions} colleges={colleges} settings={settings}
          onUpdateDriver={updateDriver}
          onLogout={logout}
        />
      )}
      {view === 'admin' && (
        <AdminDashboard
          drivers={drivers}   setDrivers={setDrivers}
          students={students} setStudents={setStudents}
          pending={pending}   setPending={setPending}
          regions={regions}   setRegions={setRegions}
          colleges={colleges} setColleges={setColleges}
          settings={settings} setSettings={setSettings}
          onBack={() => setView('landing')}
        />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
