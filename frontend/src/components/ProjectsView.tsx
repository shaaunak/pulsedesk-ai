import React, { useState } from 'react';
import {
  Search,
  Plus,
  Star,
  GitPullRequest,
  Mail,
  Layers,
  FileText,
  ArrowRight,
  MoreHorizontal,
  FolderKanban,
  Sparkles,
} from 'lucide-react';

interface ProjectsViewProps {
  onSelectProject?: (projectId: string) => void;
  onOpenCreateModal?: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onSelectProject,
  onOpenCreateModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    {
      id: 'alpha',
      name: 'Alpha',
      description: 'Main product workspace with core development and integrations.',
      starred: true,
      issues: 42,
      prs: 12,
      blockers: 3,
      lastUpdated: 'Updated 2m ago',
      iconBg: 'bg-blue-600',
      integrations: ['github', 'gmail', 'linear'],
      statusBadge: 'Staging',
    },
    {
      id: 'nutri-lens',
      name: 'Nutri Lens',
      description: 'Food label scanning app with AI ingredient analysis.',
      starred: false,
      issues: 18,
      prs: 5,
      blockers: 0,
      lastUpdated: 'Updated 1h ago',
      iconBg: 'bg-emerald-600',
      integrations: ['github', 'notion'],
      statusBadge: 'Development',
    },
    {
      id: 'playgrid',
      name: 'PlayGrid Sports',
      description: 'Sports community platform and analytics dashboard.',
      starred: false,
      issues: 12,
      prs: 4,
      blockers: 1,
      lastUpdated: 'Updated 3h ago',
      iconBg: 'bg-emerald-700',
      integrations: ['github', 'linear'],
      statusBadge: 'Active',
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Personal projects and experiments.',
      starred: false,
      issues: 8,
      prs: 2,
      blockers: 0,
      lastUpdated: 'Updated 1d ago',
      iconBg: 'bg-amber-600',
      integrations: ['github'],
      statusBadge: 'Planning',
    },
    {
      id: 'college',
      name: 'College Projects',
      description: 'Academic work and assignments.',
      starred: false,
      issues: 15,
      prs: 1,
      blockers: 0,
      lastUpdated: 'Updated 2d ago',
      iconBg: 'bg-indigo-600',
      integrations: ['github', 'gmail'],
      statusBadge: 'Active',
    },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'starred') return p.starred;
    if (searchQuery) return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  return (
    <div className="flex-1 flex flex-col gap-6 pb-28 pt-1 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage and explore your connected projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects... ⌘K"
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 w-48 sm:w-60 shadow-2xs"
            />
          </div>

          {/* New Project Button */}
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        {(['all', 'recent', 'starred'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer capitalize ${
              activeFilter === filter
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {filter === 'all' ? 'All Projects' : filter}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProject?.(p.id)}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all p-5 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              {/* Card Top: Icon, Name, Star */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${p.iconBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {p.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {p.statusBadge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Star
                    className={`w-4 h-4 ${
                      p.starred ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                  <MoreHorizontal className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed min-h-[36px] line-clamp-2">
                {p.description}
              </p>

              {/* Connected Source Icons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                {p.integrations.includes('github') && (
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700" title="GitHub">
                    <GitPullRequest className="w-3.5 h-3.5" />
                  </div>
                )}
                {p.integrations.includes('gmail') && (
                  <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center text-red-600" title="Gmail">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                )}
                {p.integrations.includes('linear') && (
                  <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600" title="Linear">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                )}
                {p.integrations.includes('notion') && (
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700" title="Notion">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-sm font-bold text-slate-900">{p.issues}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Issues</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-sm font-bold text-slate-900">{p.prs}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Open PRs</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`text-sm font-bold ${p.blockers > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    {p.blockers}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Blockers</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-slate-400">{p.lastUpdated}</span>
              <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}

        {/* New Project Card */}
        <div
          onClick={onOpenCreateModal}
          className="border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[260px] group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 text-slate-400 flex items-center justify-center transition-colors mb-3">
            <Plus className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            New Project
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[180px]">
            Connect sources and get intelligent insights.
          </p>
        </div>
      </div>
    </div>
  );
};
export default ProjectsView;
