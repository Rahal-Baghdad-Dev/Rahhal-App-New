import React, { useState } from 'react';
 
// ════════════════════════════════════════════════════════════
// RatingModal.jsx  —  مودال التقييم السري
// يُستخدم في: StudentDashboard.jsx
// البيانات تذهب مباشرة → driver.reviews → لوحة الإدارة
// ════════════════════════════════════════════════════════════
const RatingModal = ({ driver, student, onSubmit, onClose }) => {
  const [rating, setRating]   = useState(5);
  const [text,   setText]     = useState('');
 
  const send = () => {
    if (!text.trim()) { alert('اكتب ملاحظتك أولاً'); return; }
    onSubmit({
      stars:        rating,
      text:         text.trim(),
      by:           student.fullName,
      studentPhone: student.phone,
      date:         new Date().toLocaleDateString('ar-EG'),
    });
    setText('');
    onClose();
    alert('📨 تم إرسال تقييمك السري للإدارة!');
  };
 
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#1a1035', borderRadius: '24px 24px 0 0', padding: '1.3rem', width: '100%', maxWidth: 430, maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(124,58,237,0.3)' }}>
 
        {/* رأس */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#22d3ee' }}>💬 تقييم سري — {driver?.fullName}</div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>×</button>
        </div>
 
        <div style={{ fontSize: 10, color: '#7c5fb5', fontWeight: 700, marginBottom: 14, background: 'rgba(124,58,237,0.08)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(124,58,237,0.15)' }}>
          🔒 تقييمك سري تماماً — يصل للإدارة فقط ولا يراه السائق أبداً
        </div>
 
        {/* التقييمات السابقة لهذا الطالب */}
        {driver?.reviews?.filter(r => r.studentPhone === student.phone).length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#7c5fb5', fontWeight: 700, marginBottom: 6 }}>تقييماتك السابقة:</div>
            <div style={{ maxHeight: 90, overflowY: 'auto' }}>
              {driver.reviews.filter(r => r.studentPhone === student.phone).map((rev, i) => (
                <div key={i} style={{ background: 'rgba(8,145,178,0.12)', borderRadius: 12, padding: '7px 10px', marginBottom: 5 }}>
                  <div style={{ color: '#facc15', fontSize: 11, marginBottom: 2 }}>{'★'.repeat(rev.stars)}</div>
                  <div style={{ fontSize: 12, color: '#e2e8f0' }}>{rev.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* النجوم */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <span
              key={n}
              onClick={() => setRating(n)}
              style={{ fontSize: 28, cursor: 'pointer', filter: n <= rating ? 'none' : 'grayscale(1)', transition: 'all 0.1s', transform: n <= rating ? 'scale(1.1)' : 'scale(1)' }}
            >⭐</span>
          ))}
        </div>
 
        {/* النص */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          placeholder="اكتب ملاحظتك السرية للإدارة..."
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 13, fontWeight: 700, outline: 'none', fontFamily: 'inherit', resize: 'none', marginBottom: 10 }}
        />
 
        <button
          onClick={send}
          style={{ width: '100%', padding: 12, borderRadius: 12, background: '#7c3aed', color: '#fff', fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          📨 إرسال للإدارة
        </button>
      </div>
    </div>
  );
};
 
export default RatingModal;