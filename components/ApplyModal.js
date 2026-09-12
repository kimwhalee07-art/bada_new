'use client';
import React, { useState, useEffect } from 'react';

export default function ApplyModal({
  isOpen,
  onClose,
  currentUser,
  simPlans = [],
  defaultPlanId,
  onSuccess
}) {
  const [form, setForm] = useState({
    telecomCategory: 'mvno',
    carrier: 'KT망 알뜰폰',
    subType: 'new',
    plan: '',
    name: '',
    email: '',
    phone: '',
    deliveryMethod: 'store',
    alienNumber: '',
    address: ''
  });

  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        name: currentUser.name || currentUser.username || '',
        email: currentUser.email || ''
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (defaultPlanId) {
      const found = simPlans.find(p => p.id === defaultPlanId);
      if (found) {
        setForm(prev => ({
          ...prev,
          telecomCategory: found.telecomCategory || 'mvno',
          carrier: found.carrier || (found.telecomCategory === 'mno' ? 'KT' : 'KT망 알뜰폰'),
          plan: found.name
        }));
        return;
      }
    }
    const filtered = simPlans.filter(p => (p.telecomCategory || 'mvno') === form.telecomCategory);
    if (filtered.length > 0) {
      setForm(prev => ({ ...prev, plan: filtered[0].name }));
    }
  }, [defaultPlanId, form.telecomCategory, simPlans]);

  if (!isOpen) return null;

  const modalPlans = simPlans.filter(p => (p.telecomCategory || 'mvno') === form.telecomCategory);
  const carriers = form.telecomCategory === 'mvno' 
    ? ['KT망 알뜰폰', 'LG U+망 알뜰폰', 'SKT망 알뜰폰'] 
    : ['KT', 'SKT', 'LG U+'];

  const inputStyle = { width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' };
  const getBtnStyle = (active) => ({
    padding: '10px',
    borderRadius: '8px',
    border: active ? '2px solid #0284c7' : '1px solid #cbd5e1',
    backgroundColor: active ? '#f0f9ff' : '#ffffff',
    color: active ? '#0284c7' : '#334155',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'center'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert('성함과 연락처를 입력해주세요.');
      return;
    }

    const newOrder = {
      id: 'ORD-' + Date.now(),
      customerName: form.name,
      phone: form.phone,
      email: form.email || '미입력',
      telecomCategory: form.telecomCategory === 'mvno' ? '알뜰폰(MVNO)' : '통신 3사(MNO)',
      carrier: form.carrier,
      subType: form.subType === 'new' ? '신규가입' : '번호이동',
      planName: form.plan,
      deliveryMethod: form.deliveryMethod === 'store' ? '매장 픽업' : (form.deliveryMethod === 'delivery' ? '택배 배송' : 'eSIM 발급'),
      address: form.address || '매장 픽업/기본',
      status: '신규접수',
      createdAt: new Date().toISOString()
    };

    try {
      const cur = JSON.parse(localStorage.getItem('bada_live_orders') || '[]');
      cur.unshift(newOrder);
      localStorage.setItem('bada_live_orders', JSON.stringify(cur));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }

    if (form.email) {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail: form.email,
            subject: `[바다 BADA] ${newOrder.telecomCategory} 신청이 정상 접수되었습니다`,
            activityType: 'ORDER_SUBMISSION',
            details: {
              신청번호: newOrder.id,
              고객명: form.name,
              구분: newOrder.telecomCategory,
              통신망: form.carrier,
              신청요금제: form.plan,
              수령방식: newOrder.deliveryMethod
            }
          })
        });
      } catch (err) {
        console.error('Email send failed:', err);
      }
    }

    alert(`🎉 ${newOrder.telecomCategory} (${form.plan}) 신청이 완료되었습니다!\nbada@badahub.co.kr에서 접수 확인 메일이 발송됩니다.`);
    if (onSuccess) onSuccess(newOrder);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '22px', color: '#94a3b8', cursor: 'pointer' }}>×</button>

        <h3 style={{ fontSize: '21px', fontWeight: '800', margin: '0 0 4px 0' }}>유심 간편 신청서</h3>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
          알뜰폰(MVNO) 및 통신 3사 중 원하시는 방식을 선택하여 신청하세요.
        </p>

        {currentUser && (
          <div style={{ fontSize: '12px', color: '#0284c7', backgroundColor: '#f0f9ff', padding: '8px 12px', borderRadius: '8px', marginBottom: '14px' }}>
            👤 {currentUser.name || currentUser.username} 회원님 정보가 자동 입력되었습니다.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1단계: 통신 구분 선택 */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
              1. 통신 구분 선택 *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, telecomCategory: 'mvno', carrier: 'KT망 알뜰폰', plan: '데이터 안심 15GB+ (알뜰폰)' }))}
                style={getBtnStyle(form.telecomCategory === 'mvno')}
              >
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>📱 알뜰폰 (MVNO)</div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>초저가 · 무약정 · 여권개통</div>
              </button>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, telecomCategory: 'mno', carrier: 'KT', plan: 'KT 5G 슬림 베이직' }))}
                style={getBtnStyle(form.telecomCategory === 'mno')}
              >
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>🏢 통신 3사 (MNO)</div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>정규 5G · 멤버십 · 기기할부</div>
              </button>
            </div>
          </div>

          {/* 2단계: 통신망 선택 */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
              2. 희망 통신망 선택 *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {carriers.map(net => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, carrier: net }))}
                  style={getBtnStyle(form.carrier === net)}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          {/* 3단계: 가입 방식 선택 */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
              3. 가입 방식 *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, subType: 'new' }))}
                style={getBtnStyle(form.subType === 'new')}
              >
                ✨ 신규 가입 (새 번호)
              </button>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, subType: 'port_in' }))}
                style={getBtnStyle(form.subType === 'port_in')}
              >
                🔄 번호 이동 (기존 번호)
              </button>
            </div>
          </div>

          {/* 4단계: 요금제 선택 */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
              4. 신청 요금제 선택 *
            </label>
            <select
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
              style={{ ...inputStyle, backgroundColor: '#ffffff' }}
            >
              {modalPlans.map(p => (
                <option key={p.id} value={p.name}>
                  [{p.telecomName}] {p.name} (₩ {p.price})
                </option>
              ))}
            </select>
          </div>

          {/* 5단계: 인적사항 입력 */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
              5. 고객 인적사항 *
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                placeholder="👤 성함 (여권 영문명 / Name) *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="✉️ 접수증 받을 이메일 *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  required
                />
                <input
                  type="tel"
                  placeholder="📞 연락처 (Phone) *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          {/* 6단계: 수령 방식 선택 */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
              6. 수령 방식 선택 *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[
                { id: 'store', label: '🏬 매장 픽업' },
                { id: 'delivery', label: '📦 택배 배송' },
                { id: 'esim', label: '📲 eSIM 발급' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, deliveryMethod: item.id }))}
                  style={getBtnStyle(form.deliveryMethod === item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
            * 신청 완료 시 bada@badahub.co.kr에서 선택하신 통신사/알뜰폰 공식 접수 안내 메일이 즉시 발송됩니다.
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '14px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}
          >
            신청 완료 및 확인 메일 받기
          </button>
        </form>
      </div>
    </div>
  );
}
