import React, { useState, useMemo } from 'react';
import {
  Folder,
  Layers,
  Palette,
  FileCode,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Settings,
} from 'lucide-react';
import styles from './ProjectSidebarHub.module.css';

export interface ProjectSidebarFileItem {
  name: string;
  size?: number;
  kind?: string;
  mtime?: number;
}

export interface DesignSystemSummary {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  summary?: string;
  swatches?: string[];
  primaryFont?: string;
}

interface ProjectSidebarHubProps {
  projectId: string;
  projectName: string;
  files: ProjectSidebarFileItem[];
  activeFileName?: string;
  onSelectFile: (fileName: string) => void;
  designSystems: DesignSystemSummary[];
  currentDesignSystemId?: string | null;
  onChangeDesignSystem?: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  conversationsCount?: number;
  onOpenDesignSystemModal?: () => void;
  onOpenQuickSwitcher?: () => void;
  onOpenStudioSettings?: () => void;
}

const FALLBACK_SWATCHES: string[] = ['#635BFF', '#0A2540', '#00D4B2', '#F6F9FC', '#DFE3E8'];

// Fallback palette swatch preview if brand JSON or tokens are not loaded yet
const DEFAULT_BRAND_SWATCHES: Record<string, string[]> = {
  stripe: ['#635BFF', '#0A2540', '#00D4B2', '#F6F9FC', '#DFE3E8'],
  apple: ['#0071E3', '#1D1D1F', '#F5F5F7', '#86868B', '#FFFFFF'],
  linear: ['#5E6AD2', '#0F1015', '#24262E', '#8A8F98', '#FFFFFF'],
  airbnb: ['#FF385C', '#222222', '#717171', '#F7F7F7', '#FFFFFF'],
  github: ['#0969DA', '#24292F', '#57606A', '#F6F8FA', '#FFFFFF'],
};

