import React from 'react';
import {
  Bot,
  CheckCircle2,
  Clock,
  CircleDot,
  Palette,
  Sparkles,
  Layers,
  Scale,
} from 'lucide-react';
import styles from './AgentDecisionBubble.module.css';

export interface GenerationStep {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

interface AgentDecisionBubbleProps {
  agentName?: string;
  selectedSkill?: string;
  selectedDesignSystem?: string;
  currentStage?: number; // 1 to 4
  steps?: GenerationStep[];
}

export function AgentDecisionBubble({
  agentName = 'Claude Code (OpenDesign Agent)',
  selectedSkill = 'Landing Page Builder',
  selectedDesignSystem = 'Stripe Design System',
  currentStage = 3,
  steps,
}: AgentDecisionBubbleProps) {
  const defaultSteps: GenerationStep[] = [
    {
      id: 'step-1',
      label: `读取 ${selectedDesignSystem} (DESIGN.md 规范与 Token)`,
      status: currentStage > 1 ? 'completed' : currentStage === 1 ? 'active' : 'pending',
    },
    {
      id: 'step-2',
      label: '规划响应式网格与组件层次结构',
      status: currentStage > 2 ? 'completed' : currentStage === 2 ? 'active' : 'pending',
    },
    {
      id: 'step-3',
      label: `合成现代组件代码 (${selectedSkill})`,
      status: currentStage > 3 ? 'completed' : currentStage === 3 ? 'active' : 'pending',
    },
    {
      id: 'step-4',
      label: 'Design Jury 5 人评审团质检 (收敛阈值 8.0/10)',
      status: currentStage > 4 ? 'completed' : currentStage === 4 ? 'active' : 'pending',
    },
  ];

  const renderSteps = steps || defaultSteps;

  return (
    <div className={styles.bubbleContainer}>
      {/* Header */}
      <div className={styles.bubbleHeader}>
        <div className={styles.agentIdentity}>
          <div className={styles.agentIconBadge}>
            <Bot size={14} />
          </div>
          <span>{agentName} · 架构决策与执行进度</span>
        </div>
        <div className={styles.decisionPills}>
          <span className={styles.decisionPill}>
            <Palette size={11} color="var(--od-color-primary)" />
            {selectedDesignSystem}
          </span>
          <span className={styles.decisionPill}>
            <Layers size={11} color="var(--od-color-success)" />
            {selectedSkill}
          </span>
        </div>
      </div>

      {/* Stepper Track */}
      <div className={styles.stepperTrack}>
        {renderSteps.map((step) => {
          const isDone = step.status === 'completed';
          const isActive = step.status === 'active';
          return (
            <div key={step.id} className={styles.stepItem}>
              {isDone ? (
                <CheckCircle2 size={13} className={styles.stepIconSuccess} />
              ) : isActive ? (
                <CircleDot size={13} className={styles.stepIconActive} />
              ) : (
                <Clock size={13} className={styles.stepIconPending} />
              )}
              <span className={isActive ? styles.stepTextActive : undefined}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
