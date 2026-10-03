import React, { useState } from 'react';
import {
  Sliders,
  ChevronRight,
  ChevronLeft,
  Crosshair,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Eye,
  Type,
  Box,
  Save,
  Check,
} from 'lucide-react';
import styles from './DesignSystemInspector.module.css';

export interface InspectedElementInfo {
  tagName: string;
  className?: string;
  textSnippet?: string;
  computedStyles: {
    color: string;
    backgroundColor: string;
    fontSize: string;
    fontFamily: string;
    padding: string;
    borderRadius: string;
  };
  matchingTokens: {
    colorToken?: string;
    bgToken?: string;
    fontToken?: string;
    radiusToken?: string;
    spacingToken?: string;
  };
  designMdRule?: {
    section: string;
    ruleText: string;
  };
  contrastRatio?: number;
  wcagStatus?: 'AAA' | 'AA' | 'Fail';
}

interface DesignSystemInspectorProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeBrandName?: string;
  inspectedElement?: InspectedElementInfo | null;
  onCommitTokenPatch?: (token: string, newValue: string) => void;
  onEditDesignMd?: () => void;
}

export function DesignSystemInspector({
  collapsed,
  onToggleCollapse,
  activeBrandName = 'Stripe',
  inspectedElement,
  onCommitTokenPatch,
  onEditDesignMd,
}: DesignSystemInspectorProps) {
  const [inspectModeActive, setInspectModeActive] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Fallback demo inspected element if user hasn't clicked one yet
  const element: InspectedElementInfo = inspectedElement || {
    tagName: 'button.btn-primary',
    textSnippet: '立即体验 (Get Started)',
    computedStyles: {
      color: '#FFFFFF',
      backgroundColor: '#635BFF',
      fontSize: '14px',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '10px 18px',
      borderRadius: '8px',
    },
    matchingTokens: {
      colorToken: '--color-text-contrast',
      bgToken: '--color-brand-primary',
      fontToken: 'font-weight: 600, font-size: sm',
      radiusToken: '--radius-md (8px)',
      spacingToken: 'spacing.2.5 / spacing.4.5',
    },
    designMdRule: {
      section: 'Primary Call to Action',
      ruleText:
        '主要操作按钮严格继承 brand-primary 色相，悬停提升明度 8%，点击带 120ms 微缩阴影。圆角限定 8px 胶囊或小圆角。',
    },
    contrastRatio: 8.4,
    wcagStatus: 'AAA',
  };

  const handleApplyToken = () => {
    onCommitTokenPatch?.(element.matchingTokens.bgToken || '--color-brand-primary', element.computedStyles.backgroundColor);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  if (collapsed) {
    return (
      <aside className={`${styles.inspectorContainer} ${styles.inspectorCollapsed}`}>
        <div className={styles.collapsedTrigger}>
          <button
            type="button"
            className={styles.collapsedButton}
            onClick={onToggleCollapse}
            title="展开设计系统检查器 (Expand Inspector)"
            aria-label="展开检查器"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className={styles.collapsedButton}
            onClick={() => {
              setInspectModeActive(!inspectModeActive);
              onToggleCollapse();
            }}
            title="元素拾取器"
          >
            <Crosshair size={14} color={inspectModeActive ? 'var(--od-color-primary)' : undefined} />
          </button>
          <div className={styles.collapsedVerticalLabel}>Inspector</div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${styles.inspectorContainer} ${styles.inspectorExpanded}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Sliders size={16} color="var(--od-color-primary)" />
          <span>设计系统检查器 (Inspector)</span>
        </div>
        <button
          type="button"
          className={styles.collapseToggle}
          onClick={onToggleCollapse}
          title="收起检查器"
          aria-label="收起检查器"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Content */}
      <div className={styles.contentArea}>
        {/* Inspection Active Status Banner */}
        <div className={styles.inspectModeBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Crosshair size={14} />
            <span>{inspectModeActive ? '点击画布元素进行检查' : '画布元素检查中'}</span>
          </div>
          <button
            type="button"
            className={styles.inspectToggleBtn}
            onClick={() => setInspectModeActive(!inspectModeActive)}
          >
            {inspectModeActive ? '完成' : '拾取'}
          </button>
        </div>

        {/* Selected Element Identity */}
        <div className={styles.cardSection}>
          <div className={styles.sectionHeader}>
            <span>目标元素 (Target)</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              &lt;{element.tagName}&gt;
            </span>
          </div>
          {element.textSnippet ? (
            <div
              style={{
                fontSize: 12,
                color: 'var(--text)',
                background: 'var(--bg-subtle)',
                padding: '6px 8px',
                borderRadius: 'var(--od-radius-xs)',
                fontStyle: 'italic',
              }}
            >
              "{element.textSnippet}"
            </div>
          ) : null}
        </div>

        {/* Design Token Mapping */}
        <div className={styles.cardSection}>
          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color="var(--od-color-primary)" />
              <span>映射设计令牌 (Tokens)</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>{activeBrandName}</span>
          </div>

          {/* Background token */}
          <div className={styles.tokenRow}>
            <div className={styles.tokenLabel}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: element.computedStyles.backgroundColor }}
              />
              <span>背景色 (Background)</span>
            </div>
            <div className={styles.tokenValueGroup}>
              <span className={styles.tokenBadge}>{element.matchingTokens.bgToken}</span>
            </div>
          </div>

          {/* Text color token */}
          <div className={styles.tokenRow}>
            <div className={styles.tokenLabel}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: element.computedStyles.color }}
              />
              <span>字色 (Text Ink)</span>
            </div>
            <div className={styles.tokenValueGroup}>
              <span className={styles.tokenBadge}>{element.matchingTokens.colorToken}</span>
            </div>
          </div>

          {/* Typography */}
          <div className={styles.tokenRow}>
            <div className={styles.tokenLabel}>
              <Type size={13} color="var(--text-muted)" />
              <span>字号体系</span>
            </div>
            <div className={styles.tokenValueGroup}>
              <span className={styles.tokenBadge}>{element.computedStyles.fontSize}</span>
            </div>
          </div>

          {/* Radius & Border */}
          <div className={styles.tokenRow}>
            <div className={styles.tokenLabel}>
              <Box size={13} color="var(--text-muted)" />
              <span>圆角规范</span>
            </div>
            <div className={styles.tokenValueGroup}>
              <span className={styles.tokenBadge}>{element.matchingTokens.radiusToken}</span>
            </div>
          </div>
        </div>

        {/* Bound DESIGN.md Rule */}
        {element.designMdRule ? (
          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <BookOpen size={14} color="var(--od-color-primary)" />
                <span>对应 DESIGN.md 规范约束</span>
              </div>
            </div>
            <div className={styles.designMdRuleCard}>
              <div className={styles.designMdRuleTitle}>{element.designMdRule.section}</div>
              <div>{element.designMdRule.ruleText}</div>
            </div>
            {onEditDesignMd ? (
              <button
                type="button"
                onClick={onEditDesignMd}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--od-color-primary)',
                  fontSize: 11,
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                直接打开并编辑 DESIGN.md &rarr;
              </button>
            ) : null}
          </div>
        ) : null}

        {/* Accessibility Realtime Check */}
        <div className={styles.cardSection}>
          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Eye size={14} color="var(--od-color-success)" />
              <span>无障碍对比度 (A11y Check)</span>
            </div>
          </div>
          <div className={styles.a11yScoreRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={14} />
              <span>对比度: <strong>{element.contrastRatio}:1</strong></span>
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: 11,
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              WCAG {element.wcagStatus} 通过
            </span>
          </div>
        </div>

        {/* Quick Commit Action */}
        <button type="button" className={styles.applyButton} onClick={handleApplyToken}>
          {savedSuccess ? <Check size={14} /> : <Save size={14} />}
          <span>{savedSuccess ? '已同步至项目规范' : '同步修改到代码与 Token'}</span>
        </button>
      </div>
    </aside>
  );
}
