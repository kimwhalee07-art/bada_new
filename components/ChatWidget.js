'use client';
import React, { useState, useEffect } from 'react';

export default function ChatWidget({ lang, t, currentUser }) {
  const [showChat, setShowChat] = useState(false);
  const [botMode, setBotMode] = useState('faq');
  const [currentTopic, setCurrentTopic] = useState(null);
  const [liveMessages, setLiveMessages] = useState([
    { sender: 'staff', text: '안녕하세요! BADA 전담 직원입니다. 알뜰폰 요금제, 인터넷 사은품 등 무엇이든 편하게 물어보세요!', time: '방금' }
  ]);
  const [customerInput, setCustomerInput] = useState('');
  const [clientSessionId, setClientSessionId] = useState('');

  useEffect(() => {
    let sid = localStorage.getItem('bada_user_sid');
    if (!sid) {
      sid = 'customer_' + Math.random().toString(36).substring(2, 8);
      localStorage.setItem('bada_user_sid', sid);
    }
    setClientSessionId(sid);

    const handleStorageChange = () => {
      const allChatsStr = localStorage.getItem('bada_live_chat_rooms');
      if (allChatsStr) {
        try {
          const allChats = JSON.parse(allChatsStr);
          if (allChats[sid] && allChats[sid].messages) {
            setLiveMessages(allChats[sid].messages);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSendCustomerMessage = (e) => {
    e.preventDefault();
    if (!customerInput.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: 'customer', text: customerInput.trim(), time: timeStr };
    const updatedMessages = [...liveMessages, newMsg];
    setLiveMessages(updatedMessages);

    try {
      const allChatsStr = localStorage.getItem('bada_live_chat_rooms') || '{}';
      const allChats = JSON.parse(allChatsStr);
      
      const displayName = currentUser ? `${currentUser.username} (${currentUser.name})` : `외국인 고객 (${clientSessionId.slice(-4)})`;
      const displayCode = currentUser ? (currentUser.id || currentUser.userCode) : '비회원';

      allChats[clientSessionId] = {
        sessionId: clientSessionId,
        userName: displayName,
        userCode: displayCode,
        lang: lang,
        lastMessage: customerInput.trim(),
        lastTime: timeStr,
        unreadCount: (allChats[clientSessionId]?.unreadCount || 0) + 1,
        messages: updatedMessages
      };
      localStorage.setItem('bada_live_chat_rooms', JSON.stringify(allChats));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }

    setCustomerInput('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}>
      {!showChat ? (
        <button 
          onClick={() => setShowChat(true)} 
          style={{ width: '58px', height: '58px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', fontSize: '26px', boxShadow: '0 6px 20px rgba(2,132,199,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          💬
        </button>
      ) : (
        <div style={{ width: '360px', height: '520px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 12px 35px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{t.bot.title}</div>
              <div style={{ fontSize: '11px', color: '#bae6fd' }}>
                {botMode === 'staff_chat' ? (currentUser ? `👤 ${currentUser.username}님 1:1 전담 대화` : '👨‍💼 직원 1:1 실시간 대화 중') : t.bot.subtitle}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {botMode !== 'faq' && (
                <button onClick={() => setBotMode('faq')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                  메뉴
                </button>
              )}
              <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
          </div>

          {botMode === 'faq' && (
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', backgroundColor: '#f8fafc' }}>
              <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {t.bot.welcome}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <button onClick={() => { setCurrentTopic('sim'); setBotMode('topic_detail'); }} style={{ padding: '11px 14px', textAlign: 'left', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', cursor: 'pointer' }}>{t.bot.menuSim}</button>
                <button onClick={() => { setCurrentTopic('internet'); setBotMode('topic_detail'); }} style={{ padding: '11px 14px', textAlign: 'left', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', cursor: 'pointer' }}>{t.bot.menuInternet}</button>
                <button onClick={() => { setCurrentTopic('rental'); setBotMode('topic_detail'); }} style={{ padding: '11px 14px', textAlign: 'left', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', cursor: 'pointer' }}>{t.bot.menuRental}</button>
                <button onClick={() => { setCurrentTopic('hanpass'); setBotMode('topic_detail'); }} style={{ padding: '11px 14px', textAlign: 'left', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', cursor: 'pointer' }}>{t.bot.menuHanpass}</button>
                <button onClick={() => { setCurrentTopic('stores'); setBotMode('topic_detail'); }} style={{ padding: '11px 14px', textAlign: 'left', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', color: '#0f172a', cursor: 'pointer' }}>{t.bot.menuStore}</button>
                <button onClick={() => setBotMode('staff_chat')} style={{ padding: '12px 14px', textAlign: 'left', backgroundColor: '#0284c7', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', color: '#ffffff', cursor: 'pointer' }}>{t.bot.startStaffChat}</button>
              </div>
            </div>
          )}

          {botMode === 'topic_detail' && (
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', backgroundColor: '#f8fafc' }}>
              <div style={{ padding: '14px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', lineHeight: '1.6' }}>
                {currentTopic === 'sim' && <div><strong>📶 알뜰폰 & 통신사 유심/eSIM 개통</strong><br/><br/>• 알뜰폰(KT망, LG망, SK망) 30~50% 초저가 무약정 요금제.<br/>• 통신 3사 정규 5G 및 PASS 본인인증 100% 보장.<br/>• 여권 또는 외국인등록증 당일 5분 개통.</div>}
                {currentTopic === 'internet' && <div><strong>🌐 초고속 인터넷+TV 사은품</strong><br/><br/>• 통신 3사 및 알뜰 결합 인터넷 최대 현금 사은품 당일 입금.</div>}
                {currentTopic === 'rental' && <div><strong>💧 정수기/가전 렌탈</strong><br/><br/>• 외국인등록증 간편 심사, 등록비/설치비 전액 면제 혜택.</div>}
                {currentTopic === 'hanpass' && <div><strong>💸 한패스 해외송금</strong><br/><br/>• 전용 코드: [BADA2026], 첫 송금 수수료 0원 쿠폰 증정.</div>}
                {currentTopic === 'stores' && <div><strong>🏬 픽업 매장</strong><br/><br/>📍 천안 본점(천안역 3분), 안산점, 수원점.</div>}
              </div>
              <button onClick={() => setBotMode('faq')} style={{ padding: '9px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{t.bot.backToMenu}</button>
            </div>
          )}

          {botMode === 'staff_chat' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', backgroundColor: '#f8fafc' }}>
                {liveMessages.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.sender === 'customer' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '2px', textAlign: msg.sender === 'customer' ? 'right' : 'left' }}>
                      {msg.sender === 'customer' ? (currentUser ? `나 (${currentUser.username})` : '나 (고객)') : '💼 BADA 담당 직원'} · {msg.time}
                    </div>
                    <div style={{ padding: '9px 12px', borderRadius: '12px', backgroundColor: msg.sender === 'customer' ? '#0284c7' : '#ffffff', color: msg.sender === 'customer' ? '#ffffff' : '#1e293b', border: msg.sender === 'customer' ? 'none' : '1px solid #e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendCustomerMessage} style={{ padding: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '6px', backgroundColor: '#ffffff' }}>
                <input 
                  type="text" 
                  placeholder={t.bot.chatInputPlaceholder} 
                  value={customerInput} 
                  onChange={(e) => setCustomerInput(e.target.value)} 
                  style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} 
                />
                <button type="submit" style={{ padding: '9px 14px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {t.bot.send}
                </button>
              </form>
            </div>
          )}

          <div style={{ padding: '7px 14px', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
            온라인 전담 직원이 실시간으로 확인 후 직접 답변을 드립니다.
          </div>
        </div>
      )}
    </div>
  );
}
