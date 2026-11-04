import { useState, useEffect } from 'react';
import { ref, set, update, onValue } from 'firebase/database';
import { db } from './firebase';
import './App.css';
import { generateActionCards } from './data/actionCards';
import { ActionCardsTable } from './components/ActionCardsTable';
import { Timer } from './components/Timer';
import { HostSurvivalCheck } from './components/HostSurvivalCheck';
import { SurvivalModal } from './components/SurvivalModal';
import { getRandomKnowledge } from './data/knowledges';
import { getRandombigItem } from './data/BigInventory';
// Генератори даних
import { generateRaceSexAge } from './data/race';
import { generateProfession, rareProfession } from './data/profession';
import { generateHealthStatus } from './data/health';
import { generateBodyStatus } from './data/body';
import { generateBaggage } from './data/baggage';
import { generateDopInfo } from './data/DopInfo';
import { generateDisasterAndBunker } from './data/disaster';

// Компоненти
import { Auth } from './components/Auth';
import { LobbyMenu } from './components/LobbyMenu';
import { PlayerCard } from './components/PlayerCard';
import { SummaryTable } from './components/SummaryTable';
import { HostPanel } from './components/HostPanel';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('auth');
  
  const [lobbyCode, setLobbyCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState(null);

  // Стан кімнати з Firebase
  const [roomData, setRoomData] = useState(null);

  // Слухач Realtime Database: синхронізує стан кімнати в реальному часі між усіма пристроями
  useEffect(() => {
    if (!lobbyCode) return;

    const roomRef = ref(db, `lobbies/${lobbyCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoomData(data);
      } else {
        // Якщо кімнату було видалено або код невірний
        setRoomData(null);
      }
    });

    return () => unsubscribe();
  }, [lobbyCode]);

  // 1. Авторизація
  const handleLogin = (nickname) => {
    setUser({ nickname });
    setCurrentScreen('menu');
  };

 // 2. Створення лобі (Ведучий)
  const handleCreateLobby = async () => {
    try {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const initialRoomData = {
        code: newCode,
        status: 'waiting',
        connectedPlayers: [
          { id: 1, nickname: user.nickname, isHost: true }
        ],
        disaster: null,
        players: []
      };

      // Записуємо лобі в Firebase
      await set(ref(db, `lobbies/${newCode}`), initialRoomData);

      setLobbyCode(newCode);
      setIsHost(true);
      setMyPlayerId(1);
      setCurrentScreen('game');
    } catch (error) {
      console.error("Помилка створення лобі:", error);
      alert("Не вдалося створити лобі: " + error.message);
    }
  };

  // 3. Приєднання до лобі (Гравець)
  const handleJoinLobby = async (code) => {
    setLobbyCode(code);
    setIsHost(false);

    const roomRef = ref(db, `lobbies/${code}`);
    
    // Отримуємо поточний список гравців і додаємо себе
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.status === 'waiting') {
        const existingPlayers = data.connectedPlayers || [];
        const alreadyIn = existingPlayers.find(p => p.nickname === user.nickname);

        if (!alreadyIn) {
          const newId = existingPlayers.length + 1;
          setMyPlayerId(newId);

          const updatedList = [
            ...existingPlayers,
            { id: newId, nickname: user.nickname, isHost: false }
          ];

          update(ref(db, `lobbies/${code}`), {
            connectedPlayers: updatedList
          });
        } else {
          setMyPlayerId(alreadyIn.id);
        }
      }
    }, { onlyOnce: true });

    setCurrentScreen('game');
  };

  // 4. Запуск гри (Тільки для Ведучого)
// 4. Запуск гри (З обробкою помилок та захистом від undefined)
  const handleStartGame = async () => {
    try {
      if (!roomData || !roomData.connectedPlayers) {
        alert("Дані кімнати ще завантажуються...");
        return;
      }

      // Дозволяємо старт навіть з 1 гравцем для тестування (потім можна повернути на < 2)
      if (roomData.connectedPlayers.length < 1) {
        alert("У лобі немає гравців!");
        return;
      }

      const disasterData = generateDisasterAndBunker(roomData.connectedPlayers.length);

      const actionCards = generateActionCards() || {};

      // Генеруємо картки і гарантуємо, що жодне поле не буде undefined
      const generatedCards = roomData.connectedPlayers.map((player) => {
        const raceDetails = generateRaceSexAge() || {};
        return {
          id: player.id || 1,
          nickname: player.nickname || 'Гравець',
          profession: generateProfession() || 'Без професії',
          professionRare: rareProfession() || 'Звичайна',
          health: generateHealthStatus() || 'Здоровий',
          race: raceDetails.race || 'Людина',
          sex: raceDetails.Sex || 'Чоловік',
          age: raceDetails.Age || 25,
          height: raceDetails.Height || 170,
          body: generateBodyStatus() || 'Звичайна',
          baggage: generateBaggage() || ['Предмет'],
          DopInfo: generateDopInfo() || 'Немає',
          knowledge: getRandomKnowledge(),
          BigInventory: getRandombigItem(),
          actionCard1: actionCards.actionCard1,
          actionCard2: actionCards.actionCard2,
          openedTraits: ['empty'], // Використовуємо початкове значення масиву
        };
      });

      // Оновлюємо стан у Firebase
      await update(ref(db, `lobbies/${lobbyCode}`), {
        status: 'playing',
        disaster: disasterData,
        players: generatedCards
      });

    } catch (error) {
      console.error("Помилка старту гри:", error);
      alert("Не вдалося розпочати гру: " + error.message);
    }
  };

  // Перемикання характеристик (Оновлює стан у Firebase)
  const handleToggleTrait = (playerId, traitKey) => {
    if (!roomData || !roomData.players) return;

    const updatedPlayers = roomData.players.map((p) => {
      if (p.id !== playerId) return p;
      const exists = p.openedTraits ? p.openedTraits.includes(traitKey) : false;
      const currentTraits = p.openedTraits || [];
      const updated = exists
        ? currentTraits.filter((t) => t !== traitKey)
        : [...currentTraits, traitKey];
      return { ...p, openedTraits: updated };
    });

    update(ref(db, `lobbies/${lobbyCode}`), {
      players: updatedPlayers
    });
  };

  const handleOpenAllPlayer = (playerId) => {
    if (!roomData || !roomData.players) return;
    const all = ['bio', 'race', 'profession', 'health', 'body', 'baggage', 'dopInfo', 'knowledge','BigInventory'];
    
    const updatedPlayers = roomData.players.map((p) => 
      p.id === playerId ? { ...p, openedTraits: all } : p
    );

    update(ref(db, `lobbies/${lobbyCode}`), {
      players: updatedPlayers
    });
  };

  const handleCloseAllPlayer = (playerId) => {
    if (!roomData || !roomData.players) return;

    const updatedPlayers = roomData.players.map((p) => 
      p.id === playerId ? { ...p, openedTraits: ['empty'] } : p
    );

    update(ref(db, `lobbies/${lobbyCode}`), {
      players: updatedPlayers
    });
  };
// 1. Кік гравця з кімнати
const handleKickPlayer = (playerId) => {
  if (!roomData || !roomData.players) return;
  const updatedPlayers = roomData.players.filter((p) => p.id !== playerId);
  update(ref(db, `lobbies/${lobbyCode}`), { players: updatedPlayers });
};

// 2. Зміна конкретної характеристики гравця
const handleUpdateTrait = (playerId, traitKey, newValue) => {
  if (!roomData || !roomData.players) return;
  const updatedPlayers = roomData.players.map((p) => {
    if (p.id !== playerId) return p;

    // Спеціальна обробка для вкладених об'єктів (наприклад, race.title або health.details)
    if (traitKey === 'race') return { ...p, race: { ...p.race, title: newValue } };
    if (traitKey === 'health') return { ...p, health: { ...p.health, details: newValue } };
    if (traitKey === 'profession') return { ...p, profession: { ...p.profession, name: newValue } };
    if (traitKey === 'body') return { ...p, body: { ...p.body, title: newValue } };
    if (traitKey === 'dopInfo') return { ...p, DopInfo: newValue };

    return { ...p, [traitKey]: newValue };
  });

  update(ref(db, `lobbies/${lobbyCode}`), { players: updatedPlayers });
};

// 3. Свап характеристик між двома гравцями
const handleSwapTraits = (player1Id, player2Id, traitKey) => {
  if (!roomData || !roomData.players) return;
  const p1 = roomData.players.find((p) => p.id === player1Id);
  const p2 = roomData.players.find((p) => p.id === player2Id);
  if (!p1 || !p2) return;

  const val1 = p1[traitKey];
  const val2 = p2[traitKey];

  const updatedPlayers = roomData.players.map((p) => {
    if (p.id === player1Id) return { ...p, [traitKey]: val2 };
    if (p.id === player2Id) return { ...p, [traitKey]: val1 };
    return p;
  });

  update(ref(db, `lobbies/${lobbyCode}`), { players: updatedPlayers });
};

// 4. Додавання предмета в багаж/інвентар
const handleAddItemToInventory = (playerId, newItem) => {
  if (!roomData || !roomData.players || !newItem.trim()) return;
  const updatedPlayers = roomData.players.map((p) => {
    if (p.id !== playerId) return p;
    const currentBaggage = Array.isArray(p.baggage) ? p.baggage : [p.baggage];
    return { ...p, baggage: [...currentBaggage, newItem.trim()] };
  });

  update(ref(db, `lobbies/${lobbyCode}`), { players: updatedPlayers });
};

// 5. Запуск глобального таймера (секунди)
const handleStartTimer = (seconds) => {
  const endsAt = Date.now() + seconds * 1000;
  update(ref(db, `lobbies/${lobbyCode}`), {
    timer: { endsAt, duration: seconds, active: true }
  });
};
  const handlePublishSurvival = (resultData) => {
  update(ref(db, `lobbies/${lobbyCode}`), {
    survivalResult: resultData
  });
};

const handleCloseSurvivalModal = () => {
  update(ref(db, `lobbies/${lobbyCode}`), {
    survivalResult: null
  });
};
  
const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const connectedPlayers = roomData?.connectedPlayers || [];
  const players = roomData?.players || [];
  const disaster = roomData?.disaster || null;
  const gameState = roomData?.status || 'waiting';
  const myPlayerCard = players.find((p) => p.id === myPlayerId);

  useEffect(() => {
    const bgImage = disaster?.disasterImage || disaster?.image;

    if (bgImage && gameState === 'playing') {
      document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${bgImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundImage = '';
      document.body.style.color = '';
    }

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.color = '';
    };
}, [disaster, gameState]);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Груповінастолки 🎲</h1>

      {/* ЕКРАН 1: ВХІД */}
      {currentScreen === 'auth' && (
        <Auth onLogin={handleLogin} />
      )}

      {/* ЕКРАН 2: МЕНЮ */}
      {currentScreen === 'menu' && (
        <LobbyMenu 
          user={user} 
          onCreateLobby={handleCreateLobby} 
          onJoinLobby={handleJoinLobby} 
        />
      )}

      {/* ЕКРАН 3: ІГРОВА КІМНАТА */}
      {currentScreen === 'game' && (
        <div>
          <div style={{ background: 'rgba(33, 37, 41, 0.85)', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #dc3545' }}>
            <span>Гравець: <strong>{user.nickname}</strong> {isHost ? '👑 (Ведучий)' : `🎮 (Гравець №${myPlayerId})`}</span>
            <span>Код лобі: <strong style={{ color: '#0d6efd', fontSize: '1.4em', letterSpacing: '2px' }}>{lobbyCode}</strong></span>
            <button className="btn-action btn-danger" onClick={() => setCurrentScreen('menu')} style={{ margin: 0 }}>
              Вийти
            </button>
          </div>

          {/* КІМНАТА ОЧІКУВАННЯ */}
          {gameState === 'waiting' && (
            <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', background: '#1a1919', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <h2>⏳ Кімната очікування</h2>
              <p>Поділіться кодом <strong style={{ color: '#0d6efd' }}>{lobbyCode}</strong> з іншими гравцями</p>

              <div style={{ margin: '20px 0', textAlign: 'left' }}>
                <h4>Підключені гравці ({connectedPlayers.length}):</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {connectedPlayers.map((p) => (
                    <li key={p.id} style={{ padding: '8px 12px', background: '#26282b', borderRadius: '6px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Гравець №{p.id}: <strong>{p.nickname}</strong></span>
                      {p.isHost && <span style={{ color: '#ffc107', fontWeight: 'bold' }}>👑 Ведучий</span>}
                    </li>
                  ))}
                </ul>
              </div>

              {isHost ? (
                <button className="btn-primary" style={{ width: '100%', fontSize: '1.1em' }} onClick={handleStartGame}>
                  🚀 Розпочати гру
                </button>
              ) : (
                <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
                  Очікуємо, поки ведучий розпочне гру...
                </p>
              )}
            </div>
          )}

          {/* АКТИВНА ГРА */}
          {gameState === 'playing' && (
            <div>
              {/* Панель Ведучого */}
              {isHost && (
                <HostPanel 
                  players={players} 
                  onToggleTrait={handleToggleTrait}
                  onOpenAllPlayer={handleOpenAllPlayer}
                  onCloseAllPlayer={handleCloseAllPlayer}

                  onKickPlayer={handleKickPlayer}
                  onUpdateTrait={handleUpdateTrait}
                  onSwapTraits={handleSwapTraits}
                  onAddItem={handleAddItemToInventory}
                  onStartTimer={handleStartTimer}
                  
                />
              )}
              

              {/* Бункер і Катастрофа */}
              {disaster && (
                <div style={{ 
                  border: '2px solid #dc3545', 
                  padding: '20px', 
                  margin: '20px 0', 
                  borderRadius: '12px', 
                  backgroundColor: 'rgba(33, 37, 41, 0.85)', // Напівпрозорий темний блок
                  backdropFilter: 'blur(5px)', // Плавне розмиття фону під карткою
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  }}>
                  <h3>🚨 Катастрофа: {disaster.disasterTitle}</h3>
                  <p><em>{disaster.disasterImpact}</em></p>
                  <hr />
                  <h3>🏠 Бункер: {disaster.bunkerSizeTitle}</h3>
                  <p><strong>Розмір:</strong> {disaster.bunkerSizeCapacity}</p>
                  <p><strong>🛑 Місць у Бункері: {disaster.totalSpaces}</strong></p>
                  <p><strong>Час перебування:</strong> {disaster.staytime}</p>
                  <hr />
                  <h3>🎒 Інвентар Бункера:</h3>
                  <ul dangerouslySetInnerHTML={{ __html: disaster.inventory }} />
                </div>
              )}

              {/* Особиста картка (Кожен бачить ТІЛЬКИ СВОЮ) */}
              {myPlayerCard && (
                <div style={{ margin: '20px 0' }}>
                  <h2>Персональна картка:</h2>
                  <div style={{ maxWidth: '800px' }}>
                    <PlayerCard player={myPlayerCard}
                    onToggleTrait={handleToggleTrait}/>
                  </div>
                </div>
              )}
{/* Кнопка для Ведучого */}
{isHost && (
  <div style={{ textAlign: 'center', margin: '20px 0' }}>
    <button 
      className="btn-action btn-success" 
      onClick={() => setIsCheckModalOpen(true)}
      style={{ padding: '12px 24px', fontSize: '1.1em', fontWeight: 'bold' }}
    >
      📋 Провести перевірку виживання
    </button>
  </div>
)}

{/* Анкета для Ведучого */}
<HostSurvivalCheck 
  isOpen={isCheckModalOpen}
  onClose={() => setIsCheckModalOpen(false)}
  onSubmit={handlePublishSurvival}
/>

{/* Фінальне вікно (відкриється в усіх) */}
<SurvivalModal 
  result={roomData?.survivalResult} 
  onClose={handleCloseSurvivalModal} 
/>
              {/* Зведена Таблиця для всіх */}
<SummaryTable players={players} />
{/* Глобальний таймер обговорення (видимий для всіх) */}
<Timer timerData={roomData?.timer} />

{/* Друга таблиця з картками дій */}
<ActionCardsTable players={players} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}