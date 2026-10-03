import React from 'react';
import { Columns, History, Sparkles } from 'lucide-react';
import styles from './CanvasComparisonSplit.module.css';

interface CanvasComparisonSplitProps {
  leftSrcDoc?: string;
  leftUrl?: string;
  leftLabel?: string;
  rightSrcDoc?: string;
  rightUrl?: string;
  rightLabel?: string;
  onClose?: () => void;
}

export function CanvasComparisonSplit({
  leftSrcDoc,
  leftUrl,
  leftLabel = '基准版本 (v1 Initial Draft)',
  rightSrcDoc,
  rightUrl,
  rightLabel = '当前版本 (v4 Refined Version)',
  onClose,
}: CanvasComparisonSplitProps) {
  return (
    <div className={styles.comparisonContainer}>
      {/* Left Baseline Pane */}
      <div className={`${styles.pane} ${styles.leftPane}`}>
        <div className={styles.paneHeader}>
          <div className={styles.paneTag}>
            <History size={13} color="var(--text-muted)" />
            <span>{leftLabel}</span>
          </div>
          <span className={styles.badgeBaseline}>对比参照</span>
        </div>
        <div className={styles.iframeWrapper}>
          <iframe
            className={styles.iframe}
            title="Baseline Version"
            srcDoc={leftSrcDoc}
            src={!leftSrcDoc ? leftUrl : undefined}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* Right Current Candidate Pane */}
      <div className={styles.pane}>
        <div className={styles.paneHeader}>
          <div className={styles.paneTag}>
            <Sparkles size={13} color="var(--od-color-primary)" />
            <span>{rightLabel}</span>
          </div>
          <span className={styles.badgeCurrent}>当前候选</span>
        </div>
        <div className={styles.iframeWrapper}>
          <iframe
            className={styles.iframe}
            title="Current Candidate"
            srcDoc={rightSrcDoc}
            src={!rightSrcDoc ? rightUrl : undefined}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
