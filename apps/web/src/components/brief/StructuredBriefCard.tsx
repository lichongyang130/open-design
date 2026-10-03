import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Users,
  Layout,
  Palette,
  Sparkles,
  RefreshCw,
  Edit2,
  Check,
} from 'lucide-react';
import styles from './StructuredBriefCard.module.css';

export interface StructuredBriefData {
  audience: string;
  surface: string;
  tone: string;
  brandName: string;
  keyDirectives?: string[];
}

interface StructuredBriefCardProps {
  initialData?: Partial<StructuredBriefData>;
  onRegenerate?: (updatedData: StructuredBriefData) => void;
  readOnly?: boolean;
}

export function StructuredBriefCard({
  initialData,
  onRegenerate,
  readOnly = false,
}: StructuredBriefCardProps) {
  const [data, setData] = useState<StructuredBriefData>({
    audience: initialData?.audience || 'B端研发与产品团队 (Product & Eng)',
    surface: initialData?.surface || 'SaaS 控制台与工作区 (Dashboard Workspace)',
    tone: initialData?.tone || '严谨极简 · 科技现代 (Minimalist Tech)',
    brandName: initialData?.brandName || 'Stripe / Linear 现代风格',
    keyDirectives: initialData?.keyDirectives || [
      '高对比度无障碍',
      '8px 栅格间距',
      '清晰的信息层级',
    ],
  });

  const [editingField, setEditingField] = useState<string | null>(null);

  const TONE_OPTIONS = [
    '严谨极简 · 科技现代',
    '活泼亲和 · 消费级',
    '典雅克制 · 奢华质感',
    '复古粗野 · Brutalism',
  ];

  const SURFACE_OPTIONS = [
    'SaaS 控制台与工作区',
    '产品营销落地页',
    '路演幻灯片 (Deck)',
    '移动端 App 原型',
  ];

  const handleUpdateTone = (newTone: string) => {
    setData((prev) => ({ ...prev, tone: newTone }));
  };

  const handleUpdateSurface = (newSurface: string) => {
    setData((prev) => ({ ...prev, surface: newSurface }));
  };

  return (
    <div className={styles.briefCard}>
      {/* Header */}
      <div className={styles.briefHeader}>
        <div className={styles.briefTitleGroup}>
          <FileSpreadsheet size={16} color="var(--od-color-primary)" />
          <span>结构化设计需求 (Structured Brief)</span>
        </div>
        <span className={styles.tagPill}>Turn-1 规格已固化</span>
      </div>

      {/* Grid of Attributes */}
      <div className={styles.fieldsGrid}>
        {/* Audience */}
        <div className={styles.fieldItem}>
          <div className={styles.fieldLabel}>
            <Users size={12} />
            <span>目标受众 (Audience)</span>
          </div>
          <div className={styles.fieldValue}>{data.audience}</div>
        </div>

        {/* Brand */}
        <div className={styles.fieldItem}>
          <div className={styles.fieldLabel}>
            <Palette size={12} />
            <span>品牌设计系统 (Brand)</span>
          </div>
          <div className={styles.fieldValue}>{data.brandName}</div>
        </div>

        {/* Surface */}
        <div className={styles.fieldItem}>
          <div className={styles.fieldLabel}>
            <Layout size={12} />
            <span>形态类型 (Surface)</span>
          </div>
          <div className={styles.chipGroup}>
            {SURFACE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${styles.chip} ${data.surface === opt ? styles.chipSelected : ''}`}
                onClick={() => !readOnly && handleUpdateSurface(opt)}
                disabled={readOnly}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div className={styles.fieldItem}>
          <div className={styles.fieldLabel}>
            <Sparkles size={12} />
            <span>设计基调 (Tone)</span>
          </div>
          <div className={styles.chipGroup}>
            {TONE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${styles.chip} ${data.tone === opt ? styles.chipSelected : ''}`}
                onClick={() => !readOnly && handleUpdateTone(opt)}
                disabled={readOnly}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {!readOnly && onRegenerate ? (
        <div className={styles.footerActions}>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.actionPrimary}`}
            onClick={() => onRegenerate(data)}
          >
            <RefreshCw size={12} />
            <span>按此规格微调重新生成</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
