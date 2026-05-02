import React, { useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Wand2, ArrowRight, Loader2 } from 'lucide-react';

export default function ScoreCard({ result, fullContext }) {
    const [expanded, setExpanded] = useState(false);
    const [suggestion, setSuggestion] = useState(null);
    const [loading, setLoading] = useState(false);

    const { attribute, status, score, priority, message, current_value } = result;

    const statusColors = {
        Good: 'bg-green-100 text-green-700 border-green-200',
        'Needs Improvement': 'bg-yellow-50 text-yellow-700 border-yellow-200',
        Missing: 'bg-red-50 text-red-700 border-red-200'
    };

    const statusIcon = {
        Good: <CheckCircle className="w-5 h-5 text-green-600" />,
        'Needs Improvement': <AlertCircle className="w-5 h-5 text-yellow-600" />,
        Missing: <AlertCircle className="w-5 h-5 text-red-600" />
    };

    const handleSuggest = async () => {
        if (suggestion) return; // Already fetched
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/suggest', {
                issue_type: attribute,
                current_value: String(current_value),
                page_context: fullContext ? JSON.stringify(fullContext) : ""
            });
            setSuggestion(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`bg-white rounded-lg border transition-all ${expanded ? 'border-indigo-200 shadow-md' : 'border-slate-200'}`}>
            <div
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        {statusIcon[status]}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 text-lg">{attribute}</h3>
                        <p className="text-slate-500 text-sm">{message}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColors[status]}`}>
                        {status}
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-slate-700">{score}</span>
                        <span className="text-slate-400 text-xs">/100</span>
                    </div>
                    {expanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </div>
            </div>

            {expanded && (
                <div className="p-5 pt-0 border-t border-slate-100 animate-in slide-in-from-top-2">
                    <div className="mt-4 grid md:grid-cols-2 gap-6">

                        {/* Current State */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Current Value</h4>
                            <p className="font-mono text-sm text-slate-700 break-words">
                                {current_value ? String(current_value) : <span className="text-red-400 italic">Missing</span>}
                            </p>
                        </div>

                        {/* Action Area */}
                        <div className="flex flex-col justify-center items-start">
                            {status !== 'Good' && !suggestion && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSuggest();
                                    }}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                                    Generate AI Suggestion
                                </button>
                            )}
                        </div>
                    </div>

                    {/* AI Suggestion Result */}
                    {suggestion && (
                        <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden">
                            <div className="bg-indigo-100/50 px-4 py-2 border-b border-indigo-100 flex items-center gap-2">
                                <Wand2 className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-bold text-indigo-700">AI Recommendation</span>
                            </div>

                            <div className="p-5 grid gap-4">
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <div className="flex-1">
                                        <span className="text-xs font-semibold text-slate-400 uppercase">Before</span>
                                        <div className="mt-1 p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm font-mono break-all line-through decoration-red-300">
                                            {current_value || "Missing"}
                                        </div>
                                    </div>
                                    <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 mt-6" />
                                    <div className="flex-1">
                                        <span className="text-xs font-semibold text-slate-400 uppercase">After</span>
                                        <div className="mt-1 p-3 bg-green-50 border border-green-100 rounded text-green-700 text-sm font-mono font-medium break-all shadow-sm">
                                            {suggestion.suggestion}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <h5 className="font-semibold text-indigo-900 text-sm mb-1">Why this works:</h5>
                                    <p className="text-indigo-800 text-sm leading-relaxed">
                                        {suggestion.explanation} <span className="opacity-75">{suggestion.reasoning}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
