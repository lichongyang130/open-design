import React, { useState, useMemo } from 'react';
import {
  Compass,
  Layout,
  Users,
  Palette,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  Sliders,
  Play,
  Monitor,
  Smartphone,
  Presentation,
} from 'lucide-react';
import styles from './BriefWizardStepper.module.css';

export interface WizardBriefResult {
  surfaceId: string;
  surfaceLabel: string;
  audienceId: string;
  audienceLabel: string;
  toneDirection: string;
  blendRatio: number; // 0 to 100
  promptPayload: string;
}

export interface BriefWizardStepperProps {
  onComplete?: (result: WizardBriefResult) => void;
  onApplyBrief?: (prompt: string) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const SURFACES = [
  {
    id: 'landing',
    title: '产品落地页 (Landing Page)',
    desc: '高转换率、视觉强烈的 Hero Banner 与特性板块',
    icon: <Monitor size={16} />,
  },
  {
    id: 'dashboard',
    title: 'SaaS 控制台 (Dashboard)',
    desc: '数据可视化卡片、筛选器与复杂操作表格',
    icon: <Layout size={16} />,
  },
  {
    id: 'deck',
    title: '路演提案 (Pitch Deck)',
    desc: '清晰的观点叙事与大字号设计版面',
    icon: <Presentation size={16} />,
  },
  {
    id: 'mobile',
    title: '移动端原型 (Mobile H5)',
    desc: '390px 紧凑视口，原生手感与触控优化',
    icon: <Smartphone size={16} />,
  },
];

const AUDIENCES = [
  {
    id: 'b2b-pro',
    title: '企业 B 端专业客户',
    desc: '严谨、克制，强调高信息密度与信赖感',
    icon: <Users size={16} />,
  },
  {
    id: 'b2c-youth',
    title: 'C 端大众与年轻世代',
    desc: '生动、友好，富有情感化微交互与温度',
    icon: <Sparkles size={16} />,
  },
  {
    id: 'dev-tech',
    title: '极客工程师与开发者',
    desc: '暗色高对比度、代码字阶，清晰直率',
    icon: <Layers size={16} />,
  },
];

export function BriefWizardStepper({ onComplete, onApplyBrief, onCancel, onClose }: BriefWizardStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSurface, setSelectedSurface] = useState(SURFACES[0]!);
  const [selectedAudience, setSelectedAudience] = useState(AUDIENCES[0]!);
  const [blendRatio, setBlendRatio] = useState(30); // 0 = 100% Minimal Tech, 100 = 100% Vibrant Pop

  // Interpolated palette simulation
  const blendedColors = useMemo(() => {
    // Left: Minimal Tech (#0F172A, #2563EB, #64748B, #F8FAFC)
    // Right: Vibrant Pop (#4F46E5, #EC4899, #F59E0B, #FFFBEB)
    const ratio = blendRatio / 100;
    return [
      ratio < 0.5 ? '#0F172A' : '#1E1B4B',
      ratio < 0.5 ? '#2563EB' : '#EC4899',
      ratio < 0.5 ? '#64748B' : '#F59E0B',
      ratio < 0.5 ? '#F8FAFC' : '#FDF2F8',
    ];
  }, [blendRatio]);

  const handleFinish = () => {
    const toneText = `${100 - blendRatio}% 极简科技风格 + ${blendRatio}% 活力潮流色彩混合`;
    const prompt = `请生成一套 ${selectedSurface.title}，目标用户为 ${selectedAudience.title}。设计风格定位为：${toneText}。严格遵循规范，保证 8px 栅格与 WCAG AAA 对比度。`;
    if (onApplyBrief) {
      onApplyBrief(prompt);
    }
    if (onComplete) {
      onComplete({
        surfaceId: selectedSurface.id,
        surfaceLabel: selectedSurface.title,
        audienceId: selectedAudience.id,
        audienceLabel: selectedAudience.title,
        toneDirection: toneText,
        blendRatio,
        promptPayload: prompt,
      });
    }
  };

  const handleDismiss = onClose || onCancel;

