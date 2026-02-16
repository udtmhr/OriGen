import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPatterns } from '../api/client';
import type { Pattern } from '../types';

const PatternList: React.FC = () => {
    const [patterns, setPatterns] = React.useState<Pattern[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        getPatterns()
            .then(setPatterns)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-4 text-center">Loading patterns...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b py-4 px-4 sticky top-0 z-10 flex items-center justify-center relative">
                <Link to="/" className="absolute left-4 text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-serif tracking-wider text-gray-800">OriGen</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 max-w-md md:max-w-2xl lg:max-w-4xl">
                <h2 className="text-center text-lg font-medium mb-8 text-gray-700 leading-relaxed">
                    ベースとなるテキスタイルパターンを<br />
                    選択してください
                </h2>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {patterns.map((pattern) => (
                        <Link
                            key={pattern.id}
                            to={`/workspace/${encodeURIComponent(pattern.id)}`}
                            className="aspect-square bg-gray-100 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity"
                        >
                            {pattern.image_url ? (
                                <img
                                    src={pattern.image_url}
                                    alt={pattern.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PatternList;
