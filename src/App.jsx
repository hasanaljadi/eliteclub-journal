import { useState, useEffect, useCallback } from 'react'
import { supabase, getTrades, addTrade, updateTrade, deleteTrade } from './lib/supabase'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TradeJournal from './pages/TradeJournal'
import AddTrade from './pages/AddTrade'
import Analytics from './pages/Analytics'
import MistakeAnalyzer from './pages/MistakeAnalyzer'
import WeeklyReport from './pages/WeeklyReport'

export default function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [trades, setTrades] = useState([])
  const [tradesLoading, setTradesLoading] = useState(false)
  const [page, setPage] = useState('dashboard')
  const [editTrade, setEditTrade] = useState(null)
  const [viewTrade, setViewTrade] = useState(null)

  // ── Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Load trades when user logs in
  const loadTrades = useCallback(async () => {
    if (!user) return
    setTradesLoading(true)
    const { data } = await getTrades(user.id)
    if (data) setTrades(data)
    setTradesLoading(false)
  }, [user])

  useEffect(() => { loadTrades() }, [loadTrades])

  // ── Add or update trade
  const handleSaveTrade = async (tradeData) => {
    const payload = { ...tradeData, user_id: user.id }
    if (editTrade) {
      const { data } = await updateTrade(editTrade.id, payload)
      if (data) setTrades(ts => ts.map(t => t.id === editTrade.id ? data[0] : t))
    } else {
      delete payload.id
      const { data } = await addTrade(payload)
      if (data) setTrades(ts => [data[0], ...ts])
    }
    setEditTrade(null)
    setPage('journal')
  }

  // ── Delete trade
  const handleDeleteTrade = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الصفقة؟')) return
    await deleteTrade(id)
    setTrades(ts => ts.filter(t => t.id !== id))
  }

  // ── Edit
  const handleEdit = (trade) => {
    setEditTrade(trade)
    setViewTrade(null)
    setPage('add')
  }

  // ── Loading screen
  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cairo', sans-serif", color: '#d4af37', fontSize: 18, fontWeight: 700 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
        <div>EliteClub Journal</div>
        <div style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>جاري التحميل...</div>
      </div>
    </div>
  )

  if (!user) return <LoginPage />

  const pageProps = {
    trades, tradesLoading, user,
    onView: setViewTrade,
    onDelete: handleDeleteTrade,
    onEdit: handleEdit,
    onSave: handleSaveTrade,
    editTrade,
    onCancelEdit: () => { setEditTrade(null); setPage('journal') },
    viewTrade,
    onCloseView: () => setViewTrade(null),
    setPage
  }

  return (
    <Layout page={page} setPage={(p) => { setPage(p); if (p !== 'add') setEditTrade(null) }} user={user} tradesCount={trades.length}>
      {page === 'dashboard' && <Dashboard {...pageProps} />}
      {page === 'journal' && <TradeJournal {...pageProps} />}
      {page === 'add' && <AddTrade {...pageProps} />}
      {page === 'analytics' && <Analytics {...pageProps} />}
      {page === 'mistakes' && <MistakeAnalyzer {...pageProps} />}
      {page === 'report' && <WeeklyReport {...pageProps} />}
    </Layout>
  )
}
