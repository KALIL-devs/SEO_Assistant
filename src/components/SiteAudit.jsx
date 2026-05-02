import React, { useState } from 'react';
import { ArrowLeft, Smartphone, Monitor } from 'lucide-react';
import PageSpeedResults from './PageSpeedResults';

export default function SiteAudit({ mobileData, desktopData, onBack }) {
    const [activeTab, setActiveTab] = useState('mobile');

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to List
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Comprehensive Site Audit</h2>
                <p className="text-slate-500">Comprehensive performance analysis for Mobile and Desktop strategies.</p>

                <div className="mt-6 flex gap-2 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('mobile')}
                        className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors border-b-2 ${activeTab === 'mobile'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Smartphone className="w-4 h-4" />
                        Mobile
                    </button>
                    <button
                        onClick={() => setActiveTab('desktop')}
                        className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors border-b-2 ${activeTab === 'desktop'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Monitor className="w-4 h-4" />
                        Desktop
                    </button>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === 'mobile' && (
                    <div className="animate-in fade-in duration-300">
                        <PageSpeedResults data={mobileData} />
                    </div>
                )}
                {activeTab === 'desktop' && (
                    <div className="animate-in fade-in duration-300">
                        <PageSpeedResults data={desktopData} />
                    </div>
                )}
            </div>
        </div>
    );
}
