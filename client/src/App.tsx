import React, { useState } from 'react';

// Import các component trực tiếp từ thư mục src/
import Sidebar from './components/Sidebar'; 
import SearchBar from './components/SearchBar';
import NavigationTab from './components/NavigationTab';
import CardContainer from './components/CardContainer'; 

const App: React.FC = () => {
  // Quản lý trạng thái category đang chọn (mặc định là all)
  const [activeTab, setActiveTab] = useState<string>('all');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">  
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-none">
          <SearchBar />
        </header>
        <nav className="flex-none">
          <NavigationTab 
            activeTab={activeTab} 
            onTabChange={(tab) => setActiveTab(tab)} 
          />
        </nav>
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <CardContainer category={activeTab} />
          </div>
        </main>

      </div>
    </div>
  );
};

export default App;