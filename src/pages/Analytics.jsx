// ─── Analytics ───────────────────────────────────────────────
export default function Analytics({ trades }) {
  const sessions = {}
  trades.forEach(t => {
    if (!sessions[t.session]) sessions[t.session] = { wins: 0, total: 0 }
    sessions[t.session].total++
    if (t.result === 'Win') sessions[t.session].wins++
  })

  const stratWins = {}
  trades.forEach(t => {
    if (!stratWins[t.strategy_setup]) stratWins[t.strategy_setup] = { wins: 0, total: 0, pips: 0 }
    stratWins[t.strategy_setup].total++
    stratWins[t.strategy_setup].pips += Number(t.pips) || 0
    if (t.result === 'Win') stratWins[t.strategy_setup].wins++
  })

  const assetPL = {}
  trades.forEach(t => {
    if (!assetPL[t.asset]) assetPL[t.asset] = 0
    assetPL[t.asset] += Number(t.profit_loss) || 0
  })

  const card = { background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', margin: '0 0 4px' }}>تحليل الأداء 📈</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>إحصائيات تفصيلية بكل أبعاد تداولك</p>
      </div>

      {trades.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <div style={{ color: '#64748b' }}>سجّل صفقات أولاً لرؤية التحليلات</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={card}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>الأداء بالجلسة</div>
              {Object.entries(sessions).map(([session, data]) => (
                <div key={session} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700 }}>{session}</span>
                    <span style={{ color: '#64748b', fontSize: 12 }}>{data.wins}/{data.total} • {((data.wins / data.total) * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: '#1e293b', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(data.wins / data.total) * 100}%`, background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>الأداء بالاستراتيجية</div>
              {Object.entries(stratWins).map(([strat, data]) => (
                <div key={strat} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700 }}>{strat}</span>
                    <span style={{ color: '#64748b', fontSize: 12 }}>{data.wins}/{data.total} • {data.pips > 0 ? '+' : ''}{data.pips} pips</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: '#1e293b', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(data.wins / data.total) * 100}%`, background: 'linear-gradient(90deg, #d4af37, #b8971f)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>الربح/الخسارة بالأصل</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {Object.entries(assetPL).sort((a, b) => b[1] - a[1]).map(([asset, pl]) => (
                <div key={asset} style={{ padding: '14px 20px', borderRadius: 12, background: pl >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${pl >= 0 ? '#22c55e' : '#ef4444'}40`, minWidth: 120, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{asset}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: pl >= 0 ? '#22c55e' : '#ef4444' }}>{pl >= 0 ? '+' : ''}${pl.toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── MistakeAnalyzer ─────────────────────────────────────────
export function MistakeAnalyzer({ trades }) {
  const mistakes = {}
  trades.filter(t => t.mistake_made).forEach(t => {
    if (!mistakes[t.mistake_made]) mistakes[t.mistake_made] = { count: 0, totalLoss: 0 }
    mistakes[t.mistake_made].count++
    if (t.result === 'Loss') mistakes[t.mistake_made].totalLoss += Math.abs(Number(t.profit_loss) || 0)
  })

  const guide = [
    { name: 'الدخول قبل التأكيد', risk: 'عالي', fix: 'انتظر إغلاق الشمعة على الـ OB قبل الدخول' },
    { name: 'تجاهل الأخبار الاقتصادية', risk: 'عالي', fix: 'تحقق من الكاليندر الاقتصادي قبل كل صفقة' },
    { name: 'تحريك وقف الخسارة', risk: 'خطر', fix: 'حدد SL مسبقاً ولا تلمسه بعد الدخول' },
    { name: 'الثأر من السوق', risk: 'خطر', fix: 'بعد الخسارة خذ استراحة 30 دقيقة قبل أي صفقة جديدة' },
    { name: 'المبالغة في التداول', risk: 'متوسط', fix: 'حدد عدد صفقات يومية، الحد الأقصى 3 صفقات' },
    { name: 'الدخول بدون Setup واضح', risk: 'عالي', fix: 'لا تدخل إلا إذا كان لديك: BOS + OB + تأكيد' },
  ]

  const card = { background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }
  const riskColor = { خطر: '#dc2626', عالي: '#f59e0b', متوسط: '#64748b' }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', margin: '0 0 4px' }}>محلل الأخطاء 🧠</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>اكتشف أنماط أخطائك وكيف تصحّحها</p>
      </div>

      {Object.keys(mistakes).length > 0 && (
        <div style={{ ...card, marginBottom: 20, borderColor: 'rgba(239,68,68,0.3)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', marginBottom: 16 }}>⚠️ أخطاؤك الفعلية المسجلة</div>
          {Object.entries(mistakes).sort((a, b) => b[1].count - a[1].count).map(([mistake, data]) => (
            <div key={mistake} style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{mistake}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>التكرار: {data.count} مرة • الخسائر: ${data.totalLoss.toFixed(0)}</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#ef4444' }}>{data.count}×</div>
            </div>
          ))}
        </div>
      )}

      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#d4af37', marginBottom: 16 }}>📚 دليل تصحيح الأخطاء الشائعة</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {guide.map((m, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 12, background: '#0a0f1a', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: `${riskColor[m.risk]}20`, color: riskColor[m.risk], border: `1px solid ${riskColor[m.risk]}40` }}>{m.risk}</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                <span style={{ color: '#22c55e' }}>✅ الحل: </span>{m.fix}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── WeeklyReport ─────────────────────────────────────────────
export function WeeklyReport({ trades, user }) {
  const { useState } = require('react')
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
