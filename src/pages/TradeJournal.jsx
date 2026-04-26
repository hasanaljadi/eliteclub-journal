import { useState, useMemo } from 'react'

const RESULT_CONFIG = {
  Win: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'ربح ✅' },
  Loss: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'خسارة ❌' },
  BE: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'تعادل ⚖️' }
}

const s = {
  card: { background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)', border: '1px solid #1e293b', borderRadius: 16, padding: 24 },
  input: { width: '100%', padding: '10px 14px', background: '#0d1421', border: '1px solid #1e293b', borderRadius: 10, color: '#e2e8f0', fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 14px', background: '#0d1421', border: '1px solid #1e293b', borderRadius: 10, color: '#e2e8f0', fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: 'none', cursor: 'pointer' },
  badge: (result) => ({ display: 'inline-block', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: RESULT_CONFIG[result]?.bg || 'rgba(148,163,184,0.15)', color: RESULT_CONFIG[result]?.color || '#94a3b8', border: `1px solid ${RESULT_CONFIG[result]?.color || '#94a3b8'}40` }),
  tag: (c = '#d4af37') => ({ display: 'inline-block', padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${c}20`, color: c, border: `1px solid ${c}40` }),
  btn: (v = 'primary') => ({ padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 12, transition: 'all 0.2s', ...(v === 'ghost' ? { background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' } : { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }) }),
}

export default function TradeJournal({ trades, tradesLoading, onView, onDelete }) {
  const [filter, setFilter] = useState({ result: '', session: '', asset: '' })
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => trades.filter(t => {
    if (filter.result && t.result !== filter.result) return false
    if (filter.session && t.session !== filter.session) return false
    if (filter.asset && t.asset !== filter.asset) return false
    if (search) {
      const q = search.toLowerCase()
      if (!t.asset?.toLowerCase().includes(q) && !t.trader_name?.toLowerCase().includes(q) && !t.strategy_setup?.toLowerCase().includes(q)) return false
    }
    return true
  }), [trades, filter, search])

  if (tradesLoading) return <div style={{ color: '#64748b', textAlign: 'center', paddingTop: 80 }}>⏳ جاري تحميل الصفقات...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', margin: '0 0 4px' }}>سجل الصفقات 📋</h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>{filtered.length} صفقة</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...s.card, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12 }}>
          <input style={s.input} placeholder="🔍 بحث بالأصل أو الاسم أو الاستراتيجية..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={s.select} value={filter.result} onChange={e => setFilter(f => ({ ...f, result: e.target.value }))}>
            <option value="">كل النتائج</option>
            <option value="Win">ربح</option>
            <option value="Loss">خسارة</option>
            <option value="BE">تعادل</option>
          </select>
          <select style={s.select} value={filter.session} onChange={e => setFilter(f => ({ ...f, session: e.target.value }))}>
            <option value="">كل الجلسات</option>
            <option>Asia</option><option>London</option><option>New York</option>
          </select>
          <select style={s.select} value={filter.asset} onChange={e => setFilter(f => ({ ...f, asset: e.target.value }))}>
            <option value="">كل الأصول</option>
            {[...new Set(trades.map(t => t.asset))].map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b', background: '#0a0f1a' }}>
                {['التاريخ', 'الأصل', 'الاتجاه', 'الجلسة', 'التايم فريم', 'الاستراتيجية', 'الدخول', 'الخروج', 'P&L', 'النتيجة', 'الخطأ', 'إجراء'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #0f172a' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0d1421'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{t.date}</td>
                  <td style={{ padding: '12px 16px' }}><span style={s.tag('#d4af37')}>{t.asset}</span></td>
                  <td style={{ padding: '12px 16px' }}><span style={s.tag(t.direction === 'Buy' ? '#22c55e' : '#ef4444')}>{t.direction === 'Buy' ? 'شراء ↑' : 'بيع ↓'}</span></td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{t.session}</td>
                  <td style={{ padding: '12px 16px' }}><span style={s.tag('#818cf8')}>{t.timeframe}</span></td>
                  <td style={{ padding: '12px 16px' }}><span style={s.tag('#0ea5e9')}>{t.strategy_setup}</span></td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{t.entry_price}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{t.exit_price}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: Number(t.profit_loss) >= 0 ? '#22c55e' : '#ef4444' }}>
                    {Number(t.profit_loss) >= 0 ? '+' : ''}${Number(t.profit_loss).toFixed(0)}
                  </td>
                  <td style={{ padding: '12px 16px' }}><span style={s.badge(t.result)}>{RESULT_CONFIG[t.result]?.label}</span></td>
                  <td style={{ padding: '12px 16px', color: t.mistake_made ? '#ef4444' : '#22c55e', fontSize: 11, maxWidth: 130 }}>
                    {t.mistake_made || '✅ لا يوجد'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={s.btn('ghost')} onClick={() => onView(t)}>عرض</button>
                      <button style={s.btn('danger')} onClick={() => onDelete(t.id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div>لا توجد صفقات{search ? ' مطابقة للبحث' : ' بعد'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
