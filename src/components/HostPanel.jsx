import { useState } from 'react';
import { getNewStatValue } from '../data/rerollStat'; // Виходимо з components в data

const traitsList = [
  { key: 'bio', label: ' Біографія' },
  { key: 'race', label: '✨ Раса' },
  { key: 'profession', label: '🛠️ Професія' },
  { key: 'rareProfession', label: '⭐ Стаж професії' },
  { key: 'health', label: '🩺 Здоров\'я' },
  { key: 'body', label: '🏋️ Тілобудова' },
  { key: 'baggage', label: '🎒 Багаж' },
  { key: 'knowledge', label: '🧠 Знання' },
  { key: 'BigInventory', label: '📦 Великий інвентар' },
  { key: 'dopInfo', label: 'ℹ️ Дод. інформація' },
];

export function HostPanel({ 
  players, 
  onToggleTrait, 
  onOpenAllPlayer, 
  onCloseAllPlayer,
  onKickPlayer,
  onUpdateTrait,
  onSwapTraits,
  onAddItem,
  onStartTimer
}) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(1);
  const [targetPlayerId, setTargetPlayerId] = useState(2);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState('traits');

  const [editTraitKey, setEditTraitKey] = useState('profession');
  const [editTraitValue, setEditTraitValue] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [diceResult, setDiceResult] = useState(null);
  const [randomPlayer, setRandomPlayer] = useState(null);

  // Функція для кнопки реролу
  const handleRerollStat = (playerId, traitKey) => {
    const newValue = getNewStatValue(traitKey);

    if (!newValue) {
      alert('Для цієї характеристики немає генератора');
      return;
    }

    if (onUpdateTrait) {
      onUpdateTrait(playerId, traitKey, newValue);
    }
  };

  if (!players || players.length === 0) return null;

  const selectedPlayer = players.find((p) => p.id === Number(selectedPlayerId)) || players[0];

  const handleRollDice = (sides) => {
    const res = Math.floor(Math.random() * sides) + 1;
    setDiceResult(`d${sides}: ${res}`);
  };

  const handlePickRandomPlayer = () => {
    const random = players[Math.floor(Math.random() * players.length)];
    setRandomPlayer(random.nickname);
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <button className="btn-host" onClick={() => setIsOpenModal(true)}>
        👑 Панель Ведучого (Керування Таблицею)
      </button>

      {isOpenModal && (
        <div className="host-modal-overlay" onClick={() => setIsOpenModal(false)}>
          <div className="host-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            
            <div className="host-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Панель Ведучого</h3>
              
              <button 
                type="button" 
                onClick={() => setIsOpenModal(false)}
                style={{
                  backgroundColor: '#dc3545',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9em'
                }}
              >
                ✖ Закрити
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', margin: '15px 0', borderBottom: '1px solid #495057', paddingBottom: '10px', flexWrap: 'wrap' }}>
              <button 
                type="button"
                className={`btn-trait ${activeTab === 'traits' ? 'active' : ''}`}
                onClick={() => setActiveTab('traits')}
              >
                👁️ Таблиця
              </button>
              <button 
                type="button"
                className={`btn-trait ${activeTab === 'edit' ? 'active' : ''}`}
                onClick={() => setActiveTab('edit')}
              >
                ✏️ Управління / Свап
              </button>
              <button 
                type="button"
                className={`btn-trait ${activeTab === 'tools' ? 'active' : ''}`}
                onClick={() => setActiveTab('tools')}
              >
                🎲 Кубики / Рандом
              </button>
              <button 
                type="button"
                className={`btn-trait ${activeTab === 'timer' ? 'active' : ''}`}
                onClick={() => setActiveTab('timer')}
              >
                ⏱️ Таймер
              </button>
            </div>

            {/* ВКЛАДКА 1: ТВІЙ ОРИГІНАЛЬНИЙ ФУНКЦІОНАЛ ТАБЛИЦІ */}
            {activeTab === 'traits' && (
              <>
                <label style={{ display: 'block', marginTop: '10px' }}>Оберіть гравця для керування:</label>
                <select 
                  className="host-select" 
                  value={selectedPlayer?.id || selectedPlayerId} 
                  onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nickname} (№{p.id})
                    </option>
                  ))}
                </select>

                {selectedPlayer && (
                  <div style={{ marginTop: '15px' }}>
                    <h4>Характеристики у Зведеній Таблиці ({selectedPlayer.nickname}):</h4>
                    <div className="host-buttons-grid">
                      {traitsList.map((trait) => {
                        const isOpened = selectedPlayer.openedTraits?.includes(trait.key);
                        return (
                          <button
                            key={trait.key}
                            className={`btn-trait ${isOpened ? 'active' : ''}`}
                            onClick={() => onToggleTrait(selectedPlayer.id, trait.key)}
                          >
                            {isOpened ? '✅ В Таблиці' : '🔒 Приховано'} — {trait.label}
                          </button>
                        );
                      })}
                    </div>

                    <h4 style={{ marginTop: '20px', color: '#0d6efd' }}>⚡ Картки Дій у Таблиці Дій:</h4>
                    <div className="host-buttons-grid">
                      <button 
                        className={`btn-trait ${selectedPlayer.openedTraits?.includes('actionCard1') ? 'active' : ''}`}
                        onClick={() => onToggleTrait(selectedPlayer.id, 'actionCard1')}
                      >
                        {selectedPlayer.openedTraits?.includes('actionCard1') ? '✅ В Таблиці' : '🔒 Приховано'} — Дія №1
                      </button>

                      <button 
                        className={`btn-trait ${selectedPlayer.openedTraits?.includes('actionCard2') ? 'active' : ''}`}
                        onClick={() => onToggleTrait(selectedPlayer.id, 'actionCard2')}
                      >
                        {selectedPlayer.openedTraits?.includes('actionCard2') ? '✅ В Таблиці' : '🔒 Приховано'} — Дія №2
                      </button>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-action btn-all" onClick={() => onOpenAllPlayer(selectedPlayer.id)}>
                          🔓 Відкрити все у таблиці
                        </button>
                        <button className="btn-action btn-danger" onClick={() => onCloseAllPlayer(selectedPlayer.id)}>
                          🔒 Сховати все у таблиці
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ВКЛАДКА 2: ЗМІНА / СВАП / РЕРОЛ */}
            {activeTab === 'edit' && (
              <div>
                <label style={{ display: 'block', marginTop: '10px' }}>Оберіть гравця:</label>
                <select 
                  className="host-select" 
                  value={selectedPlayer?.id || selectedPlayerId} 
                  onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>{p.nickname} (№{p.id})</option>
                  ))}
                </select>

                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginTop: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>✏️ Зміна характеристики:</h4>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <select 
                      className="host-select" 
                      style={{ width: 'auto', marginBottom: 0 }}
                      value={editTraitKey} 
                      onChange={(e) => setEditTraitKey(e.target.value)}
                    >
                      {traitsList.map((t) => (
                        <option key={t.key} value={t.key}>{t.label}</option>
                      ))}
                    </select>

                    <input 
                      type="text" 
                      placeholder="Нове значення (ручне)..." 
                      value={editTraitValue} 
                      onChange={(e) => setEditTraitValue(e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #495057', flex: 1, backgroundColor: '#212529', color: '#fff' }}
                    />

                    <button 
                      type="button"
                      className="btn-action btn-all" 
                      onClick={() => {
                        if (onUpdateTrait && editTraitValue.trim()) {
                          onUpdateTrait(selectedPlayer.id, editTraitKey, editTraitValue);
                          setEditTraitValue('');
                        }
                      }}
                    >
                      Зберегти
                    </button>
                  </div>

                  {/* КНОПКА ВИПАДКОВОГО РЕРОЛУ (ДЛЯ КАРТКИ ДІЇ) */}
                  <div style={{ borderTop: '1px dashed #495057', paddingTop: '10px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85em', color: '#ffc107' }}>
                      🃏 Картка Дії: Перевибрати стат з бази
                    </span>
                    <button 
                      type="button"
                      className="btn-action btn-all"
                      style={{ backgroundColor: '#fd7e14', borderColor: '#fd7e14' }}
                      onClick={() => handleRerollStat(selectedPlayer.id, editTraitKey)}
                    >
                      🎲 Випадковий рерол
                    </button>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginTop: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>🎒 Видати предмет в інвентар/багаж:</h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Назва предмета..." 
                      value={newItemText} 
                      onChange={(e) => setNewItemText(e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #495057', flex: 1, backgroundColor: '#212529', color: '#fff' }}
                    />
                    <button 
                     type="button"
                      className="btn-action btn-all"
                      style={{ backgroundColor: '#fd7e14', borderColor: '#fd7e14' }}
                      onClick={() => {
                      const randomItem = getNewStatValue('BigInventory') || getNewStatValue('baggage');
                      if (randomItem) {
                      const itemText = Array.isArray(randomItem) ? randomItem[0] : String(randomItem);
                      setNewItemText(itemText);
                         }
                       }}
                      >
                      🎲 Випадковий
                    </button>
                    <button 
                      type="button"
                      className="btn-action btn-all" 
                      onClick={() => {
                        if (onAddItem && newItemText.trim()) {
                          onAddItem(selectedPlayer.id, newItemText);
                          setNewItemText('');
                        }
                      }}
                    >
                      Видати
                    </button>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginTop: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>🔄 Свап характеристик з іншим гравцем:</h4>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>Поміняти {selectedPlayer.nickname} з:</span>
                    <select 
                      className="host-select" 
                      style={{ width: 'auto', marginBottom: 0 }}
                      value={targetPlayerId} 
                      onChange={(e) => setTargetPlayerId(Number(e.target.value))}
                    >
                      {players.filter(p => p.id !== selectedPlayer.id).map(p => (
                        <option key={p.id} value={p.id}>{p.nickname}</option>
                      ))}
                    </select>

                    <button 
                      type="button"
                      className="btn-action btn-all" 
                      onClick={() => onSwapTraits && onSwapTraits(selectedPlayer.id, targetPlayerId, editTraitKey)}
                    >
                      Обміняти місцями
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid #dc3545', paddingTop: '15px' }}>
                  <button 
                    type="button"
                    className="btn-action btn-danger" 
                    onClick={() => onKickPlayer && onKickPlayer(selectedPlayer.id)}
                  >
                    🚫 Кікнути гравця ({selectedPlayer.nickname}) з кімнати
                  </button>
                </div>
              </div>
            )}

            {/* ВКЛАДКА 3: КУБИКИ ТА РАНДОМАЙЗЕР */}
            {activeTab === 'tools' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <h4>🎲 Кидок кубика:</h4>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
                  <button type="button" className="btn-action btn-all" onClick={() => handleRollDice(6)}>d6 (1-6)</button>
                  <button type="button" className="btn-action btn-all" onClick={() => handleRollDice(20)}>d20 (1-20)</button>
                  <button type="button" className="btn-action btn-all" onClick={() => handleRollDice(100)}>d100 (1-100)</button>
                </div>
                {diceResult && <h3 style={{ color: '#0dcaf0', marginTop: '10px' }}>Результат: {diceResult}</h3>}

                <hr style={{ margin: '20px 0', borderColor: '#495057' }} />

                <h4>🎯 Рандомайзер вибору гравця:</h4>
                <button type="button" className="btn-action btn-all" onClick={handlePickRandomPlayer}>
                  Вибрати випадкового гравця
                </button>
                {randomPlayer && <h3 style={{ color: '#ffc107', marginTop: '15px' }}>Обрано: {randomPlayer}</h3>}
              </div>
            )}

            {/* ВКЛАДКА 4: ТАЙМЕР */}
            {activeTab === 'timer' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <h4>⏱️ Запустити таймер обговорення:</h4>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
                  <button type="button" className="btn-action btn-all" onClick={() => onStartTimer && onStartTimer(30)}>30 сек</button>
                  <button type="button" className="btn-action btn-all" onClick={() => onStartTimer && onStartTimer(60)}>1 хв</button>
                  <button type="button" className="btn-action btn-all" onClick={() => onStartTimer && onStartTimer(120)}>2 хв</button>
                  <button type="button" className="btn-action btn-all" onClick={() => onStartTimer && onStartTimer(180)}>3 хв</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}