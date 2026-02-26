import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPattern, generatePattern } from '../api/client';
import type { Pattern } from '../types';

interface Message {
    role: 'user' | 'system';
    text: string;
    imageUrl?: string;
}

const Workspace: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const initialPattern = location.state?.pattern as Pattern | undefined;

    const [pattern, setPattern] = useState<Pattern | null>(initialPattern || null);
    const [instruction, setInstruction] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize messages with the pattern image if available
    const [messages, setMessages] = useState<Message[]>(() => [
        {
            role: 'system',
            text: 'このベースにテキスタイルを作成しましょう！',
            imageUrl: initialPattern?.image_url || 'https://placehold.co/400x400/e2e8f0/1e293b?text=Initial+Pattern'
        },
        { role: 'system', text: '今の気分や作りたいイメージを教えてください' }
    ]);
    const [modelType, setModelType] = useState<'api' | 'gemini'>('gemini');

    useEffect(() => {
        if (id && !pattern) {
            getPattern(id).then(setPattern).catch(console.error);
        }
    }, [id, pattern]);

    // Update the first message image if pattern loads later (fallback)
    useEffect(() => {
        if (pattern && messages[0].imageUrl?.includes('Initial+Pattern')) {
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[0] = { ...newMessages[0], imageUrl: pattern.image_url };
                return newMessages;
            });
        }
    }, [pattern]);

    const handleSend = async () => {
        if (!instruction.trim() || !pattern) return;

        const userMsg = instruction;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInstruction('');
        setLoading(true);

        try {
            const result = await generatePattern({
                base_pattern_id: pattern.id,
                instruction: userMsg,
                model_type: modelType,
                image_url: pattern.image_url // Pass the pattern image
            });

            // Use the generated image URL if available, otherwise fallback to placeholder
            const generatedImage = result.generated_image_url || `https://placehold.co/400x400/e2e8f0/1e293b?text=Generated+${Date.now()}`;

            // Grid update removed as per user request
            // setPattern(prev => prev ? { ...prev, grid: result.grid } : null);

            setMessages(prev => [
                ...prev,
                {
                    role: 'system',
                    text: '新しいパターンを生成しました。',
                    imageUrl: generatedImage
                }
            ]);
        } catch (err: any) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'system', text: `Error: ${err.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    if (!pattern && !initialPattern) return <div>Loading workspace...</div>;

    return (
        <div className="flex h-screen flex-col bg-white">
            <header className="border-b p-4 flex items-center gap-4 sticky top-0 bg-white z-10">
                <Link to="/patterns" className="text-gray-500 hover:text-gray-900">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold">Workspace: {pattern?.name}</h1>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Chat Interface */}
                <div className="w-full max-w-3xl mx-auto flex flex-col bg-white border-x shadow-sm h-full">
                    <div className="px-4 py-2 border-b flex items-center justify-between bg-gray-50 text-xs text-gray-500">
                        <span>AI Engine</span>
                        <select
                            className="border rounded px-2 py-1 bg-white"
                            value={modelType}
                            onChange={(e) => setModelType(e.target.value as 'api' | 'gemini')}
                        >
                            <option value="gemini">Gemini</option>
                            <option value="api">OpenAI</option>
                        </select>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                {/* Icon */}
                                {msg.role === 'system' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                        <Sparkles size={16} className="text-white" />
                                    </div>
                                )}

                                <div className={`max-w-[80%] space-y-2`}>
                                    <div className={`p-4 rounded-2xl ${msg.role === 'system'
                                        ? 'bg-gray-100 text-gray-800 rounded-tl-none'
                                        : 'bg-indigo-600 text-white rounded-tr-none'
                                        }`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                        {msg.imageUrl && (
                                            <div className="mt-3 rounded-lg overflow-hidden bg-white p-1 border">
                                                {/* Apply layoutId ONLY to the first message's image to match the list transition */}
                                                {idx === 0 && pattern ? (
                                                    <motion.img
                                                        layoutId={`pattern-image-${pattern.id}`}
                                                        src={msg.imageUrl}
                                                        alt="Generated pattern"
                                                        className="w-full h-auto rounded"
                                                        transition={{ duration: 0.5, type: "spring" }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={msg.imageUrl}
                                                        alt="Generated pattern"
                                                        className="w-full h-auto rounded"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && <div className="text-gray-400 text-sm">Thinking...</div>}
                    </div>
                    <div className="p-4 border-t gap-2 flex">
                        <input
                            className="flex-1 border rounded px-3 py-2"
                            placeholder={modelType === 'gemini' ? "どんな柄の画像を作りたいですか？ (例: 猫のピクセルアート)" : "例: 春の穏やかな雰囲気，パステルカラー"}
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend(); }}
                            disabled={loading}
                        />
                        <button
                            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 flex items-center"
                            onClick={handleSend}
                            disabled={loading}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    {/* Model Info Footnote */}
                    <div className="px-4 py-1 bg-gray-50 text-[10px] text-center text-gray-400">
                        Powered by {modelType === 'api' ? 'OpenAI GPT-4' : 'Google Gemini 2.5 Flash'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;
