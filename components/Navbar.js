'use client';
import React from 'react';

export default function Navbar({
  lang,
  setLang,
  t,
  currentUser,
  onOpenLogin,
  onOpenUserMenu,
  onOpenApply
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 20px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* 로고 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
          <span style={{ fontSize: '24px' }}>🌊</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#0284c7', letterSpacing: '-0.5px' }}>바다 BADA</span>
        </div>

        {/* 중앙 메뉴 (1줄 고정) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'nowrap', flexShrink: 0 }}>
          <a href="#plans" style={{ fontSize: '14px', fontWeight: '600', color: '#334155', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.nav.plans}</a>
          <a href="#internet" style={{ fontSize: '14px', fontWeight: '600', color: '#334155', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.nav.internet}</a>
          <a href="#rental" style={{ fontSize: '14px', fontWeight: '600', color: '#334155', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.nav.rental}</a>
          <a href="#hanpass" style={{ fontSize: '14px', fontWeight: '600', color: '#334155', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.nav.hanpass}</a>
          <a href="#stores" style={{ fontSize: '14px', fontWeight: '600', color: '#334155', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.nav.stores}</a>
          <a href="#faq" style={{ fontSize: '14px', fontWeight: '600', color: '#334155', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.nav.faq}</a>
        </nav>

        {/* 우측 도구모음 (1줄 고정) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* 다국어 선택 */}
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px', gap: '2px', flexShrink: 0 }}>
            {['ko', 'en', 'zh', 'vi'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: lang === l ? 'bold' : 'normal',
                  backgroundColor: lang === l ? '#ffffff' : 'transparent',
                  color: lang === l ? '#0284c7' : '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: lang === l ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 로그인 / 계정 버튼 */}
          {currentUser ? (
            <button
              onClick={onOpenUserMenu}
              style={{
                padding: '7px 12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <span>👤</span>
              <span>{currentUser.name || currentUser.username}님</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              style={{
                padding: '7px 12px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {t.nav.login}
            </button>
          )}

          {/* 신청하기 CTA */}
          <button
            onClick={() => onOpenApply(null)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {t.nav.apply}
          </button>
        </div>
      </div>
    </header>
  );
}
