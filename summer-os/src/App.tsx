import { useState, createContext, useContext } from 'react';
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  BookOpen,
  Bot,
  Brain,
  Settings,
} from 'lucide-react';
import { AppProvider } from './context/AppContext';
import { useApp } from './hooks/useApp';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast';
import { ParticleField } from './components/ParticleField';
import { Overview } from './sections/Overview';
import { HealthHub } from './sections/HealthHub';
import { BusinessCommand } from './sections/BusinessCommand';
import { StudyHub } from './sections/StudyHub';
import { AIOperations } from './sections/AIOperations';
import { SecondBrain } from './sections/SecondBrain';
import { SettingsPanel } from './sections/Settings';
import { exportState, importState } from './utils/localStorage';
import { hexToRgba } from './utils/colors';

type Section =
  | 'overview'
  | 'health'
  | 'business'
  | 'study'
  | 'ai'
  | 'brain'
  | 'settings';

interface ToastContextValue {
  showToast: (msg: string) => void;
}

export const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });
export function useShowToast() {
  return useContext(ToastContext).showToast;
}

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType; accent: string }[] = [
  { id: 'overview',  label: 'Overview',     icon: LayoutDashboard, accent: '#f1f5f9' },
  { id: 'health',    label: 'Health Hub',   icon: Activity,        accent: '#10b981' },
  { id: 'business',  label: 'Business',     icon: TrendingUp,      accent: '#f59e0b' },
  { id: 'study',     label: 'Study Hub',    icon: BookOpen,        accent: '#3b82f6' },
  { id: 'ai',        label: 'AI Ops',       icon: Bot,             accent: '#8b5cf6' },
  { id: 'brain',     label: 'Second Brain', icon: Brain,           accent: '#06b6d4' },
];

function Sidebar({
  active,
  onSelect,
  collapsed,
}: {
  active: Section;
  onSelect: (s: Section) => void;
  collapsed: boolean;
}) {
  return (
    <aside
      className="flex flex-col bg-surface border-r border-white/5 h-full flex-shrink-0"
      style={{ width: collapsed ? 60 : 220, zIndex: 10, position: 'relative' }}
    >
      {!collapsed && (
        <div className="px-5 py-5 border-b border-white/5">
          <span className="text-light font-bold text-sm tracking-widest uppercase">Summer OS</span>
          <span className="text-dim text-xs block mt-0.5">2026</span>
        </div>
      )}
      {collapsed && <div className="h-[68px] border-b border-white/5" />}

      <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-150 w-full text-left group relative"
              style={
                isActive
                  ? {
                      backgroundColor: hexToRgba(item.accent, 0.2),
                      color: item.accent,
                    }
                  : {}
              }
            >
              <Icon
                size={16}
                className="flex-shrink-0"
                style={{
                  color: isActive ? item.accent : '#94a3b8',
                  filter: isActive ? `drop-shadow(0 0 6px ${item.accent})` : undefined,
                }}
              />
              {!collapsed && (
                <span style={{ color: isActive ? item.accent : '#94a3b8' }}>
                  {item.label}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-card text-light text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="py-3 px-2 border-t border-white/5">
        <button
          onClick={() => onSelect('settings')}
          title={collapsed ? 'Settings' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-150 w-full text-left group relative"
          style={
            active === 'settings'
              ? { backgroundColor: hexToRgba('#94a3b8', 0.2), color: '#94a3b8' }
              : {}
          }
        >
          <Settings
            size={16}
            className="flex-shrink-0"
            style={{ color: active === 'settings' ? '#94a3b8' : '#64748b' }}
          />
          {!collapsed && (
            <span style={{ color: active === 'settings' ? '#94a3b8' : '#64748b' }}>
              Settings
            </span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-card text-light text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Settings
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}

function AppInner() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const { toasts, showToast } = useToast();
  const { state, dispatch } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleExport = () => {
    exportState(state);
    showToast('Backup downloaded');
  };

  const handleImport = async (file: File) => {
    try {
      const imported = await importState(file);
      dispatch({ type: 'LOAD_STATE', state: imported });
      showToast('Data imported successfully');
    } catch {
      showToast('Import failed — invalid file');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all data? This cannot be undone.')) {
      dispatch({ type: 'RESET_STATE' });
      showToast('Data reset to defaults');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':  return <Overview onNavigate={setActiveSection} />;
      case 'health':    return <HealthHub />;
      case 'business':  return <BusinessCommand />;
      case 'study':     return <StudyHub />;
      case 'ai':        return <AIOperations />;
      case 'brain':     return <SecondBrain />;
      case 'settings':  return (
        <SettingsPanel
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
        />
      );
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="flex h-full bg-deep" style={{ position: 'relative' }}>
        <ParticleField />

        <div className="hidden md:block h-full" style={{ position: 'relative', zIndex: 10 }}>
          <Sidebar
            active={activeSection}
            onSelect={setActiveSection}
            collapsed={sidebarCollapsed}
          />
        </div>

        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          className="hidden md:flex fixed bottom-6 left-4 z-40 items-center justify-center w-6 h-6 rounded bg-card text-dim hover:text-light transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        <main className="flex-1 overflow-y-auto" style={{ position: 'relative', zIndex: 1 }}>
          <div key={activeSection} className="section-enter px-6 py-6">
            {renderSection()}
          </div>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-white/5 flex" style={{ zIndex: 20 }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors"
                style={isActive ? { color: item.accent } : { color: '#94a3b8' }}
              >
                <Icon size={18} />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
