export const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e2125',
        color: '#f8f9fa',
        borderRadius: '12px',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '25px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        border: '1px solid #343a40'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#ffc107' }}>📖 Правила гри «Бункер»</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#aaa',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ lineHeight: '1.6', fontSize: '15px' }}>
          <h3 style={{ color: '#0d6efd', marginTop: '15px', marginBottom: '5px' }}>🎯 Мета гри</h3>
          <p style={{ margin: '0 0 10px 0' }}>
            На Землі стався апокаліпсис. Ваша мета — переконати інших гравців у своїй корисності для відбудови цивілізації та потрапити до Бункера, де кількість місць обмежена (зазвичай на половину гравців).
          </p>

          <h3 style={{ color: '#0d6efd', marginTop: '15px', marginBottom: '5px' }}>🔄 Перебіг раунду</h3>
          <ol style={{ paddingLeft: '20px', margin: '0 0 10px 0' }}>
            <li><b>Відкриття характеристик:</b> Щораунду гравці по черзі відкривають одну зі своїх прихованих характеристик (професію, здоров'я, багаж тощо).</li>
            <li><b>Аргументація:</b> Кожен гравець проводить коротку промову, чому його персонаж необхідний у бункері.</li>
            <li><b>Використання карток дій:</b> У свій хід або під час дебатів гравці можуть розігрувати особливі картки дій (рероли, свапи характеристик, додавання предметів).</li>
            <li><b>Голосування:</b> Наприкінці раунду проходить загальне голосування. Гравець, який набрав найбільше голосів, вибуває з гри.</li>
          </ol>

          <h3 style={{ color: '#0d6efd', marginTop: '15px', marginBottom: '5px' }}>📦 Характеристики персонажа</h3>
          <ul style={{ paddingLeft: '20px', margin: '0 0 10px 0' }}>
            <li><b>🛠️ Професія та Стаж:</b> Чим займався персонаж до катастрофи.</li>
            <li><b>🩺 Здоров'я та 🏋️ Тілобудова:</b> Фізичний стан та наявні хвороби.</li>
            <li><b>🎒 Багаж та 📦 Великий Інвентар:</b> Особисті речі та цінні ресурси для бункера.</li>
            <li><b>🧠 Знання:</b> Спеціальні навички для виживання.</li>
            <li><b>⚡ Картки дій:</b> Унікальні можливості вплинути на перебіг гри.</li>
          </ul>

          <h3 style={{ color: '#0d6efd', marginTop: '15px', marginBottom: '5px' }}>🏆 Фінал гри</h3>
          <p style={{ margin: '0 0 10px 0' }}>
            Гра завершується, коли кількість гравців дорівнює кількості місць у бункері. Гравці, що залишилися, проходять перевірку виживаності разом із Ведучим.
          </p>
        </div>

        <button 
          onClick={onClose}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '10px',
            backgroundColor: '#0d6efd',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Зрозуміло, до гри!
        </button>
      </div>
    </div>
  );
};