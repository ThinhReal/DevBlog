import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { KnowledgeCard } from './components/KnowledgeCard';

export interface KnowledgeItem {
  id: string;
  title: string;
  snippet: string;
  tags: string[];
  progress: number;
  category: string;
}

const mockData: KnowledgeItem[] = [
  {
    id: '1',
    title: 'Binary Search Trees',
    snippet: 'Understanding the fundamentals of BST operations including insertion, deletion, and traversal methods.',
    tags: ['Java', 'Data Structures'],
    progress: 85,
    category: 'Data Structures'
  },
  {
    id: '2',
    title: 'Dynamic Programming Patterns',
    snippet: 'Common DP patterns: memoization, tabulation, and state optimization techniques for solving complex problems.',
    tags: ['Algorithms', 'Python'],
    progress: 60,
    category: 'Algorithms'
  },
  {
    id: '3',
    title: 'React Server Components',
    snippet: 'Deep dive into RSC architecture, streaming, and the new paradigm for building React applications.',
    tags: ['React', 'TypeScript', 'Next.js'],
    progress: 75,
    category: 'Web Development'
  },
  {
    id: '4',
    title: 'Git Rebase vs Merge',
    snippet: 'When to use rebase for a clean history and when merge is the better option for collaboration.',
    tags: ['Git', 'Version Control'],
    progress: 90,
    category: 'Git'
  },
  {
    id: '5',
    title: 'Hash Tables Implementation',
    snippet: 'Building a hash table from scratch: collision resolution, load factor, and performance optimization.',
    tags: ['Data Structures', 'Java'],
    progress: 70,
    category: 'Data Structures'
  },
  {
    id: '6',
    title: 'Graph Traversal Algorithms',
    snippet: 'BFS and DFS implementations with real-world applications in network routing and social graphs.',
    tags: ['Algorithms', 'Python', 'Graphs'],
    progress: 55,
    category: 'Algorithms'
  },
  {
    id: '7',
    title: 'TypeScript Advanced Types',
    snippet: 'Conditional types, mapped types, and template literal types for building type-safe APIs.',
    tags: ['TypeScript', 'Web Development'],
    progress: 80,
    category: 'Web Development'
  },
  {
    id: '8',
    title: 'E-commerce Platform',
    snippet: 'Full-stack marketplace with payment integration, real-time inventory, and admin dashboard.',
    tags: ['React', 'Node.js', 'MongoDB'],
    progress: 45,
    category: 'Personal Projects'
  },
  {
    id: '9',
    title: 'Git Branching Strategies',
    snippet: 'GitFlow, GitHub Flow, and trunk-based development: choosing the right workflow for your team.',
    tags: ['Git', 'DevOps'],
    progress: 95,
    category: 'Git'
  },
  {
    id: '10',
    title: 'Linked List Operations',
    snippet: 'Mastering linked list manipulations: reversal, cycle detection, and merge operations.',
    tags: ['Data Structures', 'Java'],
    progress: 88,
    category: 'Data Structures'
  },
  {
    id: '11',
    title: 'WebSocket Real-time Apps',
    snippet: 'Building real-time features with WebSockets, Socket.io, and handling connection states.',
    tags: ['Web Development', 'Node.js', 'React'],
    progress: 65,
    category: 'Web Development'
  },
  {
    id: '12',
    title: 'AI Task Automation Tool',
    snippet: 'Python-based automation framework with machine learning for intelligent task scheduling.',
    tags: ['Python', 'AI', 'Automation'],
    progress: 30,
    category: 'Personal Projects'
  }
];

const categories = [
  'All Topics',
  'Data Structures',
  'Algorithms',
  'Web Development',
  'Git',
  'Personal Projects'
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = mockData.filter(item => {
    const matchesCategory = selectedCategory === 'All Topics' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="flex">
        <Sidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <main className="flex-1 ml-64">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <div className="p-8 pt-28">
            <div className="mb-8">
              <h1 className="text-4xl mb-2 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {selectedCategory}
              </h1>
              <p className="text-gray-400">
                {filteredData.length} {filteredData.length === 1 ? 'topic' : 'topics'} found
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredData.map(item => (
                <KnowledgeCard key={item.id} item={item} />
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No topics found matching your criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
