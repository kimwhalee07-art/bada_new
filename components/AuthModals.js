'use client';
import React, { useState } from 'react';

export default function AuthModals({
  showLoginModal,
  setShowLoginModal,
  showUserMenuModal,
  setShowUserMenuModal,
  currentUser,
  setCurrentUser
}) {
  const [authTab, setAuthTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', password: '', name: '', email: '' });
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    try {
      const users = JSON.parse(localStorage.getItem('bada_users') || '[]');
      const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);

      if (user) {
        localStorage.setItem('bada_user_session', JSON.stringify(user));
        setCurrentUser(user);
        window.dispatchEvent(new Event('storage'));
        setShowLoginModal(false);
        alert(`반갑습니다, ${user.name || user.username}님!`);
      } else {
        const demoUser = {
          id: '0000_0000_9999',
          username: loginForm.username,
          name: loginForm.username,
          email: `${loginForm.username}@badahub.co.kr`,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('bada_user_session', JSON.stringify(demoUser));
        setCurrentUser(demoUser);
        window.dispatchEvent(new Event('storage'));
        setShowLoginModal(false);
        alert(`반갑습니다, ${demoUser.username}님!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.username || regForm.username.length < 3) {
      setRegError('아이디는 영문/숫자 3자 이상이어야 합니다.');
      return;
    }
    if (!regForm.password || regForm.password.length < 4) {
      setRegError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    if (!regForm.name || !regForm.email) {
      setRegError('성함과 이메일을 모두 입력해주세요.');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('bada_users') || '[]');
      if (users.some(u => u.username === regForm.username)) {
        setRegError('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
        return;
      }

      const seqNumber = String(users.length + 1).padStart(4, '0');
      const newUser = {
        id: `0000_0000_${seqNumber}`,
        username: regForm.username,
        password: regForm.password,
        name: regForm.name,
        email: regForm.email,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('bada_users', JSON.stringify(users));
      localStorage.setItem('bada_user_session', JSON.stringify(newUser));
      setCurrentUser(newUser);
      window.dispatchEvent(new Event('storage'));

      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail: newUser.email,
            subject: '[바다 BADA] 회원가입을 진심으로 환영합니다!',
            activityType: 'SIGNUP_WELCOME',
            details: {
              아이디: newUser.username,
              성함: newUser.name,
              가입일시: newUser.createdAt,
              한패스수수료0원코드: 'BADA2026'
            }
          })
        });
      } catch (mailErr) {
        console.error('Welcome email failed:', mailErr);
      }

      alert(`🎉 회원가입이 완료되었습니다!\n가입 안내 메일이 ${newUser.email}로 발송되었습니다.`);
      setShowLoginModal(false);
    } catch (err) {
      console.error(err);
      setRegError('회원가입 처리 중 오류가 발생했습니다.');
    }
  };

  const handleSocialAuthClick = (provider) => {
    alert(`${provider.toUpperCase()} 소셜 로그인은 공식 API 승인 준비 중입니다. 일반 회원가입을 이용해 주세요.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('bada_user_session');
    setCurrentUser(null);
    window.dispatchEvent(new Event('storage'));
    setShowUserMenuModal(false);
    alert('로그아웃되었습니다.');
  };

  const handleDeleteAccount = () => {
    if (!window.confirm('정말 회원 탈퇴하시겠습니까?\n탈퇴 시 계정 정보 및 상담 내역이 모두 파기됩니다.')) {
      return;
    }
    try {
      const users = JSON.parse(localStorage.getItem('bada_users') || '[]');
      const filtered = users.filter(u => u.username !== currentUser.username);
      localStorage.setItem('bada_users', JSON.stringify(filtered));
      localStorage.removeItem('bada_user_session');
      setCurrentUser(null);
      window.dispatchEvent(new Event('storage'));
      setShowUserMenuModal(false);
      alert('회원 탈퇴가 정상적으로 처리되었습니다. 이용해 주셔서 감사합니다.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {showLoginModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '100%', maxWidth: '420px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '20px', color: '#94a3b8', cursor: 'pointer' }}>×</button>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <button
                onClick={() => { setAuthTab('login'); setRegError(''); }}
                style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: authTab === 'login' ? 'bold' : 'normal', color: authTab === 'login' ? '#0284c7' : '#64748b', cursor: 'pointer', paddingBottom: '6px', borderBottom: authTab === 'login' ? '2px solid #0284c7' : 'none' }}
              >
                로그인
              </button>
              <button
                onClick={() => { setAuthTab('register'); setRegError(''); }}
                style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: authTab === 'register' ? 'bold' : 'normal', color: authTab === 'register' ? '#0284c7' : '#64748b', cursor: 'pointer', paddingBottom: '6px', borderBottom: authTab === 'register' ? '2px solid #0284c7' : 'none' }}
              >
                새 계정 만들기
              </button>
            </div>

            {authTab === 'login' ? (
              <div>
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="아이디 (Username)"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    style={{ padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    required
                  />
                  <input
                    type="password"
                    placeholder="비밀번호 (Password)"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={{ padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    required
                  />
                  <button type="submit" style={{ padding: '12px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>
                    로그인
                  </button>
                </form>

                <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>간편 SNS 로그인</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleSocialAuthClick('google')}
                      style={{ flex: 1, padding: '10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <span>🌐</span> Google 연동
                    </button>
                    <button
                      onClick={() => handleSocialAuthClick('wechat')}
                      style={{ flex: 1, padding: '10px', backgroundColor: '#07c160', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <span>💬</span> WeChat 연동
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="희망 아이디 (Username - 영문/숫자 3자 이상) *"
                    value={regForm.username}
                    onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                    style={{ padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    required
                  />
                  <input
                    type="password"
                    placeholder="비밀번호 (Password) *"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    style={{ padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="성함 (Name / 여권 영문명) *"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    style={{ padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    required
                  />
                  <input
                    type="email"
                    placeholder="이메일 (Email - 환영안내 및 접수증 수신) *"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    style={{ padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    required
                  />

                  {regError && (
                    <div style={{ padding: '8px 12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '12px' }}>
                      {regError}
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                    * 가입 즉시 공식 메일(bada@badahub.co.kr)로 가입 확인 및 한패스 수수료 0원 코드가 자동 발송됩니다.
                  </div>

                  <button type="submit" style={{ padding: '12px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>
                    회원가입 완료
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {showUserMenuModal && currentUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '100%', maxWidth: '400px', padding: '26px', position: 'relative' }}>
            <button onClick={() => setShowUserMenuModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '20px', color: '#94a3b8', cursor: 'pointer' }}>×</button>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>내 계정 정보</h3>
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '16px', marginBottom: '20px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>아이디:</strong> {currentUser.username}</div>
              <div><strong>성함:</strong> {currentUser.name}</div>
              <div><strong>이메일:</strong> {currentUser.email}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handleLogout} style={{ width: '100%', padding: '11px', backgroundColor: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                로그아웃
              </button>
              <button onClick={handleDeleteAccount} style={{ width: '100%', padding: '11px', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                회원 탈퇴 (계정 및 정보 영구 삭제)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
