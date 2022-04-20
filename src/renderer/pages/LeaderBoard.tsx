import React from 'react';
import { useSelector } from 'react-redux';
import { GameRecord, StoreState } from 'renderer/types';

import './LeaderBoard.css';

function LeaderBoard() {
  const store = useSelector((_store: StoreState) => _store);
  const [games, setGames] = React.useState(store.games);

  React.useEffect(() => {
    return window.electron.ipcRenderer.on(
      'update-leaderboard',
      (newGame: GameRecord) => {
        console.log(newGame);
        if (!games.find((game) => game.id === newGame.id)) {
          setGames((oldGames) => [newGame, ...oldGames]);
        }
      }
    );
  }, []);

  return (
    <div className="LeaderBoard">
      <h1>Leader Board</h1>
      {!games.length && <p>No games yet</p>}
      {games.length !== 0 && (
        <table>
          <thead>
            <tr>
              <th>Difficulty</th>
              <th>Board</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td>{game.difficulty}</td>
                <td>
                  {game.height}↔ {game.width}↕ {game.poops}💩
                </td>
                <td>{game.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LeaderBoard;
