import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { LogOut, Loader2 } from 'lucide-react'
import { useAuth } from './AuthContext'

export const AuthWidget = () => {
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setErrorMsg('')
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setErrorMsg(error.message)
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) setErrorMsg(error.message)
        else setErrorMsg('サインアップ成功。ログインしてください（メール確認が必要な場合があります）。')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing auth')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return <div className="p-2"><Loader2 className="animate-spin w-5 h-5" /></div>

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <button 
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-black transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative group">
      <button className="text-sm font-medium px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-sm">
        ログイン
      </button>
      <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-black/10 border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <form onSubmit={handleAuth} className="flex flex-col gap-3">
          <input 
            type="email" 
            placeholder="メールアドレス" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <input 
            type="password" 
            placeholder="パスワード" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            required
            minLength={6}
          />
          <button 
            type="submit" 
            disabled={authLoading}
            className="bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {authLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (isLogin ? 'ログイン' : 'サインアップ')}
          </button>
          
          {errorMsg && <div className="text-xs text-red-500 mt-1">{errorMsg}</div>}
          
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
            className="text-xs text-gray-500 hover:text-black mt-1"
          >
            {isLogin ? 'アカウントを作成する' : '既存のアカウントでログイン'}
          </button>
        </form>
      </div>
    </div>
  )
}
