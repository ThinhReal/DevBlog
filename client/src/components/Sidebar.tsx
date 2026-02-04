import React, { type Dispatch, type SetStateAction } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'all', label: 'All Topics', icon: '📚' },
    { id: 'dataStructure', label: 'Data Structure', icon: '🌲' },
    { id: 'algorithm', label: 'Algorithm', icon: '⚡' },
    { id: 'web', label: 'Web Development', icon: '🌐' },
    { id: 'git', label: 'Git & Github', icon: '📂' },
    { id: 'project', label: 'Personal Project', icon: '🚀' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">DevBlog</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span>{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;