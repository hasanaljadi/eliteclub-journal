import { useState } from 'react'

const ASSETS = ['XAUUSD', 'EURUSD', 'GBPUSD', 'NAS100', 'US30', 'BTCUSD', 'ETHUSD', 'USDCAD', 'GBPJPY', 'USDJPY']
const SESSIONS = ['Asia', 'London', 'New York']
const TIMEFRAMES = ['1M', '5M', '15M', '1H', '4H', 'Daily']
const STRATEGIES = ['BOS', 'CHoCH', 'OB', 'IDM', 'FVG', 'Liquidity Sweep', 'Break & Retest', 'premium / dis']
const MARKET_TYPES = ['Forex', 'Gold', 'Indices', 'Crypto']
const RESULT_CONFIG = {
  Win: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'ربح ✅' },
  Loss: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'خسارة ❌' },
  BE: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'تعادل ⚖️' }
}

const s = {
  card: { background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)', border: '1px solid #1e293b', borderRadius: 16, padding: 24 },
  input: { width: '100%', padding: '10px 14px', background: '#080c14', border: '1px solid #1e293b', borderRadius: 10, color: '#e2e8f0', fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 14px', background: '#080c14', border: '1px solid #1e293b', borderRadius: 10, color: '#e2e8f0', fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: 'none', cursor: 'pointer' },
  label: { fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 600 },
  btn: (v = 'primary') => ({ padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 14, transition: 'all 0.2s', ...(v === 'primary' ? { background: 'linear-gradient(135deg, #d4af37, #b8971f)', color: '#080c14' } : { background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }) }),
  sectionTitle: { fontSize: 14, fontWeight: 800, color: '#d4af37', margin: '20px 0 16px', paddingTop: 16, borderTop: '1px solid #1e293b' },
}

const empty = (userName = '') => ({
  date: new Date().toISOString().split('T')[0],
  trader_name: userName,
  asset: 'XAUUSD', market_type: 'Gold', direction: 'Buy',
  entry_price: '', stop_loss: '', take_profit_1: '', take_profit_2: '', take_profit_3: '',
  exit_price: '', lot_size: '', risk_percentage: 1, result: 'Win',
  pips: '', profit_loss: '', timeframe: '15M', session: 'London',
  strategy_setup: 'OB', entry_reason: '', mistake_made: '', chart_link: '', notes: ''
})

const Row = ({ children, cols = 2 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, marginBottom: 16 }}>{children}</div>
)
const Field = ({ label, children }) => <div><label style={s.label}>{label}</label>{children}</div>

