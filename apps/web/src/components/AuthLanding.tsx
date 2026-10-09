'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  FileImage,
  FolderKanban,
  Github,
  Layers,
  LockKeyhole,
  Mail,
  Moon,
  PanelsTopLeft,
  Puzzle,
  ShieldCheck,
  Sparkles,
  Sun,
  WandSparkles,
} from 'lucide-react';
import { CloudSignInTip } from './CloudSignInTip';

type AuthMode = 'login' | 'register';
type Feedback = { kind: 'info' | 'error'; message: string } | null;

interface AuthLandingProps {
  onAuthSuccess: () => void;
  onContinueLocal: () => void;
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="auth-landing__feature">
      <span className="auth-landing__feature-icon" aria-hidden>{icon}</span>
      <span className="auth-landing__feature-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
    </div>
  );
}

function GoogleGlyph() {
  return <span className="auth-landing__google-g" aria-hidden>G</span>;
}

export function AuthLanding({
  onAuthSuccess,
  onContinueLocal,
}: AuthLandingProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [dark, setDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setFeedback(null);
    setPassword('');
    setConfirmPassword('');
  }

  function submitEmailForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFeedback({ kind: 'error', message: '请输入有效的邮箱地址。' });
      return;
    }
    if (password.length < 8) {
      setFeedback({ kind: 'error', message: '密码至少需要 8 个字符。' });
      return;
    }
    if (mode === 'register') {
      if (password !== confirmPassword) {
        setFeedback({ kind: 'error', message: '两次输入的密码不一致，请检查后重试。' });
        return;
      }
      if (!acceptedTerms) {
        setFeedback({ kind: 'error', message: '请先阅读并同意服务条款与隐私政策。' });
        return;
      }
      setFeedback({
        kind: 'info',
        message: '邮箱注册服务尚未接入当前版本。你可以使用下方 OpenDesign Cloud 授权登录，或先进入本地工作台。',
      });
      return;
    }

    setFeedback({
      kind: 'info',
      message: '当前版本尚未接入邮箱与密码认证。请使用 OpenDesign Cloud 授权登录，或先进入本地工作台。',
    });
  }

  function explainProvider(provider: 'GitHub' | 'Google') {
    setFeedback({
      kind: 'info',
      message: provider + ' 账号授权尚未接入当前客户端。你可以使用 OpenDesign Cloud 授权登录，或先进入本地工作台。',
    });
  }

  return (
    <div className={'auth-landing' + (dark ? ' auth-landing--dark' : '')}>
      <header className="auth-landing__topbar">
        <a className="auth-landing__brand" href="/" aria-label="OpenDesign 首页">
          <span className="auth-landing__brand-mark" aria-hidden>
            <Layers size={25} strokeWidth={2.6} />
          </span>
          <span>OpenDesign</span>
        </a>
        <div className="auth-landing__appearance" role="group" aria-label="切换界面主题">
          <button
            type="button"
            className={!dark ? 'is-active' : ''}
            aria-label="浅色模式"
            aria-pressed={!dark}
            onClick={() => setDark(false)}
          >
            <Sun size={17} />
          </button>
          <button
            type="button"
            className={dark ? 'is-active' : ''}
            aria-label="深色模式"
            aria-pressed={dark}
            onClick={() => setDark(true)}
          >
            <Moon size={17} />
          </button>
        </div>
      </header>

      <div className="auth-landing__layout">
        <section className="auth-landing__intro" aria-labelledby="auth-landing-title">
          <div className="auth-landing__eyebrow">
            <Sparkles size={15} />
            <span>AI 驱动的设计创作平台</span>
          </div>
          <h1 id="auth-landing-title">让创意更简单<br />让设计更高效</h1>
          <p className="auth-landing__lead">
            OpenDesign 结合 AI 能力与丰富的设计资源，<br className="auth-landing__desktop-break" />
            帮助你快速生成、编辑和管理设计作品。
          </p>

          <div className="auth-landing__features">
            <Feature
              icon={<WandSparkles size={19} />}
              title="AI 设计生成"
              description="输入想法，快速出图"
            />
            <Feature
              icon={<PanelsTopLeft size={19} />}
              title="海量模板"
              description="覆盖多种设计场景"
            />
            <Feature
              icon={<FileImage size={19} />}
              title="海量素材"
              description="扩展更多创作能力"
            />
            <Feature
              icon={<BriefcaseBusiness size={19} />}
              title="项目管理"
              description="高效组织你的作品"
            />
          </div>

          <div className="auth-landing__showcase" aria-label="OpenDesign 创意工作台预览">
            <div className="auth-landing__prompt-float">
              <span className="auth-landing__prompt-spark"><Sparkles size={15} /></span>
              <span>帮我生成一个现代简约的海报设计</span>
              <ArrowRight size={17} />
            </div>

            <div className="auth-landing__tools-float">
              <strong>AI 设计助手</strong>
              <span><FileImage size={13} /> 图像生成</span>
              <span><PanelsTopLeft size={13} /> 风格转换</span>
              <span><WandSparkles size={13} /> 文案设计</span>
              <span><FolderKanban size={13} /> 图表设计</span>
              <span><Puzzle size={13} /> 更多功能</span>
            </div>

            <div className="auth-landing__poster-stack auth-landing__poster-stack--back auth-landing__poster-stack--blue">
              <div className="auth-landing__abstract-blue" />
              <span>STUDIO / 02</span>
            </div>
            <div className="auth-landing__poster-stack auth-landing__poster-stack--back auth-landing__poster-stack--color">
              <div className="auth-landing__abstract-color" />
              <span>COLOR STUDY</span>
            </div>
            <div className="auth-landing__poster-stack auth-landing__poster-stack--back auth-landing__poster-stack--landscape">
              <div className="auth-landing__abstract-landscape">
                <i />
                <b />
              </div>
              <span>OPEN AIR / 04</span>
            </div>

            <div className="auth-landing__poster">
              <div className="auth-landing__poster-caption">DESIGN NOTES&nbsp; / &nbsp;VOL. 08</div>
              <div className="auth-landing__poster-title">Better<br />Design<br />Better Life</div>
              <div className="auth-landing__poster-art">
                <div className="auth-landing__poster-window" />
                <div className="auth-landing__poster-plant">
                  <i /><i /><i /><i /><b />
                </div>
                <div className="auth-landing__poster-chair">
                  <i /><b /><em />
                </div>
              </div>
              <div className="auth-landing__poster-footer">
                <span>Modern Design</span>
                <span>For a Better Tomorrow</span>
              </div>
            </div>

            <div className="auth-landing__thumbs">
              <span className="auth-landing__thumb auth-landing__thumb--blue" />
              <span className="auth-landing__thumb auth-landing__thumb--warm" />
              <span className="auth-landing__thumb auth-landing__thumb--paper" />
              <span className="auth-landing__thumb auth-landing__thumb--pink" />
              <span className="auth-landing__thumb-plus">+</span>
            </div>

            <div className="auth-landing__annotation">
              <span>从灵感到作品</span>
              <span>只需几步</span>
              <ArrowRight size={20} />
            </div>
          </div>

          <div className="auth-landing__benefits">
            <span><Layers size={16} /> 数万优质模板</span>
            <i />
            <span><Puzzle size={16} /> 100+ 插件工具</span>
            <i />
            <span><ShieldCheck size={16} /> 支持多种格式导出</span>
          </div>
        </section>

        <section className="auth-landing__auth" aria-label="登录或注册 OpenDesign">
          <div className="auth-landing__auth-card">
            <div className="auth-landing__tabs" role="tablist" aria-label="账号操作">
              <button
                id="auth-tab-login"
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                aria-controls="auth-form-panel"
                className={mode === 'login' ? 'is-active' : ''}
                onClick={() => changeMode('login')}
              >
                登录
              </button>
              <button
                id="auth-tab-register"
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                aria-controls="auth-form-panel"
                className={mode === 'register' ? 'is-active' : ''}
                onClick={() => changeMode('register')}
              >
                注册
              </button>
            </div>

            <div className="auth-landing__form-intro">
              <h2>{mode === 'login' ? '欢迎回来，登录你的账号' : '创建你的 OpenDesign 账号'}</h2>
              <p>
                {mode === 'login'
                  ? '登录后继续探索灵感，让创意快速落地。'
                  : '加入 OpenDesign，开始你的 AI 设计之旅。'}
              </p>
            </div>

            <form id="auth-form-panel" className="auth-landing__form" onSubmit={submitEmailForm}>
              <label className="auth-landing__field">
                <Mail size={18} aria-hidden />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="请输入邮箱地址"
                  aria-label="邮箱地址"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label className="auth-landing__field">
                <LockKeyhole size={18} aria-hidden />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder={mode === 'login' ? '请输入密码' : '设置密码（至少 8 位）'}
                  aria-label="密码"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="auth-landing__reveal"
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </label>

              {mode === 'register' ? (
                <>
                  <label className="auth-landing__field">
                    <ShieldCheck size={18} aria-hidden />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      autoComplete="new-password"
                      placeholder="请再次输入密码"
                      aria-label="确认密码"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="auth-landing__reveal"
                      aria-label={showConfirmPassword ? '隐藏确认密码' : '显示确认密码'}
                      onClick={() => setShowConfirmPassword((value) => !value)}
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </label>
                  <label className="auth-landing__terms">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(event) => setAcceptedTerms(event.target.checked)}
                    />
                    <span>
                      我已阅读并同意 <a href="/terms" onClick={(event) => event.preventDefault()}>服务条款</a> 与 <a href="/privacy" onClick={(event) => event.preventDefault()}>隐私政策</a>
                    </span>
                  </label>
                </>
              ) : (
                <div className="auth-landing__form-options">
                  <label className="auth-landing__remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <span>记住我</span>
                  </label>
                  <button
                    type="button"
                    className="auth-landing__text-button"
                    onClick={() => setFeedback({
                      kind: 'info',
                      message: '密码重置服务尚未接入当前版本，请先使用 OpenDesign Cloud 授权登录。',
                    })}
                  >
                    忘记密码？
                  </button>
                </div>
              )}

              {feedback ? (
                <div
                  className={'auth-landing__feedback auth-landing__feedback--' + feedback.kind}
                  role={feedback.kind === 'error' ? 'alert' : 'status'}
                >
                  {feedback.message}
                </div>
              ) : null}

              <button className="auth-landing__submit" type="submit">
                {mode === 'login' ? '登录' : '创建账号'}
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="auth-landing__divider"><span>或使用以下方式</span></div>

            <div className="auth-landing__providers">
              <button type="button" className="auth-landing__provider" onClick={() => explainProvider('GitHub')}>
                <Github size={18} fill="currentColor" />
                <span>使用 GitHub 登录</span>
              </button>
              <button type="button" className="auth-landing__provider" onClick={() => explainProvider('Google')}>
                <GoogleGlyph />
                <span>使用 Google 登录</span>
              </button>
            </div>

            <div className="auth-landing__cloud-option">
              <CloudSignInTip presentation="button" onSignedIn={onAuthSuccess} />
            </div>

            <p className="auth-landing__switch">
              {mode === 'login' ? '还没有账号？' : '已经有账号？'}
              <button
                type="button"
                onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? '立即注册' : '返回登录'}
              </button>
            </p>

            <button
              type="button"
              className="auth-landing__local-link"
              onClick={onContinueLocal}
            >
              暂时使用本地模式
            </button>
          </div>
          <div className="auth-landing__security-note">
            <ShieldCheck size={14} />
            <span>你的项目与创作始终由你掌控</span>
          </div>
        </section>
      </div>
    </div>
  );
}
