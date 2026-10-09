import { useState, type FormEvent } from 'react';

type AuthMode = 'login' | 'register';

function Mark({ kind }: { kind: 'mail' | 'lock' | 'eye' | 'spark' | 'template' | 'file' | 'briefcase' | 'github' | 'google' }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const };
  if (kind === 'google') return <svg {...common} viewBox="0 0 24 24" stroke="none"><path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.42-.18-2.09H12v3.95h5.38a4.6 4.6 0 0 1-2 3.02v2.56h3.24c1.9-1.75 2.98-4.33 2.98-7.44Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.56c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.64A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.85A6 6 0 0 1 6.1 12c0-.64.11-1.26.31-1.85V7.51H3.06A10 10 0 0 0 2 12c0 1.62.39 3.16 1.06 4.49l3.35-2.64Z"/><path fill="#EA4335" d="M12 6.03c1.47 0 2.79.5 3.83 1.52l2.87-2.87C16.96 3.02 14.7 2 12 2a10 10 0 0 0-8.94 5.51l3.35 2.64C7.2 7.79 9.4 6.03 12 6.03Z"/></svg>;
  if (kind === 'github') return <svg {...common} fill="currentColor" stroke="none"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.68-3.76-1.31-3.76-1.31-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.75 1.91 3.33 1.46.1-.72.4-1.21.72-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.1-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.16 1.78 1.16 3 0 4.29-2.62 5.24-5.11 5.51.4.35.76 1.03.76 2.08V22c0 .29.2.63.76.53A11.1 11.1 0 0 0 12 .9Z"/></svg>;
  const paths: Record<string, React.ReactNode> = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    lock: <><rect x="4.5" y="10" width="15" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/></>,
    eye: <><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></>,
    spark: <><path d="m12 2 2.1 6.2L20 10l-5.9 2.1L12 18l-2.1-5.9L4 10l5.9-1.8L12 2Z"/><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/></>,
    template: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h8M8 12h5"/></>,
    file: <><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Z"/><path d="M13 3v7h7"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></>,
  };
  return <svg {...common}>{paths[kind]}</svg>;
}

