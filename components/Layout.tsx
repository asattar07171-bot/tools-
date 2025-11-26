import React from 'react';
import { LayoutDashboard, TrendingUp, Search, Layers, Youtube, Menu, X } from 'lucide-react';
import { AnalysisTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AnalysisTab;
  onTabChange: (tab: AnalysisTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'zero-competition', label: 'Zero Competition', icon: Search },
    { id: 'trending', label: 'Trending (7 Days)', icon: TrendingUp },
    { id: 'ranking-titles', label: 'Ranking from Titles', icon: Layers },
    { id: 'niche-engine', label: 'Niche Engine', icon: LayoutDashboard },
  ] as const;

  const handleTabClick = (id: AnalysisTab) => {
    onTabChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-red-500 font-bold text-xl">
          <Youtube className="w-8 h-8" />
          <span>TubeRank</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:block
      `}>
        <div className="p-6 flex items-center gap-2 text-red-500 font-bold text-2xl border-b border-slate-700">
          <Youtube className="w-8 h-8" />
          <span>TubeRank</span>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium
                ${activeTab === item.id 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' 
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 text-xs text-slate-500 text-center border-t border-slate-700">
          Powered by Gemini 2.5 Flash
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
           {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;