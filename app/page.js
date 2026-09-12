'use client';
import React, { useState, useEffect } from 'react';
import { translations } from '../lib/translations';
import Navbar from '../components/Navbar';
import ApplyModal from '../components/ApplyModal';
import AuthModals from '../components/AuthModals';
import InternetModal from '../components/InternetModal';
import ChatWidget from '../components/ChatWidget';

export default function BadaPage() {
  const [lang, setLang] = useState('ko');
  const t = translations[lang] || translations.ko;

  // 인증 및 사용자 상태
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenuModal, setShowUserMenuModal] = useState(false);

  // 모달 상태
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showInternetModal, setShowInternetModal] = useState(false);

  // 필터 및 상태
  const [planFilter, setPlanFilter] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // 요금제 기본 데이터
  const [simPlans] = useState([
    { id: 1, telecomCategory: 'mvno', telecomName: '알뜰폰 KT망', name: '데이터 안심 15GB+ (알뜰폰)', price: '27,500', data: '15GB + 3Mbps 무제한', call: '기본제공 (무제한)', sms: '기본제공', isPopular: true, tag: '외국인 선호 1위' },
    { id: 2, telecomCategory: 'mvno', telecomName: '알뜰폰 LG U+망', name: '초저가 실속 7GB (알뜰폰)', price: '17,900', data: '7GB + 1Mbps 무제한', call: '기본제공', sms: '기본제공', isPopular: false, tag: '가성비 추천' },
    { id: 3, telecomCategory: 'mvno', telecomName: '알뜰폰 SKT망', name: '완전 무제한 일 5GB+ (알뜰폰)', price: '39,600', data: '매일 5GB + 5Mbps 무제한', call: '무제한', sms: '무제한', isPopular: true, tag: '헤비 유저용' },
    { id: 4, telecomCategory: 'mno', telecomName: 'KT 공식', name: 'KT 5G 슬림 베이직 (통신사)', price: '55,000', data: '21GB + 1Mbps 무제한', call: '집/이동전화 무제한', sms: '기본제공', isPopular: false, tag: 'KT 멤버십 혜택' },
    { id: 5, telecomCategory: 'mno', telecomName: 'SK telecom 공식', name: 'SKT 5GX 레귤러 (통신사)', price: '69,000', data: '110GB + 5Mbps 속도제어', call: '무제한', sms: '무제한', isPopular: true, tag: 'T멤버십 VIP' },
    { id: 6, telecomCategory: 'mno', telecomName: 'LG U+ 공식', name: 'LG U+ 5G 프리미어 (통신사)', price: '75,000', data: '완전 무제한 (속도제어 없음)', call: '무제한', sms: '무제한', isPopular: false, tag: '외국인 프리미엄' }
  ]);

  useEffect(() => {
    try {
      const sess = localStorage.getItem('bada_user_session');
      if (sess) setCurrentUser(JSON.parse(sess));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const openApplyWithPlan = (planId) => {
    setSelectedPlanId(planId);
    setShowApplyModal(true);
  };

  const handleCopyPartnerCode = () => {
    navigator.clipboard.writeText('BADA2026');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const displayedPlans = simPlans.filter(p => {
    if (planFilter === 'all') return true;
    return (p.telecomCategory || 'mvno') === planFilter;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* 1. 상단 네비게이션 헤더 */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        currentUser={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenUserMenu={() => setShowUserMenuModal(true)}
        onOpenApply={() => openApplyWithPlan(null)}
      />

      {/* 2. 히어로 배너 섹션 */}
      <section style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)', padding: '70px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '20px' }}>
            {t.hero.badge}
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', lineHeight: '1.25', margin: '0 0 16px 0', color: '#0f172a', letterSpacing: '-1px' }}>
            {t.hero.title1} <span style={{ color: '#0284c7' }}>{t.hero.title2}</span>{t.hero.title3}
          </h1>
          <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.6', margin: '0 0 32px 0' }}>
            {t.hero.desc}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => openApplyWithPlan(null)} style={{ padding: '14px 28px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2,132,199,0.3)' }}>
              {t.hero.btnPlans}
            </button>
            <button onClick={() => setShowInternetModal(true)} style={{ padding: '14px 28px', backgroundColor: '#ffffff', color: '#0284c7', border: '1px solid #bae6fd', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              {t.hero.btnInternet}
            </button>
          </div>
        </div>
      </section>

      {/* 3. 유심 요금제 섹션 */}
      <section id="plans" style={{ maxWidth: '1140px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '800', margin: '0 0 8px 0', color: '#0f172a' }}>{t.plansSec.title}</h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>{t.plansSec.sub}</p>
          <div style={{ display: 'inline-flex', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '10px', marginTop: '20px', gap: '4px' }}>
            {[
              { id: 'all', label: t.plansSec.filterAll },
              { id: 'mvno', label: t.plansSec.filterMvno },
              { id: 'mno', label: t.plansSec.filterMno }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPlanFilter(tab.id)}
                style={{
                  padding: '8px 18px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: planFilter === tab.id ? '#ffffff' : 'transparent',
                  color: planFilter === tab.id ? '#0284c7' : '#64748b'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 요금제 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {displayedPlans.map(p => (
            <div
              key={p.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: p.isPopular ? '2px solid #0284c7' : '1px solid #e2e8f0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: p.isPopular ? '0 8px 24px rgba(2,132,199,0.12)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {p.tag && (
                <div style={{ position: 'absolute', top: '-10px', right: '16px', backgroundColor: p.telecomCategory === 'mno' ? '#6366f1' : '#0284c7', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px' }}>
                  {p.tag}
                </div>
              )}
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}>{p.telecomName}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 12px 0' }}>{p.name}</h3>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                ₩ {p.price} <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#64748b' }}>/ 월</span>
              </div>
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div><strong>데이터:</strong> {p.data}</div>
                <div><strong>음성통화:</strong> {p.call}</div>
                <div><strong>문자:</strong> {p.sms}</div>
              </div>
              <button
                onClick={() => openApplyWithPlan(p.id)}
                style={{ marginTop: 'auto', width: '100%', padding: '12px', backgroundColor: p.isPopular ? '#0284c7' : '#f1f5f9', color: p.isPopular ? '#ffffff' : '#334155', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {t.plansSec.applyBtn}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 초고속 인터넷 & TV 섹션 */}
      <section id="internet" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '30px' }}>
          <div style={{ flex: '1 1 450px' }}>
            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>
              {t.internetSec.tag}
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: '800', margin: '0 0 12px 0', lineHeight: '1.3' }}>{t.internetSec.title}</h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: '0 0 20px 0' }}>{t.internetSec.sub}</p>
            <button onClick={() => setShowInternetModal(true)} style={{ padding: '12px 24px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
              {t.internetSec.btnApply}
            </button>
          </div>
          <div style={{ flex: '1 1 350px', backgroundColor: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold' }}>지원 통신사</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {['KT 인터넷', 'SK브로드밴드', 'LG U+ 인터넷', '알뜰 스카이라이프'].map(item => (
                <div key={item} style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '600', textAlign: 'center' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 생활 가전 렌탈 섹션 */}
      <section id="rental" style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ color: '#0284c7', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>{t.rentalSec.tag}</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '8px 0' }}>{t.rentalSec.title}</h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>{t.rentalSec.sub}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {['정수기 렌탈 (쿠쿠/LG)', '공기청정기', '비데 / 매트리스'].map((title, i) => (
            <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{i === 0 ? '💧' : (i === 1 ? '💨' : '✨')}</div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{title}</h4>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>외국인등록증 간편 심사 · 등록비/설치비 전액 면제</p>
              <button onClick={() => setShowInternetModal(true)} style={{ width: '100%', padding: '10px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', color: '#334155', cursor: 'pointer' }}>
                {t.rentalSec.btnApply}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 한패스 해외송금 섹션 */}
      <section id="hanpass" style={{ backgroundColor: '#064e3b', color: '#ffffff', padding: '60px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '12px', fontSize: '12px', color: '#6ee7b7', marginBottom: '14px' }}>
            {t.hanpassSec.badge}
          </div>
          <h2 style={{ fontSize: '30px', fontWeight: '800', margin: '0 0 12px 0' }}>{t.hanpassSec.title1} {t.hanpassSec.title2}</h2>
          <p style={{ fontSize: '14px', color: '#a7f3d0', margin: '0 0 24px 0', lineHeight: '1.6' }}>{t.hanpassSec.desc}</p>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(0,0,0,0.25)', border: '1px dashed #34d399', borderRadius: '12px', padding: '16px 28px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>{t.hanpassSec.codeLabel}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '1px' }}>BADA2026</div>
            <button onClick={handleCopyPartnerCode} style={{ marginTop: '8px', backgroundColor: '#059669', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              {copiedCode ? t.hanpassSec.copied : t.hanpassSec.copy}
            </button>
          </div>
          <br />
          <a href="https://www.hanpass.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#10b981', color: '#ffffff', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>
            {t.hanpassSec.btnApp}
          </a>
        </div>
      </section>

      {/* 7. 오프라인 수령 매장 안내 */}
      <section id="stores" style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0' }}>{t.deliverySec.title}</h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>{t.deliverySec.sub}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 'bold' }}>📍 천안 본점 (천안역 3분)</h4>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>충남 천안시 동남구 대흥로 (천안역 서부광장 인근)</p>
            <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 'bold' }}>다국어 상담원 상주 · 즉시 개통</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 'bold' }}>📍 안산점 (원곡동 다문화거리)</h4>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>경기 안산시 단원구 다문화길 (안산역 1번 출구)</p>
            <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 'bold' }}>주말/공휴일 영업 · 알뜰폰/통신3사 완비</div>
          </div>
        </div>
      </section>

      {/* 8. FAQ 자주 묻는 질문 */}
      <section id="faq" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '60px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', margin: '0 0 32px 0' }}>{t.faqSec.title}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {t.faqsData.map((faq, idx) => (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  style={{ width: '100%', padding: '16px 20px', backgroundColor: '#f8fafc', border: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 'bold', color: '#0f172a', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '18px', color: '#94a3b8' }}>{openFaqIndex === idx ? '−' : '+'}</span>
                </button>
                {openFaqIndex === idx && (
                  <div style={{ padding: '16px 20px', backgroundColor: '#ffffff', fontSize: '14px', color: '#475569', lineHeight: '1.6', borderTop: '1px solid #e2e8f0' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. 푸터 */}
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '40px 20px', fontSize: '12px', lineHeight: '1.8' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>🌊 바다 BADA</div>
            <div>외국인을 위한 한국 생활 원스톱 통신 & 금융 포털</div>
            <div>공식 문의: bada@badahub.co.kr | 제휴 문의: partner@badahub.co.kr</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>© 2026 BADA Hub Inc. All rights reserved.</div>
            <div>개인정보처리방침 | 서비스이용약관 | 통신판매업신고 완료</div>
          </div>
        </div>
      </footer>

      {/* 10. 모달 및 위젯 컴포넌트 */}
      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        currentUser={currentUser}
        simPlans={simPlans}
        defaultPlanId={selectedPlanId}
        onSuccess={() => {}}
      />

      <AuthModals
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        showUserMenuModal={showUserMenuModal}
        setShowUserMenuModal={setShowUserMenuModal}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      <InternetModal
        isOpen={showInternetModal}
        onClose={() => setShowInternetModal(false)}
        onSuccess={() => {}}
      />

      <ChatWidget
        lang={lang}
        t={t}
        currentUser={currentUser}
      />

    </div>
  );
}