export function DesignBudyyAuthView() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [notice, setNotice] = useState('');
  const [prompt, setPrompt] = useState('帮我生成一个现代简约的海报设计');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === 'register' && password !== confirm) {
      setNotice('两次输入的密码不一致，请检查后重试。');
      return;
    }
    setNotice('界面已就绪，但当前项目尚未配置 DesignBudyy 账号认证服务，暂时无法实际登录或创建账号。');
  }

  return (
    <main className={`db-auth ${dark ? 'db-auth--dark' : ''}`}>
      <header className="db-auth__topbar">
        <a className="db-auth__brand" href="/onboarding" aria-label="DesignBudyy 首页">
          <span className="db-auth__brand-mark"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M4 7.2 13.5 2 24 7.8v12.1l-9.5 5.2L4 19.8V7.2Z" fill="currentColor"/><path d="M4 7.2 14.5 13 24 7.8M14.5 13v12.8" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M4 7.2 14.5 13v12.8L4 19.8V7.2Z" fill="currentColor" opacity=".75"/></svg></span>
          <span>DesignBudyy</span>
        </a>
        <div className="db-auth__theme" aria-label="切换主题">
          <button type="button" className={!dark ? 'is-active' : ''} onClick={() => setDark(false)} aria-label="浅色模式">☼</button>
          <button type="button" className={dark ? 'is-active' : ''} onClick={() => setDark(true)} aria-label="深色模式">☾</button>
        </div>
      </header>

      <div className="db-auth__layout">
        <section className="db-auth__intro">
          <div className="db-auth__eyebrow"><Mark kind="spark"/> AI 驱动的设计创作平台</div>
          <h1>让创意更简单<br/>让设计更高效</h1>
          <p className="db-auth__lead">DesignBudyy 结合 AI 能力与丰富的设计资源，<br className="db-auth__desktop-break"/>帮助你快速生成、编辑和管理设计作品。</p>

          <div className="db-auth__features">
            <div><span><Mark kind="spark"/></span><b>AI 设计生成</b><small>输入想法，快速出图</small></div>
            <div><span><Mark kind="template"/></span><b>海量模板</b><small>覆盖多种设计场景</small></div>
            <div><span><Mark kind="file"/></span><b>海量素材</b><small>扩展更多创作能力</small></div>
            <div><span><Mark kind="briefcase"/></span><b>项目管理</b><small>高效组织你的作品</small></div>
          </div>

          <div className="db-auth__showcase">
            <form className="db-auth__prompt" onSubmit={(e) => { e.preventDefault(); setNotice('请先登录 DesignBudyy，再开始创建你的设计。'); }}>
              <Mark kind="spark"/><input aria-label="设计灵感提示" value={prompt} onChange={e => setPrompt(e.target.value)} /><button aria-label="提交设计提示">→</button>
            </form>
            <div className="db-auth__mock">
              <aside><strong>AI 设计助手</strong><span>◈　图像生成</span><span>◇　风格转换</span><span>▧　文案设计</span><span>▤　图表设计</span><span>◎　更多功能</span></aside>
              <div className="db-auth__poster"><b>Better<br/>Design<br/>Better Life</b><div className="db-auth__poster-art"><i/><i/><i/></div><small>Modern Design<br/>For a Better Tomorrow</small></div>
              <div className="db-auth__floating db-auth__floating--one"/><div className="db-auth__floating db-auth__floating--two"/><div className="db-auth__scribble">从灵感到作品<br/>只需几步 ↗</div>
            </div>
          </div>
          <div className="db-auth__stats"><span>▱　数万优质模板</span><i/><span>♧　100+ 插件工具</span><i/><span>♧　支持多种格式导出</span></div>
        </section>

        <section className="db-auth__panel" aria-label={mode === 'login' ? '登录' : '注册'}>
          <div className="db-auth__tabs" role="tablist" aria-label="账号操作">
            <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'is-active' : ''} onClick={() => { setMode('login'); setNotice(''); }}>登录</button>
            <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'is-active' : ''} onClick={() => { setMode('register'); setNotice(''); }}>注册</button>
          </div>
          <p className="db-auth__welcome">{mode === 'login' ? '欢迎回来，请登录你的账号' : '创建你的 DesignBudyy 账号，开启设计之旅'}</p>
          <form className="db-auth__form" onSubmit={submit}>
            <label className="db-auth__field"><Mark kind="mail"/><input type="email" autoComplete="email" placeholder="请输入邮箱或手机号" value={email} onChange={e => setEmail(e.target.value)} required aria-label="邮箱"/></label>
            <label className="db-auth__field"><Mark kind="lock"/><input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="请输入密码" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required aria-label="密码"/><button type="button" className="db-auth__eye" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? '隐藏密码' : '显示密码'}><Mark kind="eye"/></button></label>
            {mode === 'register' && <label className="db-auth__field"><Mark kind="lock"/><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="请再次输入密码" value={confirm} onChange={e => setConfirm(e.target.value)} minLength={8} required aria-label="确认密码"/></label>}
            {mode === 'login' && <div className="db-auth__options"><label><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/> 记住我</label><button type="button" onClick={() => setNotice('请联系管理员配置账号找回服务。')}>忘记密码?</button></div>}
            {notice && <p className="db-auth__notice" role="status">{notice}</p>}
            <button className="db-auth__submit" type="submit">{mode === 'login' ? '登录' : '创建账号'}</button>
          </form>
          <div className="db-auth__or"><span/><small>或</small><span/></div>
          <div className="db-auth__oauth">
            <button type="button" onClick={() => setNotice('GitHub OAuth 尚未配置，暂时无法授权登录。')}><Mark kind="github"/> 使用 GitHub 登录</button>
            <button type="button" onClick={() => setNotice('Google OAuth 尚未配置，暂时无法授权登录。')}><Mark kind="google"/> 使用 Google 登录</button>
          </div>
          <p className="db-auth__switch">{mode === 'login' ? '还没有账号？' : '已经有账号？'} <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setNotice(''); }}>{mode === 'login' ? '立即注册' : '返回登录'}</button></p>
          <p className="db-auth__fineprint">继续即表示你同意我们的服务条款与隐私政策。</p>
        </section>
      </div>
    </main>
  );
}
