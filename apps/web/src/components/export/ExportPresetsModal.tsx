import React, { useState } from 'react';
import {
  Download,
  X,
  FileCode2,
  FileImage,
  Presentation,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  FolderArchive,
  ArrowRight,
} from 'lucide-react';
import styles from './ExportPresetsModal.module.css';

export interface ExportPresetOption {
  id: string;
  title: string;
  desc: string;
  tag: string;
  icon: React.ReactNode;
}

interface ExportPresetsModalProps {
  open: boolean;
  onClose: () => void;
  projectName?: string;
  onExportPreset: (presetId: string, options: { runA11yBeforeExport: boolean }) => void;
}

const PRESETS: ExportPresetOption[] = [
  {
    id: 'nextjs-package',
    title: '生产级 React + TypeScript 工程包',
    desc: 'Next.js 16 (App Router) + Tailwind CSS + Lucide Icons + TypeScript 接口定义完整脚手架',
    tag: 'ZIP / Code',
    icon: <FileCode2 size={18} />,
  },
  {
    id: 'deck-presentation',
    title: '路演提案幻灯片套件 (Pitch Deck)',
    desc: '包含完整母版、矢量排版与演讲者备注的 PPTX 演示文稿',
    tag: 'PPTX',
    icon: <Presentation size={18} />,
  },
  {
    id: 'visual-assets',
    title: '设计资产与高保真图套件 (Assets Bundle)',
    desc: '包含 @2x/@3x 高清 WebP/PNG 渲染图 + 矢量图标 SVG 资源集合',
    tag: 'PNG + SVG',
    icon: <FileImage size={18} />,
  },
  {
    id: 'standalone-html',
    title: '单文件静态离线原型 (Standalone HTML)',
    desc: '内联样式与脚本、零运行时依赖的纯净 HTML 预览文件',
    tag: 'HTML / CSS',
    icon: <FolderArchive size={18} />,
  },
];

export function ExportPresetsModal({
  open,
  onClose,
  projectName = '项目原型',
  onExportPreset,
}: ExportPresetsModalProps) {
  const [selectedPresetId, setSelectedPresetId] = useState('nextjs-package');
  const [runA11yBeforeExport, setRunA11yBeforeExport] = useState(true);

  if (!open) return null;

  const handleExport = () => {
    onExportPreset(selectedPresetId, { runA11yBeforeExport });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <PackageCheck size={18} color="var(--od-color-primary)" />
            <span>导出预设 (Export Presets) — {projectName}</span>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            选择符合团队下游工作流的导出预设，一键打包生成高质量交付物：
          </div>

          {PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                className={`${styles.presetCard} ${isSelected ? styles.presetCardSelected : ''}`}
                onClick={() => setSelectedPresetId(p.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelectedPresetId(p.id);
                }}
              >
                <div className={styles.presetLeft}>
                  <div className={styles.iconBox}>{p.icon}</div>
                  <div>
                    <div className={styles.presetTitle}>{p.title}</div>
                    <div className={styles.presetDesc}>{p.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={styles.tagPill}>{p.tag}</span>
                  {isSelected ? <CheckCircle2 size={16} color="var(--od-color-primary)" /> : null}
                </div>
              </div>
            );
          })}

          {/* Quality gate toggle */}
          <div className={styles.optionsSection}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={runA11yBeforeExport}
                onChange={(e) => setRunA11yBeforeExport(e.target.checked)}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} color="var(--od-color-success)" />
                <span>导出前自动执行 A11y 可访问性与对比度体检</span>
              </div>
            </label>
            <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>推荐开启</span>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            已选: {PRESETS.find((p) => p.id === selectedPresetId)?.title}
          </span>
          <button type="button" className={styles.exportButton} onClick={handleExport}>
            <Download size={14} />
            <span>立即打包导出</span>
          </button>
        </div>
      </div>
    </div>
  );
}
