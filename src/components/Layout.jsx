import { signOut } from '../lib/supabase'

const NAV = [
  { id: 'dashboard', label: 'لوحة الأداء', icon: '📊' },
  { id: 'journal', label: 'سجل الصفقات', icon: '📋' },
  { id: 'add', label: 'إضافة صفقة', icon: '➕' },
  { id: 'analytics', label: 'تحليل الأداء', icon: '📈' },
  { id: 'mistakes', label: 'محلل الأخطاء', icon: '🧠' },
  { id: 'report', label: 'التقرير الأسبوعي', icon: '📄' },
]

export default function Layout({ page, setPage, user, tradesCount, children }) {
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'المتداول'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080c14', color: '#e2e8f0', fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      {/* SIDEBAR */}
      <div style={{
        width: 260, background: '#0d1421', borderLeft: '1px solid #1e293b',
        height: '100vh', position: 'fixed', right: 0, top: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: 10, color: '#d4af37', letterSpacing: 2, fontWeight: 700, marginBottom: 3 }}>ELITE CLUB ACADEMY</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#f1f5f9' }}>Smart Trading Journal</div>
        </div>

        {/* User badge */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', background: 'rgba(212,175,55,0.04)' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>مرحباً 👋</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#d4af37' }}>{userName}</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          {NAV.map(item => {
            const active = page === item.id
            return (
              <div key={item.id} onClick={() => setPage(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                borderRadius: 10, marginBottom: 4, cursor: 'pointer', fontSize: 14,
                fontWeight: active ? 700 : 500, transition: 'all 0.2s',
                background: active ? 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.04))' : 'transparent',
                color: active ? '#d4af37' : '#94a3b8',
                border: active ? '1px solid rgba(212,175,55,0.25)' : '1px solid transparent'
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'journal' && tradesCount > 0 && (
                  <span style={{ marginRight: 'auto', fontSize: 10, background: 'rgba(212,175,55,0.2)', color: '#d4af37', padding: '1px 8px', borderRadius: 10 }}>
                    {tradesCount}
                  </span>
                )}
              </div>
            )
          })}
        </nav>

        {/* Bottom: sign out */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>إجمالي صفقاتك</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#d4af37', marginBottom: 14 }}>{tradesCount} صفقة</div>
          <button onClick={() => signOut()} style={{
            width: '100%', padding: '9px 0', borderRadius: 10,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444', fontFamily: "'Cairo', sans-serif", fontSize: 13,
            fontWeight: 700, cursor: 'pointer'
          }}>
            🚪 تسجيل الخروج
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ marginRight: 260, flex: 1, padding: '28px 32px', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  )
}
