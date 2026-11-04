import { useState, useEffect } from 'react';

export function Timer({ timerData }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!timerData || !timerData.endsAt || !timerData.active) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeft(0); 
      return;
    }

    // Розрахунок скільки секунд залишилося до endsAt
    const calculateTimeLeft = () => {
      const diff = Math.floor((timerData.endsAt - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    };

    setTimeLeft(calculateTimeLeft());

    // Оновлюємо кожну секунду
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerData]);

  // Якщо таймер не запущений або час вийшов — нічого не показуємо
  if (!timerData || !timerData.active || timeLeft <= 0) {
    return null;
  }

  // Форматування хвилин та секунд (наприклад, 01:30)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div style={{
      backgroundColor: 'rgba(220, 53, 69, 0.9)',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '10px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '1.4em',
      margin: '15px auto',
      maxWidth: '320px',
      boxShadow: '0 0 15px rgba(220, 53, 69, 0.6)',
      border: '2px solid #ff4d5d',
      letterSpacing: '1px'
    }}>
      ⏱️ Залишилось часу: <span style={{ color: '#ffc107' }}>{formattedTime}</span>
    </div>
  );
}