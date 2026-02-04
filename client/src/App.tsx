import React, { useState } from 'react';

// Import các component trực tiếp từ thư mục src/
import Sidebar from './components/Sidebar'; 
import SearchBar from './components/SearchBar';
import NavigationTab from './components/NavigationTab';
import CardContainer from './components/CardContainer'; // Lưu ý chữ 'c' thường

const App: React.FC = () => {
  // Quản lý trạng thái category đang chọn (mặc định là all)
  const [activeTab, setActiveTab] = useState<string>('all');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* 1. Sidebar: Cố định bên trái, nhận hàm đổi tab */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Vùng nội dung chính: Bên phải, chia làm Header và Scroll Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 3. SearchBar: Cố định trên cùng */}
        <header className="flex-none">
          <SearchBar />
        </header>

        {/* 4. NavigationTab: Thanh tab ngang để đồng bộ với Sidebar */}
        <nav className="flex-none">
          <NavigationTab 
            activeTab={activeTab} 
            onTabChange={(tab) => setActiveTab(tab)} 
          />
        </nav>

        {/* 5. CardContainer: Vùng hiển thị nội dung có thể cuộn */}
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