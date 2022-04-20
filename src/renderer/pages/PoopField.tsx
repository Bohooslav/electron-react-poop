/* eslint-disable no-plusplus */
import React from 'react';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { StoreState, FieldSquare, Difficulty } from '../types';
import './PoopField.css';

import alive from '../images/alive.png';
import exploding from '../images/exploding.png';
import sunglasses from '../images/sunglasses.png';
import wow from '../images/wow.png';

enum STATUS {
  'alive',
  'exploding',
  'sunglasses',
  'wow',
}

let watchInterval: NodeJS.Timeout;

export default function PoopField() {
  const store = useSelector((stores: StoreState) => stores);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [timer, setTimer] = React.useState({
    timerOn: false,
    timerStart: 0,
    timerTime: 0,
  });
  const [WOW, setWow] = React.useState(false);
  const [status, setStatus] = React.useState(STATUS.alive);
  const [FIELD, setField] = React.useState<FieldSquare[]>([]);
  const [FLAGS, setFlags] = React.useState(0);
  const [WASTHERE, setWasThere] = React.useState<number[]>([]);

  function stopTimer() {
    setTimer((oldTimer) => ({ ...oldTimer, timerOn: false }));
    clearInterval(watchInterval);
  }

  function deepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  // USE mutable version of variables for processing
  let flags = FLAGS;
  const field = deepCopy(FIELD);
  const wasThere = deepCopy(WASTHERE);

  function fieldSquare() {
    return store.width * store.height;
  }

  function generateField() {
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    setTimer({
      timerOn: false,
      timerTime: 0,
      timerStart: Date.now(),
    });
    clearInterval(watchInterval);

    const fieldsize = store.width * store.height;
    const newField: FieldSquare[] = [];
    let i = 0;

    // Fill the field with empty squares
    while (i < fieldsize) {
      newField.push({
        hasPoop: 0,
        near: 0,
        open: false,
        flag: false,
      });
      i++;
    }

    i = 0;
    // Randomly fill the field with poops
    while (i < store.poops) {
      const position = getRandomInt(fieldsize);
      if (!newField[position].hasPoop) {
        newField[position].hasPoop = 1;
      } else {
        i--;
      }
      i++;
    }

    // Count poops around each square
    i = 0;
    while (i < fieldsize) {
      if (i - 1 >= 0 && i % store.width !== 0) {
        newField[i].near += newField[i - 1].hasPoop;
      }
      if (i + 1 < fieldsize && (i + 1) % store.width !== 0) {
        newField[i].near += newField[i + 1].hasPoop;
      }
      if (
        i - store.width + 1 >= 0 &&
        (i - store.width + 1) % store.width !== 0
      ) {
        newField[i].near += newField[i - store.width + 1].hasPoop;
      }
      if (i - store.width >= 0) {
        newField[i].near += newField[i - store.width].hasPoop;
      }
      if (i - store.width - 1 >= 0 && (i - store.width) % store.width !== 0) {
        newField[i].near += newField[i - store.width - 1].hasPoop;
      }
      if (i + store.width - 1 < fieldsize && i % store.width !== 0) {
        newField[i].near += newField[i + store.width - 1].hasPoop;
      }
      if (i + store.width < fieldsize) {
        newField[i].near += newField[i + store.width].hasPoop;
      }
      if (
        i + store.width + 1 < fieldsize &&
        (i + store.width + 1) % store.width !== 0
      ) {
        newField[i].near += newField[i + store.width + 1].hasPoop;
      }

      // For testing
      // if (newField[i].near && !newField[i].hasPoop) {
      //   newField[i].open = true
      // }
      i++;
    }
    setField(newField);
    setStatus(STATUS.alive);
    setWasThere([]);
    setFlags(0);
  }

  React.useEffect(() => {
    // window.electron.ipcRenderer.updateLeaderboard({
    //   id: nanoid(),
    //   difficulty: store.difficulty,
    //   time: Math.floor(timer.timerTime / 1000),
    //   poops: store.poops,
    //   width: store.width,
    //   height: store.height,
    // });

    return window.electron.ipcRenderer.on('restart', generateField);
  }, []);

  React.useEffect(() => {
    return window.electron.ipcRenderer.on(
      'update-difficulty',
      (difficulty: string) => {
        const newDifficulty: Difficulty = { difficulty };
        if (difficulty === 'junior') {
          newDifficulty.width = 9;
          newDifficulty.height = 9;
          newDifficulty.poops = 10;
        } else if (difficulty === 'middle') {
          newDifficulty.width = 16;
          newDifficulty.height = 16;
          newDifficulty.poops = 40;
        } else if (difficulty === 'senior') {
          newDifficulty.width = 30;
          newDifficulty.height = 16;
          newDifficulty.poops = 99;
        }

        dispatch({
          type: 'SET_DIFFICULTY',
          difficulty: newDifficulty,
        });
      }
    );
  }, []);

  function startTimer() {
    setTimer((oldTimer) => ({
      timerOn: true,
      timerTime: oldTimer.timerTime,
      timerStart: Date.now(),
    }));
    watchInterval = setInterval(() => {
      setTimer((oldTimer) => ({
        ...oldTimer,
        timerTime: Date.now() - oldTimer.timerStart,
      }));
    }, 10);
  }

  // Initialize empty field while routed to this page
  React.useEffect(() => {
    generateField();
  }, [store.width, store.height, store.poops]);

  // Automatically open squares around empty squares
  function openEmptyTiles(emptyTileIndex: number) {
    const fieldsize = fieldSquare();
    if (field[emptyTileIndex].flag) {
      field[emptyTileIndex].flag = false;
    }

    flags++;
    wasThere.push(emptyTileIndex);
    field[emptyTileIndex].open = true;
    if (field[emptyTileIndex].near > 0) return;

    if (
      emptyTileIndex + 1 < fieldsize &&
      (emptyTileIndex + 1) % store.width !== 0 &&
      !wasThere.includes(emptyTileIndex + 1)
    ) {
      openEmptyTiles(emptyTileIndex + 1);
    }
    if (
      emptyTileIndex + store.width + 1 < fieldsize &&
      (emptyTileIndex + store.width + 1) % store.width !== 0 &&
      !wasThere.includes(emptyTileIndex + store.width + 1)
    ) {
      openEmptyTiles(emptyTileIndex + store.width + 1);
    }
    if (
      emptyTileIndex + store.width < fieldsize &&
      !wasThere.includes(emptyTileIndex + store.width)
    ) {
      openEmptyTiles(emptyTileIndex + store.width);
    }
    if (
      emptyTileIndex + store.width - 1 < fieldsize &&
      emptyTileIndex % store.width !== 0 &&
      !wasThere.includes(emptyTileIndex + store.width - 1)
    ) {
      openEmptyTiles(emptyTileIndex + store.width - 1);
    }
    if (
      emptyTileIndex - 1 >= 0 &&
      emptyTileIndex % store.width !== 0 &&
      !wasThere.includes(emptyTileIndex - 1)
    ) {
      openEmptyTiles(emptyTileIndex - 1);
    }
    if (
      emptyTileIndex - store.width - 1 >= 0 &&
      (emptyTileIndex - store.width) % store.width !== 0 &&
      !wasThere.includes(emptyTileIndex - store.width - 1)
    ) {
      openEmptyTiles(emptyTileIndex - store.width - 1);
    }
    if (
      emptyTileIndex - store.width >= 0 &&
      !wasThere.includes(emptyTileIndex - store.width)
    ) {
      openEmptyTiles(emptyTileIndex - store.width);
    }
    if (
      emptyTileIndex - store.width + 1 >= 0 &&
      (emptyTileIndex - store.width + 1) % store.width !== 0 &&
      !wasThere.includes(emptyTileIndex - store.width + 1)
    ) {
      openEmptyTiles(emptyTileIndex - store.width + 1);
    }
  }

  function openSquare(choosen: number) {
    if (status === STATUS.sunglasses || status === STATUS.exploding) return;

    if (flags === 0) startTimer();

    const fieldsize = fieldSquare();
    if (!field[choosen].flag && !field[choosen].open) {
      let i = 0;
      if (field[choosen].hasPoop) {
        while (i < fieldsize) {
          if (field[i].hasPoop) {
            field[i].open = true;
          }
          i++;
        }
        setStatus(STATUS.exploding);
        stopTimer();
      } else if (field[choosen].near > 0) {
        field[choosen].open = true;
        flags++;
        wasThere.push(choosen);
      } else {
        openEmptyTiles(choosen);
      }
      if (flags >= fieldsize - store.poops) {
        field.forEach((square: FieldSquare) => {
          if (square.hasPoop) {
            square.flag = true;
          }
        });
        setStatus(STATUS.sunglasses);
        stopTimer();
        const newGame = {
          id: nanoid(),
          difficulty: store.difficulty,
          time: Math.floor(timer.timerTime / 1000),
          poops: store.poops,
          width: store.width,
          height: store.height,
          field,
        };

        window.electron.ipcRenderer.updateLeaderboard(newGame);

        dispatch({
          type: 'SAVE_GAME',
          games: [newGame, ...store.games],
        });
      }
    }
    setField(field);
    setFlags(flags);
    setWasThere(wasThere);
  }

  function flagSquare(choosen: number) {
    if (status === STATUS.sunglasses || status === STATUS.exploding) return;
    if (!field[choosen].open) {
      field[choosen].flag = !field[choosen].flag;
      setField(field);
    }
  }

  function markedSquares() {
    if (!field.length) {
      return store.poops;
    }
    let counter = 0;
    for (let i = 0; i < fieldSquare(); i++) {
      if (field[i]?.flag) {
        counter++;
      }
    }
    counter = store.poops - counter;
    if (counter < 10) {
      return `00${counter}`;
    }
    if (counter < 100) {
      return `0${counter}`;
    }
    return counter;
  }

  function timeInSeconds() {
    const seconds = Math.floor(timer.timerTime / 1000);
    if (seconds < 10) {
      return `00${seconds}`;
    }
    if (seconds < 100) {
      return `0${seconds}`;
    }
    return seconds;
  }

  function gameStatusImage() {
    if (status === STATUS.sunglasses) {
      return sunglasses;
    }
    if (status === STATUS.exploding) {
      return exploding;
    }
    if (WOW) {
      return wow;
    }
    return alive;
  }

  const className = (index: number) => {
    if (field[index].open) {
      if (field[index].hasPoop) {
        return 'square poop';
      }
      if (field[index].near === 0) {
        return 'square empty';
      }
      // Detect color for number of poops around
      return `square open color${field[index].near}`;
    }
    if (field[index].flag) {
      return 'square flag';
    }
    return 'square';
  };

  function toggleWow(state: boolean) {
    if (!(status === STATUS.sunglasses || status === STATUS.exploding))
      setWow(state);
  }

  const squares = field.map((square: FieldSquare, index: number) => (
    <button
      type="button"
      key={index}
      onPointerDown={() => toggleWow(true)}
      onPointerUp={() => toggleWow(false)}
      className={className(index)}
      onClick={() => openSquare(index)}
      onContextMenu={(event) => {
        event.preventDefault();
        flagSquare(index);
      }}
    >
      {square.open && square.near && !square.hasPoop ? square.near : ''}
    </button>
  ));

  return (
    <main>
      <nav>
        <button
          type="button"
          title="Menu"
          className="humburger"
          onClick={() => navigate('/')}
        >
          ☰
        </button>
        <div className="counter" title="Mines left">
          {markedSquares()}
        </div>
        <div
          role="button"
          tabIndex={0}
          className="gameStatusImage"
          onClick={generateField}
        >
          <img alt="status" src={gameStatusImage()} />
        </div>
        <div className="counter" title="Timer">
          {timeInSeconds()}
        </div>
      </nav>
      <div className="field-wrapper">
        <div
          className="poop-field"
          style={{
            gridTemplateColumns: `repeat(${store.width}, 1fr)`,
          }}
        >
          {squares}
        </div>
      </div>
    </main>
  );
}
