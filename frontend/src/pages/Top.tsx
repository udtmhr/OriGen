import React from 'react';
import { Link } from 'react-router-dom';
// import { Network } from 'lucide-react'; // Network icon used as raw SVG in fallback below

const Top: React.FC = () => {
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
                        {/* Place your logo image at frontend/public/logo.png */}
                        <img
                            src="/logo.png"
                            alt="OriGen Logo"
                            className="w-32 h-32 object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                    // Fallback if image fails to load
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

                {/* Action Button */}
                <Link
                    to="/patterns"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 min-w-[200px]"
                >
                    α版を試す
                </Link>

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
