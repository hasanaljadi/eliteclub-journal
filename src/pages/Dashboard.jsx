const s = {
  card: { background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)', border: '1px solid #1e293b', borderRadius: 16, padding: 24 },
  statCard: (color) => ({ background: `linear-gradient(135deg, rgba(${color},0.12) 0%, rgba(${color},0.04) 100%)`, border: `1px solid rgba(${color},0.25)`, borderRadius: 16, padding: '20px 22px' }),
  h1: { fontSize: 26, fontWeight: 900, color: '#f1f5f9', margin: '0 0 4px' },
  sub: { fontSize: 13, color: '#64748b' },
  h2: { fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: '0 0 16px' },
}

function MiniBar({ data, height = 60 }) {
  const max = Math.max(...data.map(Math.abs), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
          <div style={{ width: '100%', borderRadius: 3, height: `${(Math.abs(v) / max) * 85}%`, background: v >= 0 ? '#22c55e' : '#ef4444', opacity: 0.85 }} />
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ trades, tradesLoading, user }) {
  if (tradesLoading) return <div style={{ color: '#64748b', textAlign: 'center', paddingTop: 80 }}>⏳ جاري تحميل البيانات...</div>

  const wins = trades.filter(t => t.result === 'Win').length
  const losses = trades.filter(t => t.result === 'Loss').length
  const bes = trades.filter(t => t.result === 'BE').length
  const total = trades.length
  const winRate = total ? ((wins / total) * 100).toFixed(1) : 0
  const netPips = trades.reduce((a, t) => a + (Number(t.pips) || 0), 0)
  const netPL = trades.reduce((a, t) => a + (Number(t.profit_loss) || 0), 0)

  const assetStats = {}
  trades.forEach(t => {
    if (!assetStats[t.asset]) assetStats[t.asset] = { pl: 0 }
    assetStats[t.asset].pl += Number(t.profit_loss) || 0
  })
  const sortedAssets = Object.entries(assetStats).sort((a, b) => b[1].pl - a[1].pl)
  const bestAsset = sortedAssets[0]
  const worstAsset = sortedAssets[sortedAssets.length - 1]

  const stratWins = {}
  trades.forEach(t => {
    if (!stratWins[t.strategy_setup]) stratWins[t.strategy_setup] = { wins: 0, total: 0 }
    stratWins[t.strategy_setup].total++
    if (t.result === 'Win') stratWins[t.strategy_setup].wins++
  })
  const bestSetup = Object.entries(stratWins).sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))[0]

  const recentPL = trades.slice(0, 10).reverse().map(t => Number(t.profit_loss) || 0)

  const insights = []
  if (bestAsset && bestAsset[1].pl > 0) insights.push(`🔥 أفضل أدائك على ${bestAsset[0]} بصافي $${bestAsset[1].pl.toFixed(0)}`)
  const mistakeTrades = trades.filter(t => t.mistake_made)
  if (mistakeTrades.length > 0) {
    const mc = {}
    mistakeTrades.forEach(t => { mc[t.mistake_made] = (mc[t.mistake_made] || 0) + 1 })
    const top = Object.entries(mc).sort((a, b) => b[1] - a[1])[0]
    insights.push(`⚠️ أكثر خطأ متكرر: "${top[0]}"`)
  }
  if (bestSetup) insights.push(`🎯 أعلى نجاح على Setup: ${bestSetup[0]} (${((bestSetup[1].wins / bestSetup[1].total) * 100).toFixed(0)}%)`)
  const asiaTrades = trades.filter(t => t.session === 'Asia')
  if (asiaTrades.length >= 3 && asiaTrades.filter(t => t.result === 'Win').length / asiaTrades.length < 0.4) {
    insights.push('📊 يُنصح بتقليل التداول خلال جلسة آسيا بسبب ضعف النتائج')
  }

  const userName = user?.user_metadata?.full_name || 'المتداول'

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={s.h1}>لوحة أداء التداول 📊</h1>
        <p style={s.sub}>أهلاً {userName} — نظرة شاملة على أدائك</p>
      </div>

      {total === 0 ? (
        <div style={{ ...s.card, textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>لا توجد صفقات بعد</div>
          <div style={{ color: '#64748b', marginBottom: 20 }}>ابدأ بتسجيل أول صفقة لك</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'إجمالي الصفقات', value: total, color: '212,175,55', icon: '📈' },
              { label: 'نسبة النجاح', value: `${winRate}%`, color: '34,197,94', icon: '🏆' },
              { label: 'صافي النقاط', value: `${netPips > 0 ? '+' : ''}${netPips}`, color: netPips >= 0 ? '34,197,94' : '239,68,68', icon: '📉' },
              { label: 'صافي الربح', value: `$${netPL >= 0 ? '+' : ''}${netPL.toFixed(0)}`, color: netPL >= 0 ? '34,197,94' : '239,68,68', icon: '💰' },
            ].map((s2, i) => (
              <div key={i} style={s.statCard(s2.color)}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s2.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: `rgb(${s2.color})` }}>{s2.value}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s2.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={s.card}>
              <div style={s.h2}>توزيع النتائج</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[{ label: 'ربح', count: wins, color: '#22c55e' }, { label: 'خسارة', count: losses, color: '#ef4444' }, { label: 'تعادل', count: bes, color: '#f59e0b' }].map((r, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 10, background: `${r.color}15`, border: `1px solid ${r.color}30` }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: r.color }}>{r.count}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{r.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 8, borderRadius: 4, background: '#1e293b', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${(wins / total) * 100}%`, background: '#22c55e' }} />
                <div style={{ width: `${(losses / total) * 100}%`, background: '#ef4444' }} />
                <div style={{ width: `${(bes / total) * 100}%`, background: '#f59e0b' }} />
              </div>
            </div>

            <div style={s.card}>
              <div style={s.h2}>آخر 10 صفقات</div>
              {recentPL.length > 1 ? <MiniBar data={recentPL} height={70} /> : <div style={{ color: '#475569', fontSize: 13 }}>تحتاج صفقتين على الأقل</div>}
            </div>

            <div style={s.card}>
              <div style={s.h2}>أفضل وأضعف أصل</div>
              {bestAsset && <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#64748b' }}>🏆 أفضل</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#22c55e' }}>{bestAsset[0]}</div>
                <div style={{ fontSize: 12, color: '#22c55e' }}>+${bestAsset[1].pl.toFixed(0)}</div>
              </div>}
              {worstAsset && worstAsset[0] !== bestAsset?.[0] && <div>
                <div style={{ fontSize: 11, color: '#64748b' }}>⚠️ أضعف</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>{worstAsset[0]}</div>
                <div style={{ fontSize: 12, color: '#ef4444' }}>${worstAsset[1].pl.toFixed(0)}</div>
              </div>}
            </div>
          </div>

          {insights.length > 0 && (
            <div style={{ ...s.card, borderColor: 'rgba(212,175,55,0.3)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#d4af37', marginBottom: 14 }}>🧠 تحليلات ذكية — EliteClub AI</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {insights.map((ins, i) => (
                  <div key={i} style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', fontSize: 13, lineHeight: 1.6 }}>{ins}</div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
