import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const Top: React.FC = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    
    // Auth form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setErrorMsg('');
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    setErrorMsg(error.message);
                } else {
                    setShowLogin(false);
                    navigate('/patterns');
                }
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) {
                    setErrorMsg(error.message);
                } else {
                    setErrorMsg('サインアップ成功。ログインしてください（メール確認が必要な場合があります）。');
                    setIsLogin(true);
                }
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Error executing auth');
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration (optional/subtle) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-blue-100 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-50 blur-3xl"></div>
            </div>

            <main className="z-10 flex flex-col items-center max-w-md w-full text-center space-y-12">
                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <img
                            src="/logo.png"
                            alt="OriGen Logo"
                            className="w-32 h-32 object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                    const icon = document.createElement('div');
                                    icon.className = "text-gray-900";
                                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-network"><rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path><path d="M12 12V8"></path></svg>';
                                    parent.appendChild(icon);
                                }
                            }}
                        />
                    </div>
                    <h1 className="text-5xl font-serif tracking-widest text-gray-900">
                        OriGen
                    </h1>
                </div>

                {/* Tagline */}
                <div className="space-y-6">
                    <p className="text-gray-600 text-lg font-medium tracking-wide">
                        あなただけのテキスタイルを創造する
                    </p>
                </div>

                {/* Action Button / Auth Form */}
                <div className="min-h-[60px] w-full max-w-sm">
                    {loading ? (
                        <div className="animate-pulse w-[200px] h-14 bg-gray-200 rounded-full mx-auto"></div>
                    ) : user ? (
                        <Link
                            to="/patterns"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 min-w-[200px]"
                        >
                            はじめる
                        </Link>
                    ) : showLogin ? (
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-100 w-full text-left transition-all">
                            <form onSubmit={handleAuth} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={authLoading}
                                    className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors mt-2 flex items-center justify-center"
                                >
                                    {authLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : (isLogin ? 'ログインしてはじめる' : 'アカウントを作成してはじめる')}
                                </button>
                                
                                {errorMsg && <div className="text-sm text-red-500 text-center font-medium bg-red-50 py-3 rounded-xl">{errorMsg}</div>}
                                
                                <button 
                                    type="button" 
                                    onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                                    className="text-sm text-gray-500 hover:text-gray-900 mt-2 hover:underline transition-colors w-full text-center"
                                >
                                    {isLogin ? '新規登録はこちら' : '既にアカウントをお持ちの方はこちら'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowLogin(true)}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 min-w-[200px]"
                        >
                            ログインしてはじめる
                        </button>
                    )}
                </div>

                {/* Footer / Description */}
                <div className="pt-8">
                    <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                        伝統的な織物技術とAIの力を組み合わせて、<br />
                        あなたのイメージを美しいテキスタイルデザインに
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Top;
