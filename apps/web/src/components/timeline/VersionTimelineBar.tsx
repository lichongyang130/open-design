import React from 'react';
import {
  History,
  Columns,
  ShieldCheck,
  MessageSquare,
  CheckCircle,
  GitBranch,
  Download,
} from 'lucide-react';
import styles from './VersionTimelineBar.module.css';

export interface ArtifactVersionSnapshot {
  id: string;
  versionNumber: number;
  label: string;
  timestamp: string;
  author: 'agent' | 'user' | 'jury';
}

interface VersionTimelineBarProps {
  versions?: ArtifactVersionSnapshot[];
  activeVersionId: string;
  onSelectVersion: (versionId: string) => void;
  compareMode: boolean;
  onToggleCompareMode: () => void;
  onOpenA11yAudit: () => void;
  onOpenExportPresets?: () => void;
  commentMode?: boolean;
  onToggleCommentMode?: () => void;
}

const DEFAULT_VERSIONS: ArtifactVersionSnapshot[] = [
  {
    id: 'v1',
    versionNumber: 1,
    label: 'v1 概念初稿 (Draft)',
    timestamp: '10 分钟前',
    author: 'agent',
  },
  {
    id: 'v2',
    versionNumber: 2,
    label: 'v2 注入规范 (Brand)',
    timestamp: '5 分钟前',
    author: 'agent',
  },
  {
    id: 'v3',
    versionNumber: 3,
    label: 'v3 直接操纵微调 (Manual)',
    timestamp: '2 分钟前',
    author: 'user',
  },
  {
    id: 'v4',
    versionNumber: 4,
    label: 'v4 Jury 质检收敛 (Current)',
    timestamp: '刚刚',
    author: 'jury',
  },
];

export function VersionTimelineBar({
  versions = DEFAULT_VERSIONS,
  activeVersionId,
  onSelectVersion,
  compareMode,
  onToggleCompareMode,
  onOpenA11yAudit,
  onOpenExportPresets,
  commentMode = false,
  onToggleCommentMode,
}: VersionTimelineBarProps) {
  return (
    <div className={styles.timelineContainer}>
      {/* Left: Versions Timeline Scrubber */}
      <div className={styles.leftGroup}>
        <div className={styles.timelineLabel}>
          <History size={13} />
          <span>版本时间轴</span>
        </div>

        {versions.map((v) => {
          const isActive = activeVersionId === v.id;
          return (
            <button
              key={v.id}
              type="button"
              className={`${styles.versionBadge} ${isActive ? styles.versionBadgeActive : ''}`}
              onClick={() => onSelectVersion(v.id)}
              title={`${v.label} · ${v.timestamp}`}
            >
              {v.author === 'jury' ? (
                <ShieldCheck size={12} color={isActive ? 'var(--od-color-primary)' : 'var(--od-color-success)'} />
              ) : v.author === 'user' ? (
                <GitBranch size={12} />
              ) : (
                <CheckCircle size={12} />
              )}
              <span>{v.label}</span>
              <span className={styles.versionTime}>{v.timestamp}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Studio Functional Tools */}
      <div className={styles.rightControls}>
        {/* Compare mode */}
        <button
          type="button"
          className={`${styles.toolButton} ${compareMode ? styles.toolButtonActive : ''}`}
          onClick={onToggleCompareMode}
          title="左右双视口分屏对比 (Side-by-side Compare)"
        >
          <Columns size={13} />
          <span>对比模式</span>
        </button>

        {/* Hotspot comment */}
        {onToggleCommentMode ? (
          <button
            type="button"
            className={`${styles.toolButton} ${commentMode ? styles.toolButtonActive : ''}`}
            onClick={onToggleCommentMode}
            title="热区悬挂评论 (Pin Comments on Canvas)"
          >
            <MessageSquare size={13} />
            <span>热区评论</span>
          </button>
        ) : null}

        {/* A11y health check */}
        <button
          type="button"
          className={styles.toolButton}
          onClick={onOpenA11yAudit}
          title="一键无障碍体检 (Accessibility Audit)"
        >
          <ShieldCheck size={13} color="var(--od-color-success)" />
          <span>无障碍体检</span>
        </button>

        {/* Export Presets */}
        {onOpenExportPresets ? (
          <button
            type="button"
            className={styles.toolButton}
            onClick={onOpenExportPresets}
            title="高级导出预设 (Export Presets)"
          >
            <Download size={13} color="var(--od-color-primary)" />
            <span>导出预设</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
