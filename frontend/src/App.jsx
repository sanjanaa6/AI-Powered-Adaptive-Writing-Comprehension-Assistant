import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Overview from './components/Overview';
import RagEngineView from './components/RagEngineView';
import StyleTransformer from './components/StyleTransformer';
import OriginalityAuditor from './components/OriginalityAuditor';
import EssayCritiqueView from './components/EssayCritiqueView';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch system stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-dark-mesh bg-grid-pattern flex flex-col text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        setIsSettingsOpen={setIsSettingsOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Workspace View */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {activeTab === 'overview' && <Overview stats={stats} onNavigate={setActiveTab} />}
        {activeTab === 'rag' && <RagEngineView stats={stats} refreshStats={fetchStats} />}
        {activeTab === 'style' && <StyleTransformer stats={stats} />}
        {activeTab === 'originality' && <OriginalityAuditor />}
        {activeTab === 'critique' && <EssayCritiqueView />}
      </main>

      {/* System Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        stats={stats} 
        refreshStats={fetchStats} 
      />
    </div>
  );
}


