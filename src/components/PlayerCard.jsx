
export function PlayerCard({ player, onToggleTrait }) {
  if (!player) return null;

  // Хелпер для перевірки, чи характеристика вже у Зведеній Таблиці
  const isOpened = (traitKey) => player.openedTraits?.includes(traitKey);

  const traits = [
  { key: 'bio', label: '👤 Біографія', value: `${player.sex}, ${player.age}р` },
  { key: 'race', label: '✨ Раса', value: player.race?.title || player.race },
  { key: 'profession', label: '🛠️ Професія', value: `${typeof player.profession === 'object' ? player.profession?.name : (player.profession || '')} ${player.rareProfession || player.professionRare || ''}` 
  },
  { key: 'health', label: '🩺 Здоров\'я', value: player.health?.details || player.health },
  { key: 'body', label: '🏋️ Тілобудова', value: typeof player.body === 'object' ? `${player.body?.title}, ${player.height}см` : player.body },
  { key: 'baggage', label: '🎒 Багаж', value: Array.isArray(player.baggage) ? player.baggage.join(', ') : player.baggage },
  { key: 'dopInfo', label: 'ℹ️ Дод. інфо', value: player.DopInfo },
  { key: 'knowledge', label: '🧠 Знання', value: player.knowledge },
  { key: 'BigInventory', label: '📦 Великий інвентар', value: player.BigInventory },
  { key: 'actionCard1', label: 'Картка дій 1', value: `${player.actionCard1}` },
  { key: 'actionCard2', label: 'Картка дій 2', value: `${player.actionCard2}` }
];

  return (
    <div style={{ background: '#212529', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
      <h3>Ваша картка: <span style={{ color: '#0dcaf0' }}>{player.nickname}</span></h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
        {traits.map((trait) => {
          const opened = isOpened(trait.key);

          return (
            <div 
              key={trait.key} 
              style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: opened ? '1px solid #198754' : '1px solid #495057'
              }}
            >
              <div>
                <strong>{trait.label}:</strong> {trait.value || 'Невідомо'}
              </div>

              {/* 🎯 Кнопка для самого гравця */}
              <button
                type="button"
                onClick={() => onToggleTrait && onToggleTrait(player.id, trait.key)}
                style={{
                  backgroundColor: opened ? '#198754' : '#0d6efd',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '0.85em',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                {opened ? '✅ В таблиці' : '👁️ Відкрити усім'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}