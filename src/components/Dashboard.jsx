import React from 'react';
import ScoreCard from './ScoreCard';
import { Gauge, ArrowLeft, RefreshCw } from 'lucide-react';
import PageSpeedResults from './PageSpeedResults';

export default function Dashboard({
    data,
    url,
    pageSpeedData,
    onRunPageSpeed,
    loading,
    onBack,
    onRefresh
}) {
    const { overall_score, results, attributes } = data;

    const scoreColor =
        overall_score >= 80
            ? 'text-green-600'
            : overall_score >= 50
                ? 'text-amber-600'
                : 'text-red-600';

    const scoreBg =
        overall_score >= 80
            ? 'bg-green-100'
            : overall_score >= 50
                ? 'bg-amber-100'
                : 'bg-red-100';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* Top Actions */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </button>

                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="text-indigo-600 hover:bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg font-medium disabled:opacity-50 text-sm flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Re-Analyze Page
                </button>
            </div>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">
                        Audit Results
                    </h2>
                    <p className="text-slate-500 font-mono text-sm">{url}</p>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="text-right">
                        <div className="text-sm text-slate-500 uppercase font-semibold">
                            Overall SEO Score
                        </div>
                        <div className={`text-4xl font-extrabold ${scoreColor}`}>
                            {overall_score}/100
                        </div>
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${scoreBg}`}>
                        <Gauge className={`w-8 h-8 ${scoreColor}`} />
                    </div>
                </div>
            </div>

            {/* Content Analysis */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                    Content Analysis
                </h3>

                <div className="grid gap-6">
                    {results.map((result, idx) => (
                        <ScoreCard
                            key={idx}
                            result={result}
                            fullContext={attributes}
                        />
                    ))}
                </div>
            </div>

            <hr className="my-8 border-slate-200" />

            {/* PageSpeed Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">
                        Page Performance
                    </h3>

                    {/* ALWAYS show buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => onRunPageSpeed('mobile')}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                        >
                            Run Mobile Audit
                        </button>

                        <button
                            onClick={() => onRunPageSpeed('desktop')}
                            disabled={loading}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                        >
                            Run Desktop Audit
                        </button>
                    </div>
                </div>

                {/* MOBILE RESULT */}
                {pageSpeedData?.mobile && (
                    <div className="mb-10">
                        <h4 className="text-lg font-bold text-slate-700 mb-3">
                            📱 Mobile Performance
                        </h4>
                        <PageSpeedResults data={pageSpeedData.mobile} />
                    </div>
                )}

                {/* DESKTOP RESULT */}
                {pageSpeedData?.desktop && (
                    <div>
                        <h4 className="text-lg font-bold text-slate-700 mb-3">
                            🖥 Desktop Performance
                        </h4>
                        <PageSpeedResults data={pageSpeedData.desktop} />
                    </div>
                )}

                {/* EMPTY STATE */}
                {!pageSpeedData?.mobile && !pageSpeedData?.desktop && (
                    <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                        <Gauge className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>
                            Run Mobile or Desktop audit to see Core Web Vitals and metrics.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