  return (
    <div className={styles.wizardContainer}>
      {/* Header */}
      <div className={styles.wizardHeader}>
        <div className={styles.headerTitle}>
          <Compass size={18} color="var(--od-color-primary)" />
          <span>向导式需求构想器 (Brief Stepper)</span>
        </div>

        {/* Step dots */}
        <div className={styles.stepIndicator}>
          {[1, 2, 3].map((step, idx) => {
            const isDone = currentStep > step;
            const isActive = currentStep === step;
            return (
              <React.Fragment key={step}>
                <div
                  className={`${styles.stepDot} ${
                    isActive ? styles.stepDotActive : isDone ? styles.stepDotDone : ''
                  }`}
                >
                  {isDone ? <CheckCircle2 size={12} /> : step}
                </div>
                {idx < 2 ? (
                  <div
                    className={`${styles.stepConnector} ${
                      currentStep > step ? styles.stepConnectorActive : ''
                    }`}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Body */}
      <div className={styles.stepBody}>
        {currentStep === 1 && (
          <>
            <div className={styles.stepKicker}>第 1 步：确定产品产物形态与场景目标</div>
            <div className={styles.cardsGrid}>
              {SURFACES.map((item) => {
                const selected = selectedSurface.id === item.id;
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    className={`${styles.selectionCard} ${
                      selected ? styles.selectionCardSelected : ''
                    }`}
                    onClick={() => setSelectedSurface(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setSelectedSurface(item);
                    }}
                  >
                    <div className={styles.cardIconBox}>{item.icon}</div>
                    <div className={styles.cardTitle}>{item.title}</div>
                    <div className={styles.cardDesc}>{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className={styles.stepKicker}>第 2 步：锁定核心目标受众群体</div>
            <div className={styles.cardsGrid}>
              {AUDIENCES.map((item) => {
                const selected = selectedAudience.id === item.id;
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    className={`${styles.selectionCard} ${
                      selected ? styles.selectionCardSelected : ''
                    }`}
                    onClick={() => setSelectedAudience(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setSelectedAudience(item);
                    }}
                  >
                    <div className={styles.cardIconBox}>{item.icon}</div>
                    <div className={styles.cardTitle}>{item.title}</div>
                    <div className={styles.cardDesc}>{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className={styles.stepKicker}>第 3 步：设计语气与风格方向混合（滑杆插值）</div>
            <div className={styles.blendSection}>
              <div className={styles.blendHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sliders size={14} color="var(--od-color-primary)" />
                  <span>实时设计调性插值 (Direction Blend)</span>
                </div>
                <span>混合比例: {100 - blendRatio}% : {blendRatio}%</span>
              </div>

              <div className={styles.blendSliderRow}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={blendRatio}
                  className={styles.sliderInput}
                  onChange={(e) => setBlendRatio(Number(e.target.value))}
                />
              </div>

              <div className={styles.blendLabels}>
                <span>极简科技 (Minimal Tech)</span>
                <span>活力潮流 (Vibrant Pop)</span>
              </div>

              {/* Real-time Blended Palette Bar */}
              <div className={styles.previewPaletteBar}>
                {blendedColors.map((hex, i) => (
                  <div key={i} className={styles.paletteCell} style={{ backgroundColor: hex }} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Step Footer */}
      <div className={styles.stepFooter}>
        {currentStep > 1 ? (
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setCurrentStep((s) => s - 1)}
          >
            <ChevronLeft size={14} />
            <span>上一步</span>
          </button>
        ) : handleDismiss ? (
          <button type="button" className={styles.navButton} onClick={handleDismiss}>
            取消
          </button>
        ) : <div />}

        {currentStep < 3 ? (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonPrimary}`}
            onClick={() => setCurrentStep((s) => s + 1)}
          >
            <span>下一步</span>
            <ChevronRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonPrimary}`}
            onClick={handleFinish}
          >
            <Play size={13} />
            <span>确认构想并交给 Agent</span>
          </button>
        )}
      </div>
    </div>
  );
}
