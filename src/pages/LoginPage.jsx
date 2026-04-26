import { useState } from 'react'
import { signIn, signUp } from '../lib/supabase'

const s = {
  page: {
    minHeight: '100vh', background: '#080c14', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: 20,
    fontFamily: "'Cairo', sans-serif", direction: 'rtl'
  },
  card: {
    width: '100%', maxWidth: 440,
    background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)',
    border: '1px solid #1e293b', borderRadius: 20, padding: '40px 36px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
  },
  logo: { textAlign: 'center', marginBottom: 36 },
  input: {
    width: '100%', padding: '12px 16px', background: '#080c14',
    border: '1px solid #1e293b', borderRadius: 12, color: '#e2e8f0',
    fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: 'none',
    marginBottom: 14, transition: 'border 0.2s'
  },
  btn: {
    width: '100%', padding: '13px 0', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #d4af37, #b8971f)',
    color: '#080c14', fontFamily: "'Cairo', sans-serif",
    fontSize: 16, fontWeight: 800, cursor: 'pointer', marginTop: 8,
    transition: 'opacity 0.2s'
  },
  label: { fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 600 },
  toggle: {
    textAlign: 'center', marginTop: 24, fontSize: 13, color: '#64748b'
  },
  link: { color: '#d4af37', cursor: 'pointer', fontWeight: 700, marginRight: 4 },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', color: '#ef4444', fontSize: 13, marginBottom: 14 },
  success: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '10px 14px', color: '#22c55e', fontSize: 13, marginBottom: 14 },
}

export default function LoginPage() {
  const [mode, setMode] = useState('login') // login | register
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setError(''); setSuccess('')
    if (!form.email || !form.password) return setError('يرجى تعبئة جميع الحقول')
    if (mode === 'register' && !form.name) return setError('يرجى إدخال اسمك')
    if (form.password.length < 6) return setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')

    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(form.email, form.password)
        if (error) return setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      } else {
        const { error } = await signUp(form.email, form.password, form.name)
        if (error) return setError(error.message)
        setSuccess('✅ تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>
          <div style={{ fontSize: 11, color: '#d4af37', letterSpacing: 3, fontWeight: 700, marginBottom: 6 }}>ELITE CLUB ACADEMY</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>Smart Trading Journal</div>
          <div style={{ fontSize: 12, color: '#475569' }}>سجّل صفقاتك. طوّر أداءك.</div>
          <div style={{ margin: '20px auto 0', width: 48, height: 2, background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
        </div>

        <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 20, textAlign: 'center' }}>
          {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}
        {success && <div style={s.success}>{success}</div>}

        {mode === 'register' && (
          <div>
            <label style={s.label}>الاسم الكامل</label>
            <input style={s.input} placeholder="مثال: حسن الجادي" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
        )}

        <div>
          <label style={s.label}>البريد الإلكتروني</label>
          <input style={s.input} type="email" placeholder="example@email.com" value={form.email} onChange={e => set('email', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <div>
          <label style={s.label}>كلمة المرور</label>
          <input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ جاري التحميل...' : mode === 'login' ? '🔐 دخول' : '🚀 إنشاء الحساب'}
        </button>

        <div style={s.toggle}>
          {mode === 'login' ? (
            <>ما عندك حساب؟<span style={s.link} onClick={() => { setMode('register'); setError(''); setSuccess('') }}>سجّل الآن</span></>
          ) : (
            <>عندك حساب؟<span style={s.link} onClick={() => { setMode('login'); setError(''); setSuccess('') }}>سجّل الدخول</span></>
          )}
        </div>
      </div>
    </div>
  )
}
