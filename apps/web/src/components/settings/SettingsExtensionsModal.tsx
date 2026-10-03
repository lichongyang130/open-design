import React, { useState } from 'react';
import {
  Settings,
  X,
  Keyboard,
  Users,
  BarChart3,
  CheckCircle2,
  Cpu,
  Coins,
  ShieldAlert,
} from 'lucide-react';
import styles from './SettingsExtensionsModal.module.css';

interface SettingsExtensionsModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'shortcuts' | 'team' | 'usage';
}

const SHORTCUTS = [
  { key: 'Space + Drag', desc: '画布任意自由平移 (Pan Canvas)' },
  { key: 'Cmd/Ctrl + Scroll', desc: '画布平滑无级缩放 (Zoom In/Out)' },
  { key: 'Cmd/Ctrl + Z', desc: '撤销上一步操作或直接操纵 (Undo)' },
  { key: 'Shift + Cmd/Ctrl + Z', desc: '重做下一步 (Redo)' },
  { key: 'Cmd/Ctrl + I', desc: '快速展开/收起设计系统检查器 (Toggle Inspector)' },
  { key: 'Cmd/Ctrl + D', desc: '复制当前选中元素或快速对比模式' },
  { key: 'Cmd/Ctrl + K', desc: '唤起快速项目切换器 (Quick Switcher)' },
];

const MEMBERS = [
  { name: 'Alex Rivera (You)', role: 'Workspace Owner', email: 'alex@company.com' },
  { name: 'Sarah Chen', role: 'Staff Product Designer', email: 'sarah@company.com' },
  { name: 'David Kim', role: 'Frontend Engineer', email: 'david@company.com' },
];

const USAGE_MODELS = [
  { model: 'Claude 3.7 Sonnet', usage: '62%', tokens: '1,420k tokens', color: '#635BFF' },
  { model: 'DeepSeek V3 / Flash', usage: '24%', tokens: '860k tokens', color: '#00D4B2' },
  { model: 'Codex / GPT-4o', usage: '14%', tokens: '310k tokens', color: '#10B981' },
];

export function SettingsExtensionsModal({
  open,
  onClose,
  initialTab = 'shortcuts',
}: SettingsExtensionsModalProps) {
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'team' | 'usage'>(initialTab);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <Settings size={18} color="var(--od-color-primary)" />
            <span>工作室高级设置 (Studio Workspace Hub)</span>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Bar */}
        <div className={styles.tabBar} role="tablist">
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'shortcuts' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('shortcuts')}
          >
            <Keyboard size={13} />
            <span>快捷键指南</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'team' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Users size={13} />
            <span>团队成员</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'usage' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('usage')}
          >
            <BarChart3 size={13} />
            <span>API 与模型用量</span>
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'shortcuts' && (
            <div className={styles.shortcutList}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                高效设计师常用键盘快捷键操作指南：
              </div>
              {SHORTCUTS.map((s) => (
                <div key={s.key} className={styles.shortcutItem}>
                  <span style={{ color: 'var(--text-strong)' }}>{s.desc}</span>
                  <span className={styles.keyBadge}>{s.key}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'team' && (
            <div className={styles.memberList}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                当前团队席位状态与多人协作权限：
              </div>
              {MEMBERS.map((m) => (
                <div key={m.email} className={styles.memberItem}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.email}</div>
                  </div>
                  <span className={styles.roleBadge}>{m.role}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'usage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Credit Box */}
              <div className={styles.usageCard}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Coins size={16} color="var(--od-color-primary)" />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>本月可用 Agent 积分与额度</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--od-color-primary)' }}>
                    $48.20 / $100.00
                  </span>
                </div>
              </div>

              {/* Models Breakdown */}
              <div className={styles.usageCard}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-strong)' }}>
                  各 Agent 模型调用比例与消耗
                </div>
                <div className={styles.chartBarGroup}>
                  {USAGE_MODELS.map((item) => (
                    <div key={item.model} className={styles.chartBarItem}>
                      <span style={{ width: 140 }}>{item.model}</span>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{ width: item.usage, backgroundColor: item.color }}
                        />
                      </div>
                      <span style={{ width: 90, textAlign: 'right', color: 'var(--text-muted)' }}>
                        {item.tokens}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
