import React from 'react';
import { CompetitionData, TrendingKeyword, RankingKeyword, NicheIdea } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpRight, BarChart3, Download, ExternalLink, Zap, TrendingUp } from 'lucide-react';

// --- Zero Competition View ---
export const CompetitionView: React.FC<{ data: CompetitionData }> = ({ data }) => {
  const getScoreColor = (score: number) => {
    if (score < 20) return 'text-green-400';
    if (score < 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGaugeColor = (score: number) => {
      if (score < 20) return 'bg-green-500';
      if (score < 50) return 'bg-yellow-500';
      return 'bg-red-500';
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl col-span-1 md:col-span-2">
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Competition Score</h3>
            <div className="flex items-end gap-4 mb-4">
                <span className={`text-6xl font-bold ${getScoreColor(data.competitionScore)}`}>{data.competitionScore}</span>
                <span className="text-slate-500 text-lg mb-2">/ 100</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold bg-slate-900 ${getScoreColor(data.competitionScore)} border border-slate-700 mb-2`}>
                    {data.difficultyLabel}
                </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-4 mb-6 relative overflow-hidden">
                 <div 
                    className={`h-full ${getGaugeColor(data.competitionScore)} transition-all duration-1000 ease-out`}
                    style={{ width: `${data.competitionScore}%` }}
                 />
            </div>
            <div>
                <h4 className="text-white font-medium mb-2">Analysis</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{data.opportunityAnalysis}</p>
            </div>
        </div>

        <div className="space-y-6">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Search Volume</h3>
                <p className="text-2xl font-bold text-white">{data.searchVolumeEstimate}</p>
             </div>
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Video Count</h3>
                <p className="text-2xl font-bold text-white">{data.videoCount}</p>
             </div>
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Avg Views (Top 10)</h3>
                <p className="text-2xl font-bold text-white">{data.avgViews}</p>
             </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">Top Ranking Channels</h3>
        <div className="flex flex-wrap gap-3">
            {data.topChannels.map((channel, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    {channel}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};


// --- Trending View ---
export const TrendingView: React.FC<{ data: TrendingKeyword[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
        {data.map((item, idx) => (
            <div key={idx} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-4">
                        <div className="flex items-center gap-2 mb-2">
                             <TrendingUp className="w-5 h-5 text-green-400" />
                             <span className="text-green-400 font-bold text-sm">+{item.growthPercentage}% Growth</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{item.keyword}</h3>
                        <p className="text-slate-400 text-sm mb-4">Vol: {item.searchVolume}</p>
                        <div className="flex flex-wrap gap-2">
                            {item.relatedQueries.map((q, i) => (
                                <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{q}</span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="md:col-span-8 h-48 w-full bg-slate-900/50 rounded-lg p-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={item.trendGraphData}>
                                <defs>
                                    <linearGradient id={`colorValue-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" hide />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#ef4444" fillOpacity={1} fill={`url(#colorValue-${idx})`} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        ))}
    </div>
  );
};

// --- Ranking View ---
export const RankingView: React.FC<{ data: RankingKeyword[] }> = ({ data }) => {
    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-medium">Keyword Term</th>
                            <th className="p-4 font-medium">Category</th>
                            <th className="p-4 font-medium">Power Score</th>
                            <th className="p-4 font-medium text-right">Occurrence</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                                <td className="p-4 text-white font-medium">{row.term}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold
                                        ${row.category === 'High Volume' ? 'bg-blue-500/20 text-blue-400' : 
                                          row.category === 'Trending' ? 'bg-green-500/20 text-green-400' :
                                          row.category === 'High CTR' ? 'bg-purple-500/20 text-purple-400' :
                                          'bg-slate-600/20 text-slate-400'}
                                    `}>
                                        {row.category}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-full max-w-[100px] h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-red-500 rounded-full"
                                                style={{ width: `${row.score}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-slate-300">{row.score}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right text-slate-400">{row.occurrence}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Niche View ---
export const NicheView: React.FC<{ data: { trends: TrendingKeyword[], ideas: NicheIdea[], topChannels: string[] } }> = ({ data }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Viral Ideas */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap className="text-yellow-400" />
                        Viral Video Ideas
                    </h3>
                    <div className="space-y-4">
                        {data.ideas.map((idea, idx) => (
                            <div key={idx} className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase">{idea.topic}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${idea.viralPotential === 'High' ? 'bg-red-500 text-white' : 'bg-slate-600 text-slate-300'}`}>
                                        {idea.viralPotential} Potential
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">"{idea.title}"</h4>
                                <p className="text-sm text-slate-400">{idea.reasoning}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Channels & Quick Trends */}
                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                             <BarChart3 className="text-blue-400" />
                             Top Channels
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {data.topChannels.map((c, i) => (
                                <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200">
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                             <TrendingUp className="text-green-400" />
                             Sub-Topic Trends
                        </h3>
                         <div className="bg-slate-800 rounded-xl border border-slate-700 divide-y divide-slate-700">
                            {data.trends.map((t, i) => (
                                <div key={i} className="p-4 flex justify-between items-center">
                                    <span className="text-white font-medium">{t.keyword}</span>
                                    <span className="text-green-400 text-sm font-bold">+{t.growthPercentage}%</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};