export function SurvivalModal({ result, onClose }) {
  if (!result) return null;

  const getHeaderColor = () => {
    if (result.status === 'success') return '#198754';
    if (result.status === 'warning') return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="host-modal-overlay" onClick={onClose}>
      <div className="host-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', color: '#fff' }}>
        
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${getHeaderColor()}`, paddingBottom: '15px' }}>
          <h2 style={{ color: getHeaderColor(), margin: 0 }}>{result.title}</h2>
          <p style={{ fontSize: '1.1em', marginTop: '8px', color: '#aaa' }}>
            Умов виконано: <strong>{result.yesCount} / {result.total}</strong>
          </p>
        </div>

        {/* СПИСОК УМОВ */}
        <div style={{ margin: '20px 0', textAlign: 'left' }}>
          <h4>📋 Результати перевірки бункера:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            {result.details?.map((item, index) => (
              <div 
                key={index} 
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: item.passed ? 'rgba(25, 135, 84, 0.15)' : 'rgba(220, 53, 69, 0.15)',
                  borderLeft: `4px solid ${item.passed ? '#198754' : '#dc3545'}`,
                  fontSize: '0.95em'
                }}
              >
                {item.passed ? '✅' : '❌'} {item.label}
              </div>
            ))}
          </div>

          {/* КОМЕНТАР ВЕДУЧОГО */}
          {result.comment && (
            <div style={{ marginTop: '20px' }}>
              <h4>💬 Вердикт Ведучого:</h4>
              <p style={{ fontStyle: 'italic', background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #0dcaf0' }}>
                "{result.comment}"
              </p>
            </div>
          )}
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: '#0d6efd',
            color: '#fff',
            border: 'none',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '1em',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Зрозуміло
        </button>

      </div>
    </div>
  );
}