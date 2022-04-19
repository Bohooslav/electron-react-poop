import { contextIsolated } from 'process';
import React from 'react';
import { useSelector } from 'react-redux';
import { StoreState } from 'renderer/types';

import './LeaderBoard.css';

function LeaderBoard() {
  const store = useSelector((_store: StoreState) => _store);
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    console.log(store);
    setCounter((oldCounter) => oldCounter + 1);
  }, [store]);

  return (
    <div className="LeaderBoard">
      <h1>LeaderBoard</h1>
      <table>
        <thead>
          <tr>
            <th>Difficulty</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {store.games.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.difficulty}</td>
              <td>{entry.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderBoard;
