export function ActionCardsTable({ players }) {
  return (
    <div style={{ marginTop: '30px' }}>
      <h2 style={{ color: '#0d6efd' }}>🎯 Зведена таблиця Карток Дій</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', boxShadox: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#212529', color: '#fff' }}>
              <th style={{ padding: '12px', border: '1px solid #000000' }}>Гравець</th>
              <th style={{ padding: '12px', border: '1px solid #000000' }}>Картка дії №1</th>
              <th style={{ padding: '12px', border: '1px solid #000000' }}>Картка дії №2</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => {
              const isAct1Opened = p.openedTraits?.includes('actionCard1');
              const isAct2Opened = p.openedTraits?.includes('actionCard2');

              return (
                <tr key={p.id} style={{ textAlign: 'center' }}>
                  <td style={{ padding: '10px', backgroundColor: 'rgba(33, 37, 41, 0.85)', border: '1px solid #495057', fontWeight: 'bold', color: '#ffffff' }}>
  {p.nickname}
</td>
                  
                  {/* Поле Картки Дії 1 */}
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #dee2e6', 
                    backgroundColor: isAct1Opened ? '#d1e7dd' : '#f8f9fa',
                    color: isAct1Opened ? '#0f5132' : '#6c757d',
                    fontWeight: isAct1Opened ? 'bold' : 'normal'
                  }}>
                    {isAct1Opened ? p.actionCard1 : '🔒 [Приховано]'}
                  </td>

                  {/* Поле Картки Дії 2 */}
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #dee2e6', 
                    backgroundColor: isAct2Opened ? '#d1e7dd' : '#f8f9fa',
                    color: isAct2Opened ? '#0f5132' : '#6c757d',
                    fontWeight: isAct2Opened ? 'bold' : 'normal'
                  }}>
                    {isAct2Opened ? p.actionCard2 : '🔒 [Приховано]'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}