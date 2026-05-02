import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UrlInput from './components/UrlInput';
import PageList from './components/PageList';
import Dashboard from './components/Dashboard';
import SiteAudit from './components/SiteAudit';

const API_BASE = "http://localhost:8000/api";

const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

function App() {
  // --- State Declarations ---
  const [step, setStep] = useState('input'); // input, select, dashboard, site-audit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data State
  const [pages, setPages] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [pageSpeedData, setPageSpeedData] = useState({});
  const [siteAuditData, setSiteAuditData] = useState(null);

  // Selection State
  const [selectedUrl, setSelectedUrl] = useState('');
  const [analyzedUrl, setAnalyzedUrl] = useState('');

  // Cache & History
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('seo_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [discoveryCache, setDiscoveryCache] = useState({});
  const [analysisCache, setAnalysisCache] = useState({});

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('seo_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleDiscover = async (url, forceRefresh = false) => {
    setLoading(true);
    setError('');

    // Update history if new
    if (!searchHistory.includes(url)) {
      setSearchHistory(prev => [url, ...prev].slice(0, 10)); // Keep last 10
    }

    // Check cache first
    const cached = discoveryCache[url];
    const isExpired = cached && (Date.now() - cached.timestamp > CACHE_DURATION);

    if (cached && !isExpired && !forceRefresh) {
      setPages(cached.data);
      setSelectedUrl(url);
      setStep('select');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/discover`, { url });
      setPages(res.data.pages);
      setDiscoveryCache(prev => ({
        ...prev,
        [url]: {
          data: res.data.pages,
          timestamp: Date.now()
        }
      }));
      setSelectedUrl(url);
      setStep('select');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to discover pages');
    } finally {
      setLoading(false);
    }
  };

  const handlePageSpeed = async (url, strategy = 'mobile') => {
    console.log(`[App] handlePageSpeed called for ${url} with strategy:`, strategy);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/pagespeed`, { url, strategy });
      setPageSpeedData(prev => ({
        ...prev,
        [strategy]: res.data
      }));

      // Update analysis cache with new pagespeed data
      setAnalysisCache(prev => ({
        ...prev,
        [url]: {
          ...(prev[url] || {}),
          pageSpeed: {
            ...(prev[url]?.pageSpeed || {}),
            [strategy]: res.data
          }
        }
      }));

    } catch (err) {
      console.error("PageSpeed Error:", err);
      setError(err.response?.data?.detail || "Failed to run PageSpeed audit. Please check your API key or try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAggregateSiteAudit = async () => {
    setLoading(true);
    try {
      // Run both mobile and desktop audits
      const [mobileRes, desktopRes] = await Promise.all([
        axios.post(`${API_BASE}/pagespeed`, { url: selectedUrl, strategy: 'mobile' }),
        axios.post(`${API_BASE}/pagespeed`, { url: selectedUrl, strategy: 'desktop' })
      ]);

      setSiteAuditData({
        mobile: mobileRes.data,
        desktop: desktopRes.data
      });
      setStep('site-audit');
    } catch (err) {
      setError('Failed to run complete site audit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (url, forceRefresh = false) => {
    setLoading(true);
    setAnalyzedUrl(url);
    setError('');

    if (forceRefresh) {
      setAnalysisData(null);
      setPageSpeedData({});
    }

    // Check cache
    const cached = analysisCache[url];
    const isExpired = cached && (Date.now() - cached.timestamp > CACHE_DURATION);

    if (cached && cached.analysis && !isExpired && !forceRefresh) {
      setAnalysisData(cached.analysis);
      setStep('dashboard');

      if (cached.pageSpeed) {
        setPageSpeedData(cached.pageSpeed || {});
        setLoading(false);
      } else {
        // If we have analysis but no pageSpeed, run pageSpeed
        handlePageSpeed(url, 'mobile');
      }
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/analyze`, { url });
      const newData = res.data;
      setAnalysisData(newData);

      // Update cache
      setAnalysisCache(prev => ({
        ...prev,
        [url]: {
          ...(prev[url] || {}), // preserve pageSpeed if exists and valid
          analysis: newData,
          timestamp: Date.now()
        }
      }));

      setStep('dashboard');

      // Auto-run PageSpeed immediately after
      handlePageSpeed(url, 'mobile');

    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed');
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'dashboard' || step === 'site-audit') {
      setStep('select');
      setAnalysisData(null);
      setPageSpeedData({});
      setAnalyzedUrl('');
    } else if (step === 'select') {
      setStep('input');
      setPages([]);
      setSelectedUrl('');
    }
  };

  const reset = () => {
    setStep('input');
    setPages([]);
    setAnalysisData(null);
    setPageSpeedData({});
    setSelectedUrl('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2 cursor-pointer" onClick={reset}>
            <span className="text-2xl">✨</span> DIY SEO Optimizer
          </h1>
          {step !== 'input' && (
            <button onClick={reset} className="text-sm text-slate-500 hover:text-indigo-600">
              Back to Home
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        {step === 'input' && (
          <UrlInput
            onDiscover={handleDiscover}
            loading={loading}
            history={searchHistory}
          />
        )}

        {step === 'select' && (
          <PageList
            pages={pages}
            onSelect={handleAnalyze}
            loading={loading}
            onBack={handleBack}
            onSiteAudit={handleAggregateSiteAudit}
            onRefresh={() => handleDiscover(selectedUrl, true)}
          />
        )}

        {step === 'dashboard' && analysisData && (
          <Dashboard
            data={analysisData}
            url={analyzedUrl}
            pageSpeedData={pageSpeedData}
            onRunPageSpeed={(strategy) => handlePageSpeed(analyzedUrl, strategy)}
            loading={loading}
            onBack={handleBack}
            onRefresh={() => handleAnalyze(analyzedUrl, true)}
          />
        )}

        {step === 'site-audit' && siteAuditData && (
          <SiteAudit
            mobileData={siteAuditData.mobile}
            desktopData={siteAuditData.desktop}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}

export default App;
