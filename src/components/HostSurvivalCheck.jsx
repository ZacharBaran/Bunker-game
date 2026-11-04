import { useState } from 'react';

const defaultQuestions = [
  { id: 'gender', label: '👥 Чи є в бункері чоловіки та жінки (для продовження роду)?' },
  { id: 'doctor', label: '🩺 Чи є кваліфікований медик / ліки для лікування?' },
  { id: 'engineer', label: '🛠️ Чи є інженер / технік для ремонту систем життєзабезпечення?' },
  { id: 'food', label: '🌱 Чи є запаси їжі / агроном для вирощування продовольства?' },
  { id: 'health', label: '☣️ Чи відсутні смертельні заразні хвороби серед мешканців?' },
  { id: 'security', label: '🛡️ Чи є зброя або засоби захисту від загроз зовні?' },
];

export function HostSurvivalCheck({ isOpen, onClose, onSubmit }) {
  // За замовчуванням усі чекбокси зняті
  const [checks, setChecks] = useState({
    gender: false,
    doctor: false,
    engineer: false,
    food: false,
    health: false,
    security: false,
  });

  const [customComment, setCustomComment] = useState('');

  if (!isOpen) return null;

  // Перемикання чекбокса
  const handleToggle = (id) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Розрахунок результату
  const yesCount = Object.values(checks).filter(Boolean).length;
  const total = defaultQuestions.length;

  const handlePublish = () => {
    let status = 'danger';
    let title = '💀 БУНКЕР ПАВ';

    if (yesCount === total) {
      status = 'success';
      title = '🎉 УСІ ВИЖИЛИ! БУНКЕР ПРОЦВІТАЄ!';
    } else if (yesCount >= 3) {
      status = 'warning';
      title = '⚠️ ЧАСТКОВЕ ВИЖИВАННЯ';
    }

    // Формуємо підсумок для публікації в Firebase
    const resultData = {
      title,
      status,
      yesCount,
      total,
      details: defaultQuestions.map((q) => ({
        label: q.label,
        passed: !!checks[q.id],
      })),
      comment: customComment.trim(),
    };

    onSubmit(resultData);
    onClose();
  };

  return (
    <div className="host-modal-overlay" onClick={onClose}>
      <div className="host-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', color: '#fff' }}>
        
        <div className="host-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>📋 Перевірка виживання (для Ведучого)</h3>
          <button 
            type="button" 
            onClick={onClose}
            style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}
          >
            ✖
          </button>
        </div>

        <p style={{ marginTop: '10px', color: '#aaa', fontSize: '0.9em' }}>
          Відмітьте пункти, яким відповідає поточний склад бункера:
        </p>

        {/* ЧЕКБОКСИ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '15px 0' }}>
          {defaultQuestions.map((q) => (
            <label 
              key={q.id} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                backgroundColor: checks[q.id] ? 'rgba(25, 135, 84, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: checks[q.id] ? '1px solid #198754' : '1px solid #495057',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              <input 
                type="checkbox" 
                checked={!!checks[q.id]} 
                onChange={() => handleToggle(q.id)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.95em', fontWeight: checks[q.id] ? 'bold' : 'normal' }}>
                {q.label}
              </span>
            </label>
          ))}
        </div>

        {/* ТЕКСТОВИЙ КОМЕНТАР ВЕДУЧОГО */}
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
            💬 Ваш вердикт / Коментар ведучого (необов'язково):
          </label>
          <textarea
            rows="3"
            placeholder="Наприклад: 'Завдяки інженеру бункер протримався 10 років, але через брак ліків частина виживальників загинула...'"
            value={customComment}
            onChange={(e) => setCustomComment(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#212529',
              color: '#fff',
              border: '1px solid #495057',
              borderRadius: '6px',
              padding: '10px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* ПІДСУМОК ТА КНОПКА */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '1.1em' }}>
            Виконано умов: <strong style={{ color: '#0dcaf0' }}>{yesCount} / {total}</strong>
          </div>

          <button 
            type="button" 
            onClick={handlePublish}
            style={{
              backgroundColor: '#198754',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontWeight: 'bold',
              fontSize: '1em',
              cursor: 'pointer'
            }}
          >
            📢 Опублікувати результат усім
          </button>
        </div>

      </div>
    </div>
  );
}