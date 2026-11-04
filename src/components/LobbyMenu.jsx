import { useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';

export function LobbyMenu({ user, onCreateLobby, onJoinLobby }) {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();

    if (!code) {
      alert('Введіть код лобі!');
      return;
    }

    setLoading(true);

    try {
      // Захист від безкінечного очікування (таймаут 5 секунд)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Таймаут з’єднання з Firebase')), 5000)
      );

      const roomRef = ref(db, `lobbies/${code}`);
      const snapshot = await Promise.race([get(roomRef), timeoutPromise]);

      if (snapshot.exists()) {
        onJoinLobby(code);
      } else {
        alert(`❌ Кімнату з кодом ${code} не знайдено!`);
      }
    } catch (error) {
      console.error("Помилка при вході:", error);
      alert('Не вдалося з’єднатися з сервером: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
      <h2>Привіт, <span style={{ color: '#0d6efd' }}>{user.nickname}</span>! 👋</h2>
      <p>Оберіть дію:</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        
        <div style={{ padding: '20px', background: '#231a3d', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>👑 Створити нове лобі</h3>
          <p style={{ fontSize: '0.9em', color: '#6c757d' }}>Ви будете Ведучим гри</p>
          <button className="btn-primary" onClick={onCreateLobby}>
            Створити Кімнату
          </button>
        </div>

        <div style={{ padding: '20px', background: '#231a3d', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>🎮 Приєднатися до лобі</h3>
          <form onSubmit={handleJoin} style={{ marginTop: '10px' }}>
            <input
              type="text"
              placeholder="Введіть 6-значний код"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              maxLength={6}
              disabled={loading}
              style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', marginBottom: '10px', textAlign: 'center', textTransform: 'uppercase' }}
            />
            <button type="submit" className="btn-secondary" disabled={loading} style={{ marginBottom: 0 }}>
              {loading ? 'Перевірка...' : 'Увійти за кодом'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}