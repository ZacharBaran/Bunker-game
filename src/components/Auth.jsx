import { useState } from 'react';
import { RulesModal } from './RulesModal';

export function Auth({ onLogin }) {
  const [nickname, setNickname] = useState('');
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert('Будь ласка, введіть ваш нікнейм!');
      return;
    }
    // Передаємо нікнейм у головний додаток
    onLogin(nickname.trim());
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Вітаємо в "Груповінастолки"! 🎲</h2>
      <p>Введіть ваш нікнейм, щоб розпочати:</p>
      
      <form onSubmit={handleSubmit} className="controls-group">
        <input
          type="text"
          placeholder="Ваш нікнейм (напр. Alex_99)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={15}
          style={{ width: '100%', padding: '12px', fontSize: '16px', marginBottom: '10px' }}
        />
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Увійти в гру
        </button>
      </form>

      {/* Кнопка виклику правил */}
      <button 
        type="button"
        onClick={() => setIsRulesOpen(true)}
        style={{
          marginTop: '15px',
          padding: '12px 20px',
          backgroundColor: '#ffc107',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        📖 Правила гри «Бункер»
      </button>

      {/* Модальне вікно з правилами */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}