import React, { useState } from 'react';
import { Gauge, Smartphone, Monitor, AlertTriangle, CheckCircle, Clock, Zap, Layers, Image as ImageIcon, FileCode, Check } from 'lucide-react';

const ScoreGauge = ({ score, label, icon: Icon }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    let color = 'text-red-500';
    if (score >= 90) color = 'text-emerald-500';
    else if (score >= 50) color = 'text-amber-500';

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        className="stroke-slate-200"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        className={`transition-all duration-1000 ease-out ${color}`}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`text-2xl font-bold ${color}`}>{score}</span>
                </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-slate-600 font-medium text-sm">
                {Icon && <Icon className="w-4 h-4" />}
                {label}
            </div>
        </div>
    );
};

const MetricDistribution = ({ label, value, distribution }) => {
    // distribution: [{min, max, proportion}, ...] for Good, Needs Improvement, Poor
    // usually 3 items sorted by thresholds.
    // proportions sum to ~1.0.

    if (!distribution || distribution.length === 0) return null;

    const good = (distribution[0]?.proportion || 0) * 100;
    const needs = (distribution[1]?.proportion || 0) * 100;
    const poor = (distribution[2]?.proportion || 0) * 100;

    return (
        <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <span className="text-sm font-mono text-slate-500">{value}</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${good}%` }} className="bg-emerald-500 h-full" title={`Good: ${good.toFixed(1)}%`} />
                <div style={{ width: `${needs}%` }} className="bg-amber-400 h-full" title={`Needs Improvement: ${needs.toFixed(1)}%`} />
                <div style={{ width: `${poor}%` }} className="bg-red-500 h-full" title={`Poor: ${poor.toFixed(1)}%`} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Good ({good.toFixed(0)}%)</span>
                <span>Poor ({poor.toFixed(0)}%)</span>
            </div>
        </div>
    );
};

const ResourceBar = ({ label, size, count, maxVal }) => {
    const width = Math.max((size / maxVal) * 100, 1);
    const formatSize = (bytes) => {
        if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        return `${(bytes / 1024).toFixed(0)} KB`;
    };

    return (
        <div className="flex items-center gap-3 text-sm py-2 border-b border-slate-50 last:border-0">
            <div className="w-24 truncate font-medium text-slate-600" title={label}>{label}</div>
            <div className="flex-1">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${width}%` }} />
                </div>
            </div>
            <div className="w-20 text-right font-mono text-slate-500 text-xs">{formatSize(size)}</div>
            <div className="w-12 text-right text-slate-400 text-xs">{count} req</div>
        </div>
    );
};

const OpportunityItem = ({ op }) => (
    <div className="flex items-start gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
        <div className="mt-1">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:bg-amber-200 transition-colors">
                <AlertTriangle className="w-5 h-5" />
            </div>
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-slate-800 text-sm">{op.title}</h4>
            <div className="text-slate-600 text-xs mt-1 leading-relaxed">{op.description}</div>
            {op.estimated_savings > 0 && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold border border-emerald-100">
                    <Clock className="w-3 h-3" />
                    Save ~{Math.round(op.estimated_savings)} ms
                </div>
            )}
        </div>
    </div>
);