export default function AddTrade({ onSave, editTrade, onCancelEdit, user }) {
  const userName = user?.user_metadata?.full_name || ''
  const [form, setForm] = useState(editTrade || empty(userName))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.asset || !form.entry_price || !form.exit_price) return alert('يرجى تعبئة الحقول الأساسية: الأصل، الدخول، الخروج')
    setSaving(true)
    await onSave({
      ...form,
      entry_price: Number(form.entry_price), stop_loss: Number(form.stop_loss),
      take_profit_1: Number(form.take_profit_1), take_profit_2: Number(form.take_profit_2),
      take_profit_3: Number(form.take_profit_3), exit_price: Number(form.exit_price),
      lot_size: Number(form.lot_size), risk_percentage: Number(form.risk_percentage),
      pips: Number(form.pips), profit_loss: Number(form.profit_loss)
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    if (!editTrade) setForm(empty(userName))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', margin: '0 0 4px' }}>{editTrade ? 'تعديل الصفقة ✏️' : 'إضافة صفقة جديدة ➕'}</h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>سجّل صفقتك بدقة لتحليل أفضل</p>
        </div>
        {editTrade && <button style={s.btn('ghost')} onClick={onCancelEdit}>إلغاء التعديل</button>}
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#d4af37', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e293b' }}>📅 معلومات الصفقة الأساسية</div>

        <Row cols={4}>
          <Field label="التاريخ"><input type="date" style={s.input} value={form.date} onChange={e => set('date', e.target.value)} /></Field>
          <Field label="اسم المتداول"><input style={s.input} value={form.trader_name} onChange={e => set('trader_name', e.target.value)} /></Field>
          <Field label="الأصل"><select style={s.select} value={form.asset} onChange={e => set('asset', e.target.value)}>{ASSETS.map(a => <option key={a}>{a}</option>)}</select></Field>
          <Field label="نوع السوق"><select style={s.select} value={form.market_type} onChange={e => set('market_type', e.target.value)}>{MARKET_TYPES.map(m => <option key={m}>{m}</option>)}</select></Field>
        </Row>

        <Row cols={4}>
          <Field label="الاتجاه">
            <select style={s.select} value={form.direction} onChange={e => set('direction', e.target.value)}>
              <option value="Buy">Buy — شراء ↑</option>
              <option value="Sell">Sell — بيع ↓</option>
            </select>
          </Field>
          <Field label="الجلسة"><select style={s.select} value={form.session} onChange={e => set('session', e.target.value)}>{SESSIONS.map(s2 => <option key={s2}>{s2}</option>)}</select></Field>
          <Field label="التايم فريم"><select style={s.select} value={form.timeframe} onChange={e => set('timeframe', e.target.value)}>{TIMEFRAMES.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="الاستراتيجية"><select style={s.select} value={form.strategy_setup} onChange={e => set('strategy_setup', e.target.value)}>{STRATEGIES.map(st => <option key={st}>{st}</option>)}</select></Field>
        </Row>

        <div style={s.sectionTitle}>💹 أسعار الصفقة</div>
        <Row cols={3}>
          <Field label="سعر الدخول"><input type="number" style={s.input} placeholder="2320.50" value={form.entry_price} onChange={e => set('entry_price', e.target.value)} /></Field>
          <Field label="وقف الخسارة SL"><input type="number" style={s.input} placeholder="2315.00" value={form.stop_loss} onChange={e => set('stop_loss', e.target.value)} /></Field>
          <Field label="هدف الربح TP1"><input type="number" style={s.input} placeholder="2330.00" value={form.take_profit_1} onChange={e => set('take_profit_1', e.target.value)} /></Field>
        </Row>
        <Row cols={3}>
          <Field label="هدف الربح TP2"><input type="number" style={s.input} placeholder="2340.00" value={form.take_profit_2} onChange={e => set('take_profit_2', e.target.value)} /></Field>
          <Field label="هدف الربح TP3"><input type="number" style={s.input} placeholder="2350.00" value={form.take_profit_3} onChange={e => set('take_profit_3', e.target.value)} /></Field>
          <Field label="سعر الخروج"><input type="number" style={s.input} placeholder="2329.50" value={form.exit_price} onChange={e => set('exit_price', e.target.value)} /></Field>
        </Row>

        <div style={s.sectionTitle}>📊 إدارة الرأسمال والنتيجة</div>
        <Row cols={4}>
          <Field label="حجم الصفقة (Lot)"><input type="number" style={s.input} placeholder="0.50" value={form.lot_size} onChange={e => set('lot_size', e.target.value)} /></Field>
          <Field label="نسبة المخاطرة %"><input type="number" style={s.input} placeholder="1" value={form.risk_percentage} onChange={e => set('risk_percentage', e.target.value)} /></Field>
          <Field label="النقاط (Pips)"><input type="number" style={s.input} placeholder="90" value={form.pips} onChange={e => set('pips', e.target.value)} /></Field>
          <Field label="الربح/الخسارة $"><input type="number" style={s.input} placeholder="45" value={form.profit_loss} onChange={e => set('profit_loss', e.target.value)} /></Field>
        </Row>

        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>النتيجة</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {Object.entries(RESULT_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => set('result', key)} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 14,
                background: form.result === key ? cfg.bg : '#0d1421',
                color: form.result === key ? cfg.color : '#64748b',
                outline: form.result === key ? `2px solid ${cfg.color}` : '1px solid #1e293b'
              }}>{cfg.label}</button>
            ))}
          </div>
        </div>

        <div style={s.sectionTitle}>📝 التحليل والملاحظات</div>
        <Row cols={1}>
          <Field label="سبب الدخول">
            <textarea style={{ ...s.input, minHeight: 70, resize: 'vertical' }} placeholder="وصف إشارة الدخول والتأكيد..." value={form.entry_reason} onChange={e => set('entry_reason', e.target.value)} />
          </Field>
        </Row>
        <Row cols={2}>
          <Field label="الخطأ المرتكب (إن وجد)"><input style={s.input} placeholder="مثال: دخلت قبل التأكيد..." value={form.mistake_made} onChange={e => set('mistake_made', e.target.value)} /></Field>
          <Field label="رابط الشارت"><input style={s.input} placeholder="tradingview.com/x/..." value={form.chart_link} onChange={e => set('chart_link', e.target.value)} /></Field>
        </Row>
        <Row cols={1}>
          <Field label="ملاحظات وكيف كان شعورك">
            <textarea style={{ ...s.input, minHeight: 70, resize: 'vertical' }} placeholder="كيف كان شعورك وقت الصفقة؟ ماذا تعلمت؟" value={form.notes} onChange={e => set('notes', e.target.value)} />
          </Field>
        </Row>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button style={s.btn()} onClick={handleSubmit} disabled={saving}>
            {saving ? '⏳ جاري الحفظ...' : saved ? '✅ تم الحفظ!' : editTrade ? '💾 حفظ التعديلات' : '➕ حفظ الصفقة'}
          </button>
          {!editTrade && <button style={s.btn('ghost')} onClick={() => setForm(empty(userName))}>🗑️ مسح النموذج</button>}
        </div>
      </div>
    </div>
  )
}
