import { getYearDeclension } from '../data/helpers';

// Стиль для лінії між клітинками
const cellBorderStyle = {
  border: '1px solid #495057',
  padding: '10px'
};

export function SummaryTable({ players }) {
  if (!players || players.length === 0) return null;

  const isOpened = (player, traitKey) => player.openedTraits?.includes(traitKey);

  return (
    <div style={{ marginTop: '40px' }}>
      <hr />
      <h2>📊 Зведена таблиця гравців (Загальний екран)</h2>
      <div className="table-wrapper">
        <table className="summary-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#212529', color: '#ffffff' }}>
              <th style={cellBorderStyle}>Гравець</th>
              <th style={cellBorderStyle}>Стать / Вік</th>
              <th style={cellBorderStyle}>Раса</th>
              <th style={cellBorderStyle}>Професія</th>
              <th style={cellBorderStyle}>Здоров'я</th>
              <th style={cellBorderStyle}>Тілобудова</th>
              <th style={cellBorderStyle}>Багаж</th>
              <th style={cellBorderStyle}>Знання</th>
              <th style={cellBorderStyle}>Доп. інформація</th>
              <th style={cellBorderStyle}>Великий інвентарь</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} style={{ backgroundColor: 'rgba(33, 37, 41, 0.85)', color: '#ffffff' }}>
                {/* Нікнейм */}
                <td style={{ ...cellBorderStyle, fontWeight: 'bold' }}>
                  {player.nickname}
                </td>

                {/* Стать / Вік (без зросту) */}
                <td className={isOpened(player, 'bio') ? 'cell-open' : 'cell-closed'} style={cellBorderStyle}>
                  {isOpened(player, 'bio') 
                    ? `${player.sex}, ${player.age} ${getYearDeclension(player.age)}`
                    : '🔒 Приховано'}
                </td>

                {/* Раса */}
                <td className={isOpened(player, 'race') ? 'cell-open' : 'cell-closed'} style={cellBorderStyle}>
                  {isOpened(player, 'race') ? player.race.title : '🔒 Приховано'}
                </td>

                {/* Професія */}
                <td className={isOpened(player, 'profession') ? 'cell-open' : 'cell-closed'} style={cellBorderStyle}>
                {isOpened(player, 'profession') 
                ? `${typeof player.profession === 'object' ? (player.profession?.name || '') : (player.profession || '')} ${player.rareProfession || player.professionRare || ''}`.trim()
                : '🔒 Приховано'}
                </td>

                {/* Здоров'я */}
                <td className={isOpened(player, 'health') ? 'cell-open' : 'cell-closed'} style={cellBorderStyle}>
                  {isOpened(player, 'health') ? player.health.details : '🔒 Приховано'}
                </td>

                {/* Тілобудова (Зріст + Статура) */}
                <td className={isOpened(player, 'body') ? 'cell-open' : 'cell-closed'} style={cellBorderStyle}>
                  {isOpened(player, 'body') 
                    ? `${player.height} см, ${player.body.title}` 
                    : '🔒 Приховано'}
                </td>

                {/* Багаж */}
                <td className={isOpened(player, 'baggage') ? 'cell-open' : 'cell-closed'} style={cellBorderStyle}>
                  {isOpened(player, 'baggage') 
                    ? (Array.isArray(player.baggage) ? player.baggage.join(', ') : player.baggage)
                    : '🔒 Приховано'}
                </td>

                <td className={isOpened(player, 'knowledge') ? 'cell-open' : 'cell-closed'} style={cellBorderStyle}>
                {isOpened(player, 'knowledge') ? player.knowledge : '🔒 Приховано'}
                </td>

                {/* Дод. інформація */}
                <td className={isOpened(player, 'dopInfo') ? 'cell-open' : 'cell-closed'} style={cellBorderStyle}>
                  {isOpened(player, 'dopInfo') ? player.DopInfo : '🔒 Приховано'}
                </td>
                <td className={isOpened(player, 'BigInventory') ? 'cell-open' : 'cell-closed'} style={cellBorderStyle}>
                  {isOpened(player, 'BigInventory') ? player.BigInventory : '🔒 Приховано'}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}