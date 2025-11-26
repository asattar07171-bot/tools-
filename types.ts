export type AnalysisTab = 'zero-competition' | 'trending' | 'ranking-titles' | 'niche-engine';

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface CompetitionData {
  keyword: string;
  competitionScore: number; // 0-100
  searchVolumeEstimate: string;
  videoCount: string;
  topChannels: string[];
  avgViews: string;
  difficultyLabel: 'Low' | 'Medium' | 'High' | 'Zero';
  opportunityAnalysis: string;
}

export interface TrendingKeyword {
  keyword: string;
  growthPercentage: number;
  searchVolume: string;
  relatedQueries: string[];
  trendGraphData: { day: string; value: number }[]; // 7 days data points
}

export interface RankingKeyword {
  term: string;
  score: number; // 0-100 relevance/power
  category: 'High Volume' | 'High CTR' | 'SEO Power' | 'Trending';
  occurrence: number;
}

export interface NicheIdea {
  title: string;
  topic: string;
  viralPotential: 'High' | 'Medium' | 'Low';
  reasoning: string;
}

export interface AppState {
  activeTab: AnalysisTab;
  isLoading: boolean;
  error: string | null;
  // Inputs
  keywordInput: string;
  nicheInput: string;
  titlesInput: string;
  // Results
  competitionResult: CompetitionData | null;
  trendingResults: TrendingKeyword[];
  rankingResults: RankingKeyword[];
  nicheResults: {
    trends: TrendingKeyword[];
    ideas: NicheIdea[];
    topChannels: string[];
  } | null;
  groundingSources: GroundingSource[];
}

export const MOCK_CHART_DATA = [
  { day: 'Mon', value: 20 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 30 },
  { day: 'Thu', value: 80 },
  { day: 'Fri', value: 65 },
  { day: 'Sat', value: 90 },
  { day: 'Sun', value: 100 },
];