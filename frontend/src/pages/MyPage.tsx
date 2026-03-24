import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Heart, History, User, LogOut, Settings, Plus, Sparkles } from 'lucide-react';
import { getProfile, updateProfile, getUserStats, getUserPatterns, getLikedPatterns, getGenerationHistory, updatePatternVisibility } from '../api/client';

const MyPage: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<'gallery' | 'favorites' | 'history' | 'profile'>('gallery');
    
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState({ total_patterns: 0, total_likes: 0 });
    
    // Data states
    const [myPatterns, setMyPatterns] = useState<any[]>([]);
    const [likedPatterns, setLikedPatterns] = useState<any[]>([]);
    const [historyLogs, setHistoryLogs] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    const [editUsername, setEditUsername] = useState('');
    const [editBio, setEditBio] = useState('');

    useEffect(() => {
        if (!user) return;
        
        const loadInitialData = async () => {
            setDataLoading(true);
            try {
                // Determine if we need to create a profile locally before backend trigger handles it 
                // Alternatively, just depend on backend trigger
                const userProfile = await getProfile(user.id).catch(() => null);
                setProfile(userProfile);
                
                if (userProfile) {
                    setEditUsername(userProfile.username || '');
                    setEditBio(userProfile.bio || '');
                }

                const userStats = await getUserStats(user.id);
                setStats(userStats);

                await loadTabData('gallery');
            } catch (err) {
                console.error("Failed to load generic profile data", err);
            } finally {
                setDataLoading(false);
            }
        };

        loadInitialData();
    }, [user]);

    const loadTabData = async (tab: string) => {
        if (!user) return;
        setDataLoading(true);
        try {
            if (tab === 'gallery') {
                const patterns = await getUserPatterns(user.id);
                setMyPatterns(patterns);
            } else if (tab === 'favorites') {
                const liked = await getLikedPatterns(user.id);
                setLikedPatterns(liked);
            } else if (tab === 'history') {
                const history = await getGenerationHistory(user.id);
                setHistoryLogs(history);
            }
        } catch (error) {
            console.error(`Error loading ${tab} data:`, error);
        } finally {
            setDataLoading(false);
        }
    };

    const handleTabChange = (tab: typeof activeTab) => {
        setActiveTab(tab);
        loadTabData(tab);
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            const updated = await updateProfile(user.id, { username: editUsername, bio: editBio });
            setProfile(updated);
            alert("プロフィールを更新しました。");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("プロフィールの更新に失敗しました。");
        }
    };

    const toggleVisibility = async (patternId: string, currentStatus: boolean) => {
        try {
            await updatePatternVisibility(patternId, !currentStatus);
            // update local state
            setMyPatterns(myPatterns.map(p => p.id === patternId ? { ...p, is_public: !currentStatus } : p));
        } catch (error) {
            console.error("Failed to update visibility", error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (authLoading || (!user && dataLoading)) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) return null; // Handled by ProtectedRoute

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar navigation */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col pt-8">
                <div className="px-6 mb-8 text-center md:text-left">
                    <h2 className="text-2xl font-serif text-gray-900">OriGen</h2>
                    <p className="text-xs text-gray-400 mt-1">マイページ</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link 
                        to="/patterns"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors bg-indigo-600 text-white hover:bg-indigo-700 mb-4 shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-bold text-sm">新しく作成する</span>
                    </Link>

                    <div className="h-px bg-gray-100 my-4 mx-2"></div>

                    <button 
                        onClick={() => handleTabChange('gallery')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'gallery' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium text-sm">ギャラリー</span>
                    </button>
                    <button 
                        onClick={() => handleTabChange('favorites')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'favorites' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Heart className="w-5 h-5" />
                        <span className="font-medium text-sm">お気に入り</span>
                    </button>
                    <button 
                        onClick={() => handleTabChange('history')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'history' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <History className="w-5 h-5" />
                        <span className="font-medium text-sm">生成履歴</span>
                    </button>
                    <button 
                        onClick={() => handleTabChange('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium text-sm">プロフィール設定</span>
                    </button>
                </nav>
                
                <div className="p-4 border-t border-gray-100 mt-auto">
                     <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                     >
                        <LogOut className="w-4 h-4" />
                        <span>ログアウト</span>
                     </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto w-full">
                {/* Header Profile Summary (visible on all tabs except profile edit itself) */}
                {activeTab !== 'profile' && profile && (
                    <header className="bg-white px-8 py-8 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 max-w-5xl mx-auto">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-indigo-400" />
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl font-bold text-gray-900">{profile.username || '名無しデザイナー'}</h1>
                                <p className="text-gray-500 mt-2 max-w-lg">{profile.bio || '自己紹介がまだありません。プロフィール設定から追加しましょう。'}</p>
                            </div>
                            <div className="flex gap-6 mt-4 md:mt-0 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">作成数</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_patterns}</p>
                                </div>
                                <div className="w-px bg-gray-200"></div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">獲得いいね</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_likes}</p>
                                </div>
                            </div>
                        </div>
                    </header>
                )}

                <div className="p-8 max-w-5xl mx-auto">
                    {dataLoading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-pulse w-10 h-10 bg-gray-200 rounded-full"></div>
                        </div>
                    ) : (
                        <>
                            {/* MY GALLERY */}
                            {activeTab === 'gallery' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                                            自分の図案
                                        </h2>
                                    </div>
                                    {myPatterns.length === 0 ? (
                                        <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                            <p className="text-gray-500">保存された図案がありません。</p>
                                            <button onClick={() => window.location.href='/workspace/new'} className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                                                新しい図案を作成する &rarr;
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {myPatterns.map(pattern => (
                                                <div key={pattern.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                                    <div className="aspect-square w-full bg-gray-50 relative">
                                                        <img src={pattern.image_url} alt={pattern.name} className="w-full h-full object-cover" />
                                                        <div className="absolute top-2 right-2">
                                                            <button 
                                                                onClick={() => toggleVisibility(pattern.id, pattern.is_public)}
                                                                className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md shadow-sm transition-colors ${pattern.is_public ? 'bg-green-500/90 text-white' : 'bg-gray-900/80 text-white'}`}
                                                            >
                                                                {pattern.is_public ? '公開中' : '非公開'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 flex-1 flex flex-col">
                                                        <h3 className="font-bold text-gray-900 truncate">{pattern.name}</h3>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pattern.description || '説明なし'}</p>
                                                        
                                                        {/* Future addition: Export to SVG button could go here */}
                                                        <div className="flex gap-2 mt-4">
                                                            <Link 
                                                                to={`/workspace/${pattern.id}`}
                                                                className="flex-1 text-center py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                                                            >
                                                                <Sparkles size={14} />
                                                                AIで編集
                                                            </Link>
                                                            <a 
                                                                href={pattern.image_url} 
                                                                download={`pattern-${pattern.name}.jpg`}
                                                                target="_blank"
                                                                className="px-3 py-2 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                                                                title="ダウンロード"
                                                            >
                                                                ↓
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FAVORITES */}
                            {activeTab === 'favorites' && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-red-500" />
                                        お気に入り
                                    </h2>
                                    {likedPatterns.length === 0 ? (
                                        <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                            <p className="text-gray-500">お気に入りの図案がありません。</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {likedPatterns.map(pattern => (
                                                <div key={pattern.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                                                    <div className="aspect-square w-full bg-gray-50 overflow-hidden">
                                                        <img src={pattern.image_url} alt={pattern.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-gray-900 truncate">{pattern.name}</h3>
                                                        <p className="text-xs text-gray-500 mt-1 truncate mb-3">@{pattern.user_id?.split('-')[0]}...</p>
                                                        <Link 
                                                            to={`/workspace/${pattern.id}`}
                                                            className="w-full text-center py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                                                        >
                                                            <Sparkles size={14} />
                                                            AIで編集
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* HISTORY */}
                            {activeTab === 'history' && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <History className="w-5 h-5 text-blue-500" />
                                        生成履歴
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6 border-l-4 border-indigo-200 pl-3">
                                        過去にAIとチャットして生成した画像の履歴です。「保存」しなかった画像もここから確認できます。
                                    </p>
                                    {historyLogs.length === 0 ? (
                                        <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                            <p className="text-gray-500">履歴がありません。</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-6">
                                            {historyLogs.map(log => (
                                                <div key={log.id} className="flex gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                                    <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                                        <img src={log.image_url} className="w-full h-full object-cover" alt="History item" />
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <div className="text-xs text-gray-400 font-medium mb-2">
                                                            {new Date(log.created_at).toLocaleString('ja-JP')}
                                                        </div>
                                                        <p className="text-gray-800 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                            "{log.prompt}"
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PROFILE EDIT */}
                            {activeTab === 'profile' && (
                                <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                        <User className="w-5 h-5 text-gray-700" />
                                        プロフィール設定
                                    </h2>
                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">クリエイター名</label>
                                            <input 
                                                type="text" 
                                                value={editUsername}
                                                onChange={e => setEditUsername(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                                placeholder="あなたの名前やブランド名"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">自己紹介</label>
                                            <textarea 
                                                value={editBio}
                                                onChange={e => setEditBio(e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                                placeholder="好きなデザインのテイストや自己紹介を記入してください"
                                            />
                                        </div>
                                        <div className="pt-4 flex justify-end">
                                            <button 
                                                type="submit" 
                                                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-sm"
                                            >
                                                保存する
                                            </button>
                                        </div>
                                    </form>
                                    <div className="mt-12 pt-8 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 mb-4">アカウントのメールアドレス: <span className="font-medium text-gray-900">{user.email}</span></p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyPage;