export default function PageSpeedResults({ data }) {
    if (!data) return null;

    const {
        strategy,
        core_web_vitals,
        cwv_distributions,
        lab_metrics,
        opportunities,
        diagnostics,
        seo_checks,
        best_practices_score,
        accessibility_score,
        final_screenshot,
        resource_summary
    } = data;

    const performanceScore = lab_metrics["Performance Score"];

    // Find max size for simple scaling of bars
    const maxResourceSize = resource_summary ? Math.max(...resource_summary.map(r => r.transferSize), 0) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* --- HERO SECTION --- */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Visual Preview */}
                <div className="lg:col-span-1 flex justify-center items-start">
                    <div className={`relative bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 ${strategy === 'mobile' ? 'w-[280px]' : 'w-full max-w-md aspect-video rounded-xl'}`}>
                        {/* Notch/Camera for mobile */}
                        {strategy === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-800 rounded-b-xl z-10" />}

                        <div className={`overflow-hidden bg-white w-full h-full ${strategy === 'mobile' ? 'rounded-[2rem]' : 'rounded-lg'}`}>
                            {final_screenshot ? (
                                <img src={final_screenshot} alt="Page Screenshot" className="w-full h-full object-cover object-top" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Scores */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <span className={`p-2 rounded-lg ${strategy === 'mobile' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                                {strategy === 'mobile' ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                            </span>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Audit Report</h3>
                                <p className="text-slate-500 text-sm">Generated just now</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
                        <ScoreGauge score={performanceScore} label="Performance" icon={Zap} />
                        <ScoreGauge score={accessibility_score} label="Accessibility" icon={CheckCircle} />
                        <ScoreGauge score={best_practices_score} label="Best Practices" icon={Layers} />
                        <ScoreGauge score={seo_checks["SEO Score"]} label="SEO" icon={FileCode} />
                    </div>
                </div>
            </div>

            {/* --- DETAILED METRICS GRID --- */}
            <div className="grid md:grid-cols-2 gap-8">

                {/* Core Web Vitals (Real User Data) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <h3 className="font-bold text-lg">Core Web Vitals</h3>
                        <span className="ml-auto text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">
                            {core_web_vitals["Field Source"] === 'origin' ? 'Origin Data' : 'Field Data (Crux)'}
                        </span>
                    </div>

                    {cwv_distributions && Object.values(cwv_distributions).some(d => d) ? (
                        <div className="space-y-1">
                            <MetricDistribution
                                label="Largest Contentful Paint (LCP)"
                                value={core_web_vitals["LCP (p75)"] || 'N/A'}
                                distribution={cwv_distributions["LCP"]}
                            />
                            <MetricDistribution
                                label="Cumulative Layout Shift (CLS)"
                                value={core_web_vitals["CLS (p75)"] || 'N/A'}
                                distribution={cwv_distributions["CLS"]}
                            />
                            <MetricDistribution
                                label="Interaction to Next Paint (INP)"
                                value={core_web_vitals["INP (p75)"] || 'N/A'}
                                distribution={cwv_distributions["INP"]}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <Zap className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            No field data available.
                        </div>
                    )}
                </div>

                {/* Lab Metrics */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold text-lg">Lab Metrics</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Total Blocking Time</div>
                            <div className="text-2xl font-bold text-slate-800">{lab_metrics["TBT"]}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Speed Index</div>
                            <div className="text-2xl font-bold text-slate-800">{lab_metrics["SI"]}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">LCP (Lab)</div>
                            <div className="text-2xl font-bold text-slate-800">{lab_metrics["LCP (Lab)"]}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">CLS (Lab)</div>
                            <div className="text-2xl font-bold text-slate-800">{lab_metrics["CLS (Lab)"]}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- OPPORTUNITIES & RESOURCES --- */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* FIXES */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Optimization Opportunities
                        </h3>
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold">{opportunities.length} Issues</span>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                        {opportunities.slice(0, 10).map((op, idx) => (
                            <OpportunityItem key={idx} op={op} />
                        ))}
                        {opportunities.length === 0 && (
                            <div className="p-12 text-center text-slate-500">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <p>Great job! No major opportunities found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RESOURCES */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-slate-500" />
                        Resource Summary
                    </h3>

                    {resource_summary && resource_summary.length > 0 ? (
                        <div className="space-y-1">
                            {resource_summary.map((res, i) => (
                                <ResourceBar
                                    key={i}
                                    label={res.label}
                                    size={res.transferSize}
                                    count={res.requestCount}
                                    maxVal={maxResourceSize}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-slate-400">No resource usage data available.</div>
                    )}

                    {/* Simple Diagnostic Stats */}
                    <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-xs text-slate-400 uppercase font-semibold">DOM Nodes</div>
                            <div className="text-xl font-bold text-slate-700">{diagnostics[0]?.["DOM Nodes"] || 'N/A'}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-400 uppercase font-semibold">Main Thread</div>
                            <div className="text-xl font-bold text-slate-700">{Math.round(diagnostics[0]?.["Main Thread Time (ms)"] || 0)}ms</div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
