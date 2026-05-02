import React from 'react';
import { ExternalLink, ChevronRight, Loader2, RefreshCw } from 'lucide-react';

export default function PageList({ pages, onSelect, loading, onBack, onSiteAudit, onRefresh }) {
    return (
        <div>
            <button
                    onClick={onBack}
                    className="text-slate-500 hover:text-slate-700 font-medium text-sm border border-slate-300 px-4 py-2 rounded-lg bg-white"
                    >
                    Back
            </button>
            <div className="max-w-4xl mx-auto">

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-2xl font-bold text-slate-800">Discovered Pages</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className="text-indigo-600 hover:bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
                            title="Force refresh list"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Re-Analyse
                        </button>
                        <button
                            onClick={onSiteAudit}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
                        >
                            Run Site Audit
                        </button>

                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-slate-500">Crawling page data...</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {pages.length === 0 && (
                            <div className="p-8 bg-white rounded-lg border border-slate-200 text-center text-slate-500">
                                No pages found. Try checking the URL or try another site.
                            </div>
                        )}
                        {pages.map((page, idx) => (
                            <div
                                key={idx}
                                className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
                                onClick={() => onSelect(page)}
                            >
                                <span className="font-mono text-sm text-slate-600 truncate flex-1 mr-4">{page}</span>
                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
