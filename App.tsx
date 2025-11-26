import React, { useState } from 'react';
import Layout from './components/Layout';
import { AnalysisTab, AppState, MOCK_CHART_DATA } from './types';
import { analyzeCompetition, findTrendingKeywords, extractRankingKeywords, analyzeNiche } from './services/geminiService';
import { CompetitionView, TrendingView, RankingView, NicheView } from './components/AnalysisViews';
import { Search, Loader2, Download, ExternalLink } from 'lucide-react';

const INITIAL_STATE: AppState = {
  activeTab: 'zero-competition',
  isLoading: false,
  error: null,
  keywordInput: '',
  nicheInput: 'Psychology',
  titlesInput: '',
  competitionResult: null,
  trendingResults: [],
  rankingResults: [],
  nicheResults: null,
  groundingSources: [],
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const handleTabChange = (tab: AnalysisTab) => {
    setState(prev => ({ ...prev, activeTab: tab, error: null, groundingSources: [] }));
  };

  const handleAction = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null, groundingSources: [] }));
    try {
      let result;
      switch (state.activeTab) {
        case 'zero-competition':
          if (!state.keywordInput) throw new Error("Please enter a keyword");
          result = await analyzeCompetition(state.keywordInput);
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            competitionResult: result.data, 
            groundingSources: result.sources 
          }));
          break;
        case 'trending':
          if (!state.nicheInput) throw new Error("Please enter a niche");
          result = await findTrendingKeywords(state.nicheInput);
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            trendingResults: result.data, 
            groundingSources: result.sources 
          }));
          break;
        case 'ranking-titles':
          if (!state.titlesInput) throw new Error("Please paste some video titles");
          result = await extractRankingKeywords(state.titlesInput);
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            rankingResults: result.data, 
            groundingSources: result.sources 
          }));
          break;
        case 'niche-engine':
          if (!state.nicheInput) throw new Error("Please enter a niche");
          result = await analyzeNiche(state.nicheInput);
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            nicheResults: result.data, 
            groundingSources: result.sources 
          }));
          break;
      }
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || "An error occurred while fetching data from Gemini." 
      }));
    }
  };

  const exportData = () => {
    // Simple CSV export simulation
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Export Date,${new Date().toISOString()}\n`
      + `Module,${state.activeTab}\n`;
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tuberank_export_${state.activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderInputSection = () => {
    switch (state.activeTab) {
      case 'zero-competition':
        return (
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter a keyword (e.g. 'vegan recipes for beginners')"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
              value={state.keywordInput}
              onChange={(e) => setState(prev => ({ ...prev, keywordInput: e.target.value }))}
            />
          </div>
        );
      case 'trending':
      case 'niche-engine':
        return (
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none w-full md:w-1/3"
              value={state.nicheInput}
              onChange={(e) => setState(prev => ({ ...prev, nicheInput: e.target.value }))}
            >
              <option value="Psychology">Psychology</option>
              <option value="Fitness">Fitness</option>
              <option value="Finance">Finance</option>
              <option value="Tech">Tech / Coding</option>
              <option value="Gaming">Gaming</option>
              <option value="Vlog">Vlog / Lifestyle</option>
            </select>
            <input
              type="text"
              placeholder="Or type a custom niche..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
              value={state.nicheInput}
              onChange={(e) => setState(prev => ({ ...prev, nicheInput: e.target.value }))}
            />
          </div>
        );
      case 'ranking-titles':
        return (
          <textarea
            placeholder="Paste 5-20 video titles here (one per line)..."
            className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
            value={state.titlesInput}
            onChange={(e) => setState(prev => ({ ...prev, titlesInput: e.target.value }))}
          />
        );
    }
  };

  const renderContent = () => {
    if (state.isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-red-500" />
          <p className="animate-pulse">Analyzing YouTube Data...</p>
          <p className="text-xs mt-2 text-slate-500">Searching Google & Processing Results</p>
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-xl text-center">
            <h3 className="text-red-400 font-bold mb-2">Analysis Failed</h3>
            <p className="text-red-200 text-sm">{state.error}</p>
        </div>
      );
    }

    if (state.activeTab === 'zero-competition' && state.competitionResult) {
      return <CompetitionView data={state.competitionResult} />;
    }
    if (state.activeTab === 'trending' && state.trendingResults.length > 0) {
      return <TrendingView data={state.trendingResults} />;
    }
    if (state.activeTab === 'ranking-titles' && state.rankingResults.length > 0) {
      return <RankingView data={state.rankingResults} />;
    }
    if (state.activeTab === 'niche-engine' && state.nicheResults) {
      return <NicheView data={state.nicheResults} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
        <Search className="w-12 h-12 mb-4 opacity-50" />
        <p>Enter data above and click Analyze to start</p>
      </div>
    );
  };

  return (
    <Layout activeTab={state.activeTab} onTabChange={handleTabChange}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-1">
                {state.activeTab === 'zero-competition' && 'Zero Competition Finder'}
                {state.activeTab === 'trending' && 'Trending Keywords (7 Days)'}
                {state.activeTab === 'ranking-titles' && 'Title Keyword Extractor'}
                {state.activeTab === 'niche-engine' && 'Niche Strategy Engine'}
            </h1>
            <p className="text-slate-400 text-sm">
                Powered by Gemini 2.5 Flash Search Grounding
            </p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={exportData}
                disabled={!state.competitionResult && !state.trendingResults.length && !state.rankingResults.length && !state.nicheResults}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Download className="w-4 h-4" />
                Export
            </button>
        </div>
      </header>

      {/* Input Area */}
      <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 mb-8 shadow-inner">
        <div className="mb-4">
            {renderInputSection()}
        </div>
        <div className="flex justify-end">
            <button
                onClick={handleAction}
                disabled={state.isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-red-900/50 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {state.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Analyze Now
            </button>
        </div>
      </section>

      {/* Results Area */}
      <section>
        {renderContent()}
      </section>

      {/* Source Grounding */}
      {state.groundingSources.length > 0 && (
          <section className="mt-8 pt-6 border-t border-slate-800">
              <h4 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Data Sources (Search Grounding)</h4>
              <div className="flex flex-wrap gap-2">
                  {state.groundingSources.map((source, i) => (
                      <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-blue-400 transition-colors truncate max-w-xs"
                      >
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate">{source.title}</span>
                      </a>
                  ))}
              </div>
          </section>
      )}
    </Layout>
  );
};

export default App;