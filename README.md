# 🏆 EliteClub Smart Trading Journal

تطبيق سجل صفقات احترافي لفريق EliteClub Academy
مبني بـ React + Vite + Supabase — مجاني 100%

---

## ✅ المميزات

- تسجيل دخول حقيقي لكل مستخدم
- كل مستخدم يشوف صفقاته بس (RLS)
- حفظ دائم في قاعدة بيانات سحابية
- Dashboard + سجل صفقات + تحليلات + محلل أخطاء + تقرير أسبوعي
- واجهة عربية RTL كاملة
- مجاني للنشر والاستخدام

---

## 🚀 طريقة التثبيت والنشر (خطوة بخطوة)

### الخطوة 1 — إنشاء حساب Supabase

1. روح على https://supabase.com
2. اضغط "Start your project" — سجّل مجاناً
3. اضغط "New project"
4. سمّيه: `eliteclub-journal`
5. اختار كلمة سر قوية واحفظها
6. اختار المنطقة: Europe (West) EU West 1
7. انتظر 2 دقيقة يجهز المشروع

### الخطوة 2 — إنشاء قاعدة البيانات

1. في Supabase، اضغط على "SQL Editor" من القائمة الجانبية
2. اضغط "New query"
3. افتح ملف `supabase_schema.sql` من مجلد المشروع
4. انسخ كل المحتوى والصقه في SQL Editor
5. اضغط "Run" (أو Ctrl+Enter)
6. يجب تشوف رسالة "Success"

### الخطوة 3 — الحصول على مفاتيح Supabase

1. في Supabase، اضغط "Settings" (أسفل القائمة)
2. اضغط "API"
3. انسخ هذين:
   - **Project URL**: مثال `https://xxxx.supabase.co`
   - **anon public key**: سلسلة طويلة تبدأ بـ `eyJ...`

### الخطوة 4 — تهيئة المشروع محلياً

افتح Terminal أو Command Prompt:

```bash
# 1. تثبيت Node.js إذا ما عندك — من https://nodejs.org اختار LTS

# 2. روح لمجلد المشروع
cd eliteclub-journal

# 3. ثبّت المكتبات
npm install

# 4. أنشئ ملف البيئة
cp .env.example .env
```

افتح ملف `.env` وعدّله:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

```bash
# 5. شغّل محلياً للاختبار
npm run dev
# افتح http://localhost:5173
```

### الخطوة 5 — النشر على Vercel (مجاني للفريق)

#### أ. رفع الكود على GitHub:
1. روح https://github.com → حساب مجاني
2. اضغط "New repository" → سمّيه `eliteclub-journal`
3. اتبع التعليمات لرفع الكود:
```bash
git init
git add .
git commit -m "EliteClub Trading Journal"
git branch -M main
git remote add origin https://github.com/USERNAME/eliteclub-journal.git
git push -u origin main
```

#### ب. النشر على Vercel:
1. روح https://vercel.com → سجّل مجاناً بحساب GitHub
2. اضغط "New Project"
3. اختار repository: `eliteclub-journal`
4. اضغط "Environment Variables" وأضف:
   - `VITE_SUPABASE_URL` = رابط Supabase
   - `VITE_SUPABASE_ANON_KEY` = المفتاح
5. اضغط "Deploy"
6. انتظر دقيقتين ← يعطيك رابط مثل `eliteclub-journal.vercel.app`

### الخطوة 6 — تفعيل البريد الإلكتروني (اختياري)

في Supabase → Authentication → Email Templates
يمكنك تخصيص رسائل التأكيد.

لتعطيل التأكيد (أسهل للبداية):
Authentication → Settings → Email Confirmations → OFF

---

## 👥 كيف يستخدمه الفريق

1. أرسل الرابط للفريق مثل: `https://eliteclub-journal.vercel.app`
2. كل شخص يضغط "سجّل الآن" ويدخل اسمه وبريده وكلمة سر
3. كل شخص يدخل ويشوف صفقاته الخاصة بس
4. لا يوجد تداخل بين البيانات

---

## 🛠️ هيكل الملفات

```
eliteclub-journal/
├── src/
│   ├── lib/
│   │   └── supabase.js      ← اتصال قاعدة البيانات
│   ├── hooks/
│   │   └── useAuth.jsx      ← إدارة تسجيل الدخول
│   ├── components/
│   │   └── Layout.jsx       ← القائمة الجانبية والتخطيط
│   ├── pages/
│   │   ├── LoginPage.jsx    ← صفحة تسجيل الدخول
│   │   ├── Dashboard.jsx    ← لوحة الأداء
│   │   ├── TradeJournal.jsx ← سجل الصفقات
│   │   ├── AddTrade.jsx     ← إضافة صفقة
│   │   ├── Analytics.jsx    ← التحليلات + الأخطاء + التقرير
│   │   ├── MistakeAnalyzer.jsx
│   │   └── WeeklyReport.jsx
│   ├── App.jsx              ← التطبيق الرئيسي
│   └── main.jsx             ← نقطة البداية
├── supabase_schema.sql      ← قاعدة البيانات (انسخه في SQL Editor)
├── .env.example             ← مثال متغيرات البيئة
├── index.html
├── vite.config.js
└── package.json
```

---

## 🆓 التكاليف

| الخدمة | الخطة | السعر |
|--------|-------|-------|
| Supabase | Free tier | $0 — حتى 50,000 مستخدم |
| Vercel | Hobby | $0 — مشاريع غير تجارية |
| GitHub | Free | $0 |

**الإجمالي: $0/شهر** ✅

---

## 📞 الدعم

إنستغرام: @hasanaljadi_
البريد: info@hasanaljadi.com
