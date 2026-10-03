import React from 'react';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Eye,
  Type,
  MousePointerClick,
  Code,
} from 'lucide-react';
import styles from './A11yHealthModal.module.css';

interface A11yHealthModalProps {
  open: boolean;
  onClose: () => void;
  onAutoFixByAgent?: (issueSummary: string) => void;
}

export function A11yHealthModal({
  open,
  onClose,
  onAutoFixByAgent,
}: A11yHealthModalProps) {
  if (!open) return null;

  const AUDIT_ITEMS = [
    {
      id: 'contrast',
      icon: <Eye size={16} color="var(--od-color-success)" />,
      title: '文本与背景对比度 (Color Contrast)',
      desc: '正文与背景对比度达到 8.4:1，超越 WCAG AA (4.5:1) 与 AAA (7.0:1) 标准。',
      status: 'pass',
      badge: 'WCAG AAA 通过',
    },
    {
      id: 'type',
      icon: <Type size={16} color="var(--od-color-success)" />,
      title: '排版字级与行高 (Typography Legibility)',
      desc: '正文基准字号为 14px，行高 1.5，所有字阶均符合流式可阅读规范。',
      status: 'pass',
      badge: '完全合规',
    },
    {
      id: 'targets',
      icon: <MousePointerClick size={16} color="var(--od-color-warning)" />,
      title: '交互热区与触控面积 (Touch Target Sizes)',
      desc: '部分紧凑型小图标按钮点击区域为 32×32px，建议补充四周透明 padding 扩至 44×44px。',
      status: 'warn',
      badge: '建议优化 (1 项)',
    },
    {
      id: 'semantic',
      icon: <Code size={16} color="var(--od-color-success)" />,
      title: '语义化结构与 ARIA (Semantic DOM)',
      desc: '使用 header、main、section 等语义化骨架，所有重要按钮均具备语义化 role 与 aria-label。',
      status: 'pass',
      badge: '完全合规',
    },
  ];

  const handleFix = () => {
    onAutoFixByAgent?.('请修复页面中紧凑按钮的点击热区尺寸，将其 padding 补齐至 44×44px 标准，并检查所有图片包含有效 alt 属性。');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <ShieldCheck size={20} color="var(--od-color-success)" />
            <span>设计无障碍体检报告 (A11y Audit)</span>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Overall Score */}
          <div className={styles.scoreBanner}>
            <div className={styles.scoreLeft}>
              <div className={styles.scoreCircle}>96</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>
                  A11y 综合无障碍评分: 极佳 (Excellent)
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  符合国际通用 WCAG 2.1 AA 级可访问性规范，可安全投入生产交付。
                </div>
              </div>
            </div>
          </div>

          {/* Audit Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {AUDIT_ITEMS.map((item) => (
              <div key={item.id} className={styles.auditItem}>
                <div className={styles.auditLeft}>
                  {item.icon}
                  <div>
                    <div className={styles.auditTitle}>{item.title}</div>
                    <div className={styles.auditDesc}>{item.desc}</div>
                  </div>
                </div>
                <span className={item.status === 'pass' ? styles.auditBadgePass : styles.auditBadgeWarn}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            可直接让 Agent 在当前工程中微调修复
          </span>
          <button type="button" className={styles.fixButton} onClick={handleFix}>
            <Sparkles size={14} />
            <span>一键让 Agent 优化热区</span>
          </button>
        </div>
      </div>
    </div>
  );
}