export function ProjectSidebarHub({
  projectId,
  projectName,
  files = [],
  activeFileName,
  onSelectFile,
  designSystems = [],
  currentDesignSystemId,
  onChangeDesignSystem,
  collapsed,
  onToggleCollapse,
  conversationsCount = 1,
  onOpenDesignSystemModal,
  onOpenQuickSwitcher,
  onOpenStudioSettings,
}: ProjectSidebarHubProps) {
  const [activeTab, setActiveTab] = useState<'tree' | 'ds'>('tree');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered files
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const q = searchQuery.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, searchQuery]);

  // Current active design system
  const activeDs = useMemo(() => {
    if (!currentDesignSystemId) return null;
    return (
      designSystems.find((ds) => ds.id === currentDesignSystemId) || {
        id: currentDesignSystemId,
        title: currentDesignSystemId.charAt(0).toUpperCase() + currentDesignSystemId.slice(1),
        swatches: (currentDesignSystemId && DEFAULT_BRAND_SWATCHES[currentDesignSystemId.toLowerCase()]) || FALLBACK_SWATCHES,
        primaryFont: 'Inter, system-ui',
      }
    );
  }, [currentDesignSystemId, designSystems]);

  // Pinned/Featured systems
  const featuredSystems: DesignSystemSummary[] = useMemo(() => {
    const defaultIds = ['stripe', 'apple', 'linear', 'airbnb'];
    return defaultIds.map((id) => {
      const match = designSystems.find((ds) => ds.id === id);
      return (
        match || {
          id,
          title: id.charAt(0).toUpperCase() + id.slice(1),
          swatches: DEFAULT_BRAND_SWATCHES[id] || FALLBACK_SWATCHES,
          primaryFont: 'Inter, sans-serif',
        }
      );
    });
  }, [designSystems]);

  const getFileIcon = (name: string) => {
    if (name.endsWith('.html') || name.endsWith('.htm')) {
      return <FileCode size={14} color="#3b82f6" />;
    }
    if (name.endsWith('.md')) {
      return <FileText size={14} color="#10b981" />;
    }
    if (name.endsWith('.json')) {
      return <SlidersHorizontal size={14} color="#f59e0b" />;
    }
    return <FileText size={14} color="#6b7280" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  if (collapsed) {
    return (
      <aside className={`${styles.sidebarContainer} ${styles.sidebarCollapsed}`}>
        <div className={styles.collapsedTrigger}>
          <button
            type="button"
            className={styles.collapsedButton}
            onClick={onToggleCollapse}
            title="展开侧栏 (Expand Sidebar)"
            aria-label="展开侧栏"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            className={styles.collapsedButton}
            onClick={() => {
              setActiveTab('tree');
              onToggleCollapse();
            }}
            title="项目文件"
          >
            <Folder size={16} />
          </button>
          <button
            type="button"
            className={styles.collapsedButton}
            onClick={() => {
              setActiveTab('ds');
              onToggleCollapse();
            }}
            title="设计系统"
          >
            <Palette size={16} />
          </button>
          <div className={styles.collapsedVerticalLabel}>
            {activeTab === 'tree' ? 'Project' : 'Design System'}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${styles.sidebarContainer} ${styles.sidebarExpanded}`}>
      {/* Sidebar Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Layers size={16} color="var(--od-color-primary)" />
          <span>{projectName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {onOpenQuickSwitcher ? (
            <button
              type="button"
              className={styles.collapseToggle}
              onClick={onOpenQuickSwitcher}
              title="快速切换项目 (Cmd+K)"
              aria-label="快速切换项目"
            >
              <Search size={14} />
            </button>
          ) : null}
          {onOpenStudioSettings ? (
            <button
              type="button"
              className={styles.collapseToggle}
              onClick={onOpenStudioSettings}
              title="工作室高级设置"
              aria-label="工作室高级设置"
            >
              <Settings size={14} />
            </button>
          ) : null}
          <button
            type="button"
            className={styles.collapseToggle}
            onClick={onToggleCollapse}
            title="收起侧栏"
            aria-label="收起侧栏"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      {/* Dual Tabs */}
      <div className={styles.tabBar} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'tree'}
          className={`${styles.tabButton} ${activeTab === 'tree' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('tree')}
        >
          <Folder size={13} />
          <span>项目文件</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'ds'}
          className={`${styles.tabButton} ${activeTab === 'ds' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('ds')}
        >
          <Palette size={13} />
          <span>设计系统</span>
        </button>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {activeTab === 'tree' ? (
          <>
            {/* Search Filter */}
            <div className={styles.searchBox}>
              <Search size={13} color="var(--text-faint)" />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="搜索项目产物..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Artifacts & Pages Section */}
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span>产物文件 (Artifacts)</span>
                <span className={styles.sectionBadge}>{filteredFiles.length}</span>
              </div>
              <div className={styles.fileList}>
                {filteredFiles.map((file) => {
                  const isActive = activeFileName === file.name;
                  return (
                    <div
                      key={file.name}
                      role="button"
                      tabIndex={0}
                      className={`${styles.fileItem} ${isActive ? styles.fileItemActive : ''}`}
                      onClick={() => onSelectFile(file.name)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') onSelectFile(file.name);
                      }}
                    >
                      <div className={styles.fileLeft}>
                        {getFileIcon(file.name)}
                        <span title={file.name}>{file.name}</span>
                      </div>
                      {file.size ? (
                        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Active Design System Quick Glance */}
            {activeDs ? (
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span>绑定规范 (Active Brand)</span>
                </div>
                <div
                  className={styles.pinnedCard}
                  onClick={() => setActiveTab('ds')}
                  role="button"
                  tabIndex={0}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={14} color="var(--od-color-primary)" />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{activeDs.title || activeDs.name}</span>
                  </div>
                  <ChevronRight size={14} color="var(--text-faint)" />
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <>
            {/* Active Design System Card */}
            {activeDs ? (
              <div className={styles.brandCard}>
                <div className={styles.brandHeader}>
                  <div className={styles.brandNameGroup}>
                    <Sparkles size={15} color="var(--od-color-primary)" />
                    <span>{activeDs.title || activeDs.name}</span>
                  </div>
                  <span className={styles.activeBadge}>当前生效</span>
                </div>

                {/* Live Swatch Strip */}
                <div className={styles.swatchStrip}>
                  {(activeDs.swatches || DEFAULT_BRAND_SWATCHES['stripe'] || FALLBACK_SWATCHES).map((hex, idx) => (
                    <div
                      key={idx}
                      className={styles.swatchItem}
                      style={{ backgroundColor: hex }}
                      title={`Token: ${hex}`}
                    />
                  ))}
                </div>

                {/* Typography info */}
                <div className={styles.typographyPreview}>
                  <span>主字体体系:</span>
                  <strong>{activeDs.primaryFont || 'Inter, sans-serif'}</strong>
                </div>
              </div>
            ) : null}

            {/* Quick Switch Systems */}
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span>预设精选品牌规范</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {featuredSystems.map((item) => {
                  const isCurrent = currentDesignSystemId === item.id;
                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      className={styles.pinnedCard}
                      onClick={() => onChangeDesignSystem?.(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onChangeDesignSystem?.(item.id);
                      }}
                      style={
                        isCurrent
                          ? { borderColor: 'var(--od-color-primary)', background: 'var(--od-color-primary-light)' }
                          : undefined
                      }
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: item.swatches?.[0] || '#635BFF',
                          }}
                        />
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{item.title || item.name}</span>
                      </div>
                      {isCurrent ? (
                        <CheckCircle2 size={14} color="var(--od-color-primary)" />
                      ) : (
                        <div style={{ display: 'flex', gap: 2 }}>
                          {item.swatches?.slice(0, 3).map((swatch, sIdx) => (
                            <span
                              key={sIdx}
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 2,
                                backgroundColor: swatch,
                                display: 'inline-block',
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom / More button */}
            <button
              type="button"
              className={styles.switchDsButton}
              onClick={onOpenDesignSystemModal}
            >
              <ExternalLink size={13} />
              <span>浏览 150+ 品牌设计系统...</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
