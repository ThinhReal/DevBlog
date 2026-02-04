import React from 'react';

interface NavigationTabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationTab: React.FC<NavigationTabProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white px-8 border-b border-gray-200">
      <div className="flex space-x-8">
        <button className="py-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600 capitalize">
          {activeTab} Overview
        </button>
        {/* Có thể thêm các tab con như 'Favorites', 'Recently Read' ở đây */}
      </div>
    </div>
  );
};

export default NavigationTab;