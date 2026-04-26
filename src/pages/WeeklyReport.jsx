import { useState } from 'react'

export default function WeeklyReport({ trades, user }) {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [coachFeedback, setCoachFeedback] = useState('أداء جيد هذا الأسبوع، يجب التركيز على تقليل الصفقات في جلسة آسيا.')
  const [improvementPlan, setImprovementPlan] = useState('١. تجنب التداول خلال الأخبار\n٢. الانتظار للتأكيد قبل الدخول\n٣. التداول فقط في جلسة لندن ونيويورك')
  const [copied, setCopied] = useState(false)

  const filtered = trades.filter(t => t.date >= dateRange.start && t.date <= dateRange.end)
  const wins = filtered.filter(t => t.result === 'Win').length
  const losses = filtered.filter(t => t.result === 'Loss').length
  const total = filtered.length
  const winRate = total ? ((wins / total) * 100).toFixed(1) : 0
  const netPips = filtered.reduce((a, t) => a + (Number(t.pips) || 0), 0)
  const netPL = filtered.reduce((a, t) => a + (Number(t.profit_loss) || 0), 0)

  const assetPL = {}
  const stratWins = {}
  const mistakesCount = {}
  filtered.forEach(t => {
    if (!assetPL[t.asset]) assetPL[t.asset] = 0
    assetPL[t.asset] += Number(t.profit_loss) || 0
    if (!stratWins[t.strategy_setup]) stratWins[t.strategy_setup] = { wins: 0, total: 0 }
    stratWins[t.strategy_setup].total++
    if (t.result === 'Win') stratWins[t.strategy_setup].wins++
    if (t.mistake_made) mistakesCount[t.mistake_made] = (mistakesCount[t.mistake_made] || 0) + 1
  })

  const bestAsset = Object.entries(assetPL).sort((a, b) => b[1] - a[1])[0]
  const worstAsset = Object.entries(assetPL).sort((a, b) => a[1] - b[1])[0]
  const bestSetup = Object.entries(stratWins).sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))[0]
  const topMistake = Object.entries(mistakesCount).sort((a, b) => b[1] - a[1])[0]
  const traderName = user?.user_metadata?.full_name || 'المتداول'

  const reportText = `📊 تقرير أداء التداول الأسبوعي — EliteClub Academy

👤 المتداول: ${traderName}
📅 الفترة: ${dateRange.start} إلى ${dateRange.end}

✅ عدد الصفقات: ${total}
🏆 الصفقات الرابحة: ${wins}
❌ الصفقات الخاسرة: ${losses}
⚖️ نسبة النجاح: ${winRate}%

📈 صافي النقاط: ${netPips >= 0 ? '+' : ''}${netPips}
💰 صافي الربح/الخسارة: ${netPL >= 0 ? '+' : ''}$${netPL.toFixed(0)}

🔥 أفضل أصل تداول: ${bestAsset?.[0] || '—'} ($${bestAsset?.[1]?.toFixed(0) || 0})
⚠️ أضعف أصل تداول: ${worstAsset?.[0] || '—'} ($${worstAsset?.[1]?.toFixed(0) || 0})
🎯 أفضل Setup: ${bestSetup?.[0] || '—'}

🧠 أكثر خطأ متكرر:
${topMistake ? `${topMistake[0]} (${topMistake[1]} مرة)` : 'لا يوجد أخطاء مسجلة ✅'}

📌 ملاحظات المدرب:
${coachFeedback}

🚀 خطة التحسين للأسبوع القادم:
${improvementPlan}

—————————————
EliteClub Academy 🏆
@hasanaljadi_`

  const copyReport = () => {
    navigator.clipboard.writeText(reportText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500) })
  }

  const card = { background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }
  const input = { width: '100%', padding: '10px 14px', background: '#0d1421', border: '1px solid #1e293b', borderRadius: 10, color: '#e2e8f0', fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', margin: '0 0 4px' }}>التقرير الأسبوعي 📋</h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>تقرير جاهز للنسخ على تيليغرام وواتساب</p>
        </div>
        <button onClick={copyReport} style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #d4af37, #b8971f)', color: '#080c14', fontFamily: "'Cairo', sans-serif", fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
          {copied ? '✅ تم النسخ!' : '📋 نسخ التقرير'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div><label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 600 }}>من</label><input type="date" style={input} value={dateRange.start} onChange={e => setDateRange(r => ({ ...r, start: e.target.value }))} /></div>
        <div><label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 600 }}>إلى</label><input type="date" style={input} value={dateRange.end} onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div style={{ ...card, borderColor: 'rgba(212,175,55,0.3)', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#d4af37', fontWeight: 800, marginBottom: 12 }}>📌 ملاحظات المدرب</div>
            <textarea style={{ ...input, minHeight: 100, resize: 'vertical' }} value={coachFeedback} onChange={e => setCoachFeedback(e.target.value)} />
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: '#d4af37', fontWeight: 800, marginBottom: 12 }}>🚀 خطة التحسين</div>
            <textarea style={{ ...input, minHeight: 100, resize: 'vertical' }} value={improvementPlan} onChange={e => setImprovementPlan(e.target.value)} />
          </div>
        </div>
        <div style={{ ...card, borderColor: 'rgba(212,175,55,0.25)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#d4af37', marginBottom: 16, textAlign: 'center' }}>معاينة التقرير</div>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.9, color: '#e2e8f0', direction: 'rtl', fontFamily: "'Cairo', sans-serif" }}>{reportText}</pre>
        </div>
      </div>
    </div>
  )
}
