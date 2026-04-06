import React, { useState } from 'react';
import { LayoutDashboard, Car, Users, Clock, Ban, MapPin, Settings, LogOut } from 'lucide-react';
import { calcRating, ratingStars, ratingColor } from './firebase';
import DriversTab  from './DriversTab';
import PendingTab  from './PendingTab';
import BannedTab   from './BannedTab';
import PlacesTab   from './PlacesTab';
import SettingsTab from './SettingsTab';
 
// ════════════════════════════════════════════════════════════
// AdminDashboard.jsx  —  لوحة الإدارة الرئيسية
// يستورد: DriversTab, PendingTab, BannedTab, PlacesTab, SettingsTab
// ════════════════════════════════════════════════════════════
const AdminDashboard = ({
  drivers,  setDrivers,
  students, setStudents,
  pending,  setPending,
  regions,  setRegions,
  colleges, setColleges,
  settings, setSettings,
  onBack,
}) => {
  const [tab, setTab] = useState('home');
 
  const activeDrivers = drivers.filter(d => d.isApproved && !d.banned);
 
  const navItems = [
    { id: 'home',     icon: <LayoutDashboard size={16}/>, label: 'الرئيسية' },
    { id: 'drivers',  icon: <Car size={16}/>,             label: `السائقون (${activeDrivers.length})` },
    { id: 'students', icon: <Users size={16}/>,           label: `الطلاب (${students.filter(s=>!s.banned).length})` },
    { id: 'pending',  icon: <Clock size={16}/>,           label: `الانتظار (${pending.length})` },
    { id: 'banned',   icon: <Ban size={16}/>,             label: `المحظورون (${drivers.filter(d=>d.banned).length + students.filter(s=>s.banned).length})` },
    { id: 'places',   icon: <MapPin size={16}/>,          label: 'المناطق' },
    { id: 'settings', icon: <Settings size={16}/>,        label: 'الإعدادات' },
  ];
 
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} dir="rtl">
 
      {/* ── Sidebar ── */}
      <div style={{ width: 195, background: '#120a2e', borderLeft: '1px solid rgba(124,58,237,0.15)', padding: '1rem 0.8rem', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#00e5ff', fontStyle: 'italic' }}>نور</div>
          <div style={{ fontSize: 9, color: '#7c5fb5', fontWeight: 700, marginTop: 2 }}>نظام الإدارة المركزية</div>
        </div>
 
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 11, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, background: tab === item.id ? 'linear-gradient(135deg,#00bcd4,#0097a7)' : 'transparent', color: tab === item.id ? '#fff' : '#7c5fb5', transition: 'all 0.2s', textAlign: 'right' }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
 
        <button onClick={onBack} style={{ padding: '10px', borderRadius: 12, background: 'rgba(255,80,80,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,80,80,0.2)', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 'auto' }}>
          <LogOut size={14} /> خروج للنظام
        </button>
      </div>
 
      {/* ── Main Content ── */}
      <div style={{ flex: 1, background: '#180e38', padding: '1.5rem', overflowY: 'auto', maxHeight: '100vh' }}>
 
        {/* ══ الرئيسية ══ */}
        {tab === 'home' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'سائق نشط',        val: activeDrivers.length,                  color: '#00C853' },
                { label: 'بانتظار الموافقة', val: pending.length,                       color: '#fb923c' },
                { label: 'طالب مسجل',        val: students.filter(s=>!s.banned).length, color: '#22d3ee' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: '#1f1050', borderRadius: 16, padding: '1.1rem', textAlign: 'center', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <div style={{ fontSize: 10, color: '#7c5fb5', fontWeight: 700, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#22d3ee', marginBottom: 12 }}>🚗 أفضل السائقين تقييماً</div>
            {activeDrivers.sort((a,b)=>(calcRating(b.reviews)||0)-(calcRating(a.reviews)||0)).slice(0,3).map(d => {
              const r = calcRating(d.reviews);
              return (
                <div key={d.id} onClick={() => setTab('drivers')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1f1050', borderRadius: 14, padding: '10px 14px', marginBottom: 8, cursor: 'pointer', border: '1px solid rgba(124,58,237,0.15)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>{d.fullName.charAt(0)}</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 800 }}>{d.fullName}</div><div style={{ fontSize: 11, color: '#7c5fb5' }}>{d.resSearch} ← {d.college}</div></div>
                  <div style={{ color: ratingColor(r), fontSize: 12, fontWeight: 800 }}>{ratingStars(r)}</div>
                </div>
              );
            })}
          </div>
        )}
 
        {/* ══ السائقون ══ */}
        {tab === 'drivers' && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#22d3ee', marginBottom: 14 }}>🚗 السائقون النشطون</div>
            <DriversTab drivers={drivers} setDrivers={setDrivers} />
          </div>
        )}
 
        {/* ══ الطلاب ══ */}
        {tab === 'students' && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#22d3ee', marginBottom: 12 }}>🎓 الطلاب المسجلون</div>
            <div style={{ background: '#1f1050', borderRadius: 18, border: '1px solid rgba(124,58,237,0.15)', overflow: 'hidden' }}>
              {students.filter(s=>!s.banned).length === 0
                ? <div style={{ textAlign: 'center', padding: '2rem', color: '#7c5fb5', fontSize: 13, fontWeight: 700 }}>لا يوجد طلاب</div>
                : students.filter(s=>!s.banned).map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{s.fullName.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>{s.fullName}</div>
                      <div style={{ fontSize: 11, color: '#7c5fb5' }}>{s.phone} • {s.lineStart} ← {s.college}</div>
                    </div>
                    <button onClick={() => { if(window.confirm(`حظر ${s.fullName}؟`)) setStudents(students.map(x=>x.id===s.id?{...x,banned:true}:x)); }} style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(255,80,80,0.12)', color: '#ff6b6b', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>حظر</button>
                  </div>
                ))
              }
            </div>
          </div>
        )}
 
        {/* ══ الانتظار ══ */}
        {tab === 'pending' && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fb923c', marginBottom: 14 }}>⏳ طلبات الانتظار</div>
            <PendingTab pending={pending} setPending={setPending} drivers={drivers} setDrivers={setDrivers} />
          </div>
        )}
 
        {/* ══ المحظورون ══ */}
        {tab === 'banned' && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#ff6b6b', marginBottom: 14 }}>🚫 القائمة السوداء</div>
            <BannedTab drivers={drivers} setDrivers={setDrivers} students={students} setStudents={setStudents} />
          </div>
        )}
 
        {/* ══ المناطق ══ */}
        {tab === 'places' && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#facc15', marginBottom: 14 }}>📍 إدارة النطاق الجغرافي</div>
            <PlacesTab regions={regions} setRegions={setRegions} colleges={colleges} setColleges={setColleges} />
          </div>
        )}
 
        {/* ══ الإعدادات ══ */}
        {tab === 'settings' && (
          <SettingsTab settings={settings} setSettings={setSettings} />
        )}
      </div>
    </div>
  );
};
 
export default AdminDashboard;