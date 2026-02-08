import React, { type Dispatch, type SetStateAction } from 'react';
import { 
  LayoutGrid, 
  TreePine, 
  Zap, 
  Globe, 
  FolderCode, 
  Rocket, 
  Terminal 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'all', label: 'All Topics', icon: <LayoutGrid size={18} /> },
    { id: 'dataStructure', label: 'Data Structure', icon: <TreePine size={18} /> },
    { id: 'algorithm', label: 'Algorithm', icon: <Zap size={18} /> },
    { id: 'web', label: 'Web Development', icon: <Globe size={18} /> },
    { id: 'git', label: 'Git & Github', icon: <FolderCode size={18} /> },
    { id: 'project', label: 'Personal Project', icon: <Rocket size={18} /> },
  ];

  return (
    <aside className="w-64 bg-sidebar-bg border-r border-border flex flex-col h-full transition-colors duration-300">
      {/* Logo Section */}
      <div className="p-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-brand p-2 rounded-xl shadow-lg shadow-brand/20">
            <Terminal size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-main leading-none">DevBlog</h1>
            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">Master DSA</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5">
        <p className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4">Menu</p>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-text-muted hover:bg-white/5 hover:text-text-main'
            }`}
          >
            <span className={`${activeTab === item.id ? 'text-white' : 'text-brand'}`}>
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Sidebar (Optional) */}
      <div className="p-4 mt-auto border-t border-border/50">
        <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10">
          <p className="text-[11px] text-text-muted leading-relaxed">
            Học tập mỗi ngày để trở thành phiên bản tốt hơn.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;