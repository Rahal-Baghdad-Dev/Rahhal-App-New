// ════════════════════════════════════════════════════════════
// firebase.js  —  قاعدة البيانات المشتركة + الخوارزميات
// يُستورد من جميع الملفات
// ════════════════════════════════════════════════════════════
 
// ── ثوابت ────────────────────────────────────────────────────
export const DEFAULT_REGIONS = [
  'المنصور','اليرموك','حي الجامعة','الدورة','الكرادة',
  'الأعظمية','الكاظمية','زيونة','الشعب','البياع',
  'العامرية','الغدير','الزعفرانية','الجادرية','الجهاد',
];
 
export const DEFAULT_COLLEGES = [
  'جامعة بغداد','المستنصرية','التكنولوجية','جامعة دجلة',
  'كلية التراث الأهلية','جامعة النهرين','كلية الرشيد',
  'الجامعة الأهلية','كلية الكنوز','جامعة الرافدين',
  'كلية الإسراء','جامعة ابن رشد','جامعة الحكمة',
];
 
// ── خوارزمية التقييم (معدل الوسط) ───────────────────────────
// Rating = Σ(stars) / count  →  مقرّب لخانة عشرية واحدة
export const calcRating = (reviews = []) => {
  if (!reviews || !reviews.length) return null;
  const sum = reviews.reduce((acc, r) => acc + (r.stars || 0), 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};
 
export const ratingStars = (r) => {
  if (r === null || r === undefined) return '—';
  const full = Math.round(r);
  return '★'.repeat(full) + '☆'.repeat(5 - full) + `  ${r}`;
};
 
export const ratingColor = (r) => {
  if (r === null || r === undefined) return '#7c5fb5';
  if (r >= 4)  return '#00C853';
  if (r >= 3)  return '#facc15';
  return '#ff6b6b';
};
 
// ── localStorage helpers ──────────────────────────────────────
const KEYS = {
  drivers:  'rahhal_drivers',
  students: 'rahhal_students',
  pending:  'rahhal_pending',
  regions:  'rahhal_regions',
  colleges: 'rahhal_colleges',
  settings: 'rahhal_settings',
};
 
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
 
const persist = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};
 
// ── بيانات افتراضية ───────────────────────────────────────────
const defaultDrivers = [
  {
    id: 1, fullName: 'أحمد الكريمي', phone: '07801234567',
    isApproved: true, banned: false, warned: false,
    resSearch: 'المنصور', college: 'جامعة بغداد',
    seats: 4, bookedBy: [],
    price: '100,000', ac: true,
    carType: 'كيا سبورتاج', plateNumber: 'ب٢٣٤٥',
    lineType: 'مختلط', routes: ['حي الجامعة', 'اليرموك'],
    reviews: [],
    personalPhoto: null, licensePhoto: null, sanawiaPhoto: null,
  },
  {
    id: 2, fullName: 'سمر النجار', phone: '07901112233',
    isApproved: true, banned: false, warned: false,
    resSearch: 'الكرادة', college: 'المستنصرية',
    seats: 3, bookedBy: [],
    price: '70,000', ac: true,
    carType: 'تويوتا كورولا', plateNumber: 'أ١١٢٢',
    lineType: 'طالبات إناث', routes: ['زيونة'],
    reviews: [],
    personalPhoto: null, licensePhoto: null, sanawiaPhoto: null,
  },
];
 
const defaultStudents = [
  {
    id: 1, fullName: 'سارة الطالبة', phone: '07701234567',
    gender: 'أنثى', lineStart: 'الكرادة', college: 'المستنصرية',
    bookedDriverId: null, banned: false,
  },
];
 
const defaultSettings = {
  adminPass: '1234',
  whatsapp:  '9647800000000',
  instagram: '@rahhal_app',
};
 
// ── Getters ──────────────────────────────────────────────────
export const getDrivers  = () => load(KEYS.drivers,  defaultDrivers);
export const getStudents = () => load(KEYS.students, defaultStudents);
export const getPending  = () => load(KEYS.pending,  []);
export const getRegions  = () => load(KEYS.regions,  DEFAULT_REGIONS);
export const getColleges = () => load(KEYS.colleges, DEFAULT_COLLEGES);
export const getSettings = () => load(KEYS.settings, defaultSettings);
 
// ── Setters (مع حفظ تلقائي) ──────────────────────────────────
export const saveDrivers  = (v) => persist(KEYS.drivers,  v);
export const saveStudents = (v) => persist(KEYS.students, v);
export const savePending  = (v) => persist(KEYS.pending,  v);
export const saveRegions  = (v) => persist(KEYS.regions,  v);
export const saveColleges = (v) => persist(KEYS.colleges, v);
export const saveSettings = (v) => persist(KEYS.settings, v);