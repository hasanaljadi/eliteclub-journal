const guide = [
  { name: 'الدخول قبل التأكيد', risk: 'عالي', fix: 'انتظر إغلاق الشمعة على الـ OB قبل الدخول' },
  { name: 'تجاهل الأخبار الاقتصادية', risk: 'عالي', fix: 'تحقق من الكاليندر الاقتصادي قبل كل صفقة' },
  { name: 'تحريك وقف الخسارة', risk: 'خطر', fix: 'حدد SL مسبقاً ولا تلمسه بعد الدخول' },
  { name: 'الثأر من السوق', risk: 'خطر', fix: 'بعد الخسارة خذ استراحة 30 دقيقة قبل أي صفقة جديدة' },
  { name: 'المبالغة في التداول', risk: 'متوسط', fix: 'حدد عدد صفقات يومية، الحد الأقصى 3 صفقات' },
  { name: 'الدخول بدون Setup واضح', risk: 'عالي', fix: 'لا تدخل إلا إذا كان لديك: BOS + OB + تأكيد' },
]
const riskColor = { خطر: '#dc2626', عالي: '#f59e0b', متوسط: '#64748b' }
const card = { background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }

export default function MistakeAnalyzer({ trades }) {
  const mistakes = {}
  trades.filter(t => t.mistake_made).forEach(t => {
    if (!mistakes[t.mistake_made]) mistakes[t.mistake_made] = { count: 0, totalLoss: 0 }
    mistakes[t.mistake_made].count++
    if (t.result === 'Loss') mistakes[t.mistake_made].totalLoss += Math.abs(Number(t.profit_loss) || 0)
  })
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
