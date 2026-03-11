import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, User } from 'lucide-react';
import { getPatterns, toggleLike, getLikedPatterns } from '../api/client';
import type { Pattern } from '../types';
import { AuthWidget } from '../components/Auth';
import { useAuth } from '../components/AuthContext';

const PatternList: React.FC = () => {
    const { user } = useAuth();
    const [patterns, setPatterns] = React.useState<Pattern[]>([]);
    const [likedPatternIds, setLikedPatternIds] = React.useState<Set<string>>(new Set());
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
        setLoading(true);
        getPatterns(searchQuery)
            .then(data => {
                setPatterns(data);
                if (user) {
                    return getLikedPatterns(user.id);
                }
                return [];
            })
            .then(liked => {
                setLikedPatternIds(new Set(liked.map((p: any) => p.id)));
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [searchQuery, user]);

    const handleLike = async (e: React.MouseEvent, patternId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return alert("いいねするにはログインが必要です。");
        
        try {
            const isLikedNow = await toggleLike(patternId, user.id);
            const newLiked = new Set(likedPatternIds);
            if (isLikedNow) {
                newLiked.add(patternId);
            } else {
                newLiked.delete(patternId);
            }
            setLikedPatternIds(newLiked);
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b py-4 px-4 sticky top-0 z-10 flex items-center justify-between relative">
                <Link to="/" className="text-gray-500 hover:text-gray-900">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-serif tracking-wider text-gray-800 absolute left-1/2 -translate-x-1/2">OriGen</h1>
                <div className="flex items-center gap-4">
                    {user && (
                        <Link to="/mypage" className="p-2 text-gray-500 hover:text-gray-900 transition-colors bg-gray-50 rounded-full border border-gray-200" title="マイページ">
                            <User className="w-5 h-5" />
                        </Link>
                    )}
                    <AuthWidget />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 max-w-md md:max-w-2xl lg:max-w-4xl">
                <h2 className="text-center text-lg font-medium mb-8 text-gray-700 leading-relaxed">
                    ベースとなるテキスタイルパターンを<br />
                    選択してください
                </h2>

                <div className="mb-6 max-w-md mx-auto">
                    <input 
                        type="text"
                        placeholder="図案を検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 bg-white shadow-sm transition-all"
                    />
                </div>

                {loading ? (
                    <div className="p-4 text-center text-gray-400 text-sm">Loading patterns...</div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {patterns.map((pattern) => (
                            <Link
                                key={pattern.id}
                                to={`/workspace/${encodeURIComponent(pattern.id)}`}
                                className="aspect-square bg-gray-100 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity relative group"
                            >
                                {/* Like Button */}
                                <button 
                                    onClick={(e) => handleLike(e, pattern.id)}
                                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-110 active:scale-95 transition-all z-10 opacity-0 group-hover:opacity-100"
                                >
                                    <Heart className={`w-5 h-5 ${likedPatternIds.has(pattern.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                                </button>
                                {pattern.image_url ? (
                                    <img
                                        src={pattern.image_url}
                                        alt={pattern.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-2 text-center text-xs break-all">
                                        <span>No Image</span>
                                        <span className="mt-1">{pattern.name}</span>
                                    </div>
                                )}
                            </Link>
                        ))}
                        {patterns.length === 0 && (
                            <div className="col-span-2 text-center text-gray-400 py-12">
                                パターンが見つかりませんでした。
                            </div>
                        )}
                    </div>
                )}
            </main>

        </div>
    );
};

export default PatternList;
