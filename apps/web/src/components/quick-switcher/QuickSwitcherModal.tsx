import React, { useState, useMemo } from 'react';
import { Search, FolderOpen, ArrowRight, X, Sparkles, LayoutTemplate } from 'lucide-react';
import styles from './QuickSwitcherModal.module.css';

export interface QuickProjectItem {
  id: string;
  name: string;
  category: 'landing' | 'dashboard' | 'deck' | 'brand';
  categoryLabel: string;
  primaryColor: string;
  updatedAt: string;
}

interface QuickSwitcherModalProps {
  open: boolean;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  projects?: QuickProjectItem[];
}

const DEFAULT_PROJECTS: QuickProjectItem[] = [
  {
    id: 'stripe-saas-hero',
    name: 'Stripe 风格云原生计费控制台',
    category: 'dashboard',
    categoryLabel: '控制台',
    primaryColor: '#635BFF',
    updatedAt: '5分钟前',
  },
  {
    id: 'linear-landing',
    name: 'Linear 质感暗黑极客落地页',
    category: 'landing',
    categoryLabel: '落地页',
    primaryColor: '#5E6AD2',
    updatedAt: '2小时前',
  },
  {
    id: 'notion-workspace',
    name: 'Notion 极简知识库导航体系',
    category: 'dashboard',
    categoryLabel: '控制台',
    primaryColor: '#2F3437',
    updatedAt: '昨天',
  },
  {
    id: 'ai-deck-seed',
    name: 'OpenDesign A 轮融资商业计划书',
    category: 'deck',
    categoryLabel: '演示稿',
    primaryColor: '#10B981',
    updatedAt: '3天前',
  },
  {
    id: 'nordic-design-token',
    name: '北欧极简家居统一设计规范',
    category: 'brand',
    categoryLabel: '品牌规范',
    primaryColor: '#D97706',
    updatedAt: '上周',
  },
];

const CATEGORIES = [
  { id: 'all', label: '全部项目' },
  { id: 'landing', label: '落地页' },
  { id: 'dashboard', label: '控制台' },
  { id: 'deck', label: '演示稿' },
  { id: 'brand', label: '品牌规范' },
];

export function QuickSwitcherModal({
  open,
  onClose,
  onSelectProject,
  projects = DEFAULT_PROJECTS,
}: QuickSwitcherModalProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchQuery =
        !query.trim() ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [projects, activeCategory, query]);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Search header */}
        <div className={styles.searchHeader}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="快速跳转或搜索设计项目... (按 Esc 退出)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Category Pills */}
        <div className={styles.categoryRail}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${styles.categoryPill} ${activeCategory === c.id ? styles.categoryPillActive : ''}`}
              onClick={() => setActiveCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className={styles.resultsList}>
          {filteredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-faint)', fontSize: 12 }}>
              未搜索到匹配的项目
            </div>
          ) : (
            filteredProjects.map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                className={styles.projectRow}
                onClick={() => {
                  onSelectProject(p.id);
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSelectProject(p.id);
                    onClose();
                  }
                }}
              >
                <div className={styles.rowLeft}>
                  <div
                    className={styles.swatchDot}
                    style={{ backgroundColor: p.primaryColor }}
                    title={p.primaryColor}
                  />
                  <span className={styles.projectName}>{p.name}</span>
                  <span className={styles.projectKind}>{p.categoryLabel}</span>
                </div>
                <div className={styles.rowRight}>
                  <span>{p.updatedAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
