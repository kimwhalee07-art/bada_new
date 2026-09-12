'use client';
import React, { useState } from 'react';

export default function InternetModal({ isOpen, onClose, onSuccess }) {
  const [internetForm, setInternetForm] = useState({
    name: '',
    phone: '',
    carrier: 'KT',
    address: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!internetForm.name || !internetForm.phone) {
      alert('성함과 연락처를 입력해주세요.');
      return;
    }

    const newOrder = {
      id: 'INT-' + Date.now(),
      customerName: internetForm.name,
      phone: internetForm.phone,
      email: '상담 후 확인',
      telecomCategory: '인터넷·TV',
      carrier: internetForm.carrier,
      subType: '신규설치',
      planName: `${internetForm.carrier} 인터넷+TV (최대 47만 사은품)`,
      deliveryMethod: '기사 방문 설치',
      address: internetForm.address,
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

    alert(`🎉 [${internetForm.carrier}] 인터넷 상담 신청이 완료되었습니다!\n전문 상담원이 확인 후 빠른 견적 안내를 드립니다.`);
    if (onSuccess) onSuccess(newOrder);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '100%', maxWidth: '460px', padding: '28px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '20px', color: '#94a3b8', cursor: 'pointer' }}>×</button>
        <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0' }}>인터넷 & 생활 렌탈 상담 견적</h3>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
          통신 3사 및 알뜰 결합 인터넷 최대 현금 사은품 견적을 제공합니다.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="성함 (Name) *"
            value={internetForm.name}
            onChange={(e) => setInternetForm({ ...internetForm, name: e.target.value })}
            style={{ padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            required
          />
          <input
            type="tel"
            placeholder="연락처 (Phone) *"
            value={internetForm.phone}
            onChange={(e) => setInternetForm({ ...internetForm, phone: e.target.value })}
            style={{ padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            required
          />
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>통신사 / 알뜰인터넷 선택</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {['KT', 'SK', 'LG', '알뜰인터넷'].map(carrier => (
                <button
                  key={carrier}
                  type="button"
                  onClick={() => setInternetForm({ ...internetForm, carrier })}
                  style={{
                    padding: '9px 4px',
                    borderRadius: '6px',
                    border: internetForm.carrier === carrier ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    backgroundColor: internetForm.carrier === carrier ? '#f0f9ff' : '#fff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {carrier}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder="설치 희망 주소 (Address) *"
            value={internetForm.address}
            onChange={(e) => setInternetForm({ ...internetForm, address: e.target.value })}
            style={{ padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            required
          />
          <button
            type="submit"
            style={{ padding: '13px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}
          >
            상담 및 최대 사은품 견적 받기
          </button>
        </form>
      </div>
    </div>
  );
}
