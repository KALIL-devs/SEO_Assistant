import React, { useState } from 'react';
import { Search, Loader2, Clock } from 'lucide-react';

export default function UrlInput({ onDiscover, loading, history = [] }) {
    const [url, setUrl] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) return;
        let formattedUrl = url;
        if (!url.startsWith('http')) {
            formattedUrl = `https://${url}`;
        }
        onDiscover(formattedUrl);
        setShowHistory(false);
    };

    const handleHistoryClick = (histUrl) => {
        setUrl(histUrl);
        onDiscover(histUrl);
        setShowHistory(false);
    };

    return (
        <div className="max-w-2xl mx-auto mt-20 text-center">
            <h2 className="text-4xl font-extrabold text-slate-800 mb-4">
                Optimize Smarter. Rank Faster. Do SEO Yourself
            </h2>
            <p className="text-lg text-slate-600 mb-8">
                Enter your website URL to discover pages, analyze SEO health, and get AI-powered suggestions.
            </p>

            <form onSubmit={handleSubmit} className="relative z-20">
                <div className="flex items-center bg-white border-2 border-slate-200 rounded-full overflow-hidden shadow-lg focus-within:border-indigo-500 transition-colors p-2 pl-6 relative">
                    <Search className="text-slate-400 w-6 h-6 mr-3" />
                    <input
                        type="text"
                        className="flex-1 outline-none text-lg bg-transparent py-3"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onFocus={() => setShowHistory(true)}
                        onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Analyze'}
                    </button>
                </div>

                {showHistory && history.length > 0 && (
                    <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden text-left z-50">
                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Recent Searches
                        </div>
                        {history.map((h, i) => (
                            <div
                                key={i}
                                onClick={() => handleHistoryClick(h)}
                                className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
                            >
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-700 font-medium truncate">{h}</span>
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
}
