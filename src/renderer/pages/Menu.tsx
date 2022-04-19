import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './Menu.css';
import { useNavigate } from 'react-router-dom';
import { StoreState, Difficulty } from '../types';

import junior from '../images/boy.png';
import alien from '../images/alien.png';
import senior from '../images/wizard.png';
import middle from '../images/man.png';

function Menu() {
  const store = useSelector((_store: StoreState) => _store);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show_options, setShowOptions] = React.useState(false);
  const [settings, setSettings] = React.useState({
    difficulty: 'junior',
    poops: 10,
    width: 9,
    height: 9,
  });

  console.log(store);

  function setDifficulty(difficulty: string) {
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
    setSettings((old_settings) => ({
      ...old_settings,
      ...newDifficulty,
    }));
    setShowOptions(false);
  }

  React.useEffect(() => {
    window.electron.updateDifficulty((_event, difficulty:string) => {
      setDifficulty(difficulty);
    });
  }, []);

  function currentDifficulty() {
    if (
      settings.poops === 10 &&
      settings.width === 9 &&
      settings.height === 9
    ) {
      return (
        <div>
          <img src={junior} alt="junior" />
          {settings.difficulty}
        </div>
      );
    }
    if (
      settings.poops === 40 &&
      settings.width === 16 &&
      settings.height === 16
    ) {
      return (
        <div>
          <img src={middle} alt="middle" />
          {settings.difficulty}
        </div>
      );
    }
    if (
      settings.poops === 99 &&
      settings.width === 30 &&
      settings.height === 16
    ) {
      return (
        <div>
          <img src={senior} alt="senior" />
          {settings.difficulty}
        </div>
      );
    }
    return (
      <div>
        <img src={alien} alt="alien" />
        Custom
      </div>
    );
  }

  function updateSettings(event: any) {
    const { name, value } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  }

  function startGame(event: any) {
    event.preventDefault();

    // Check if settings are valid
    if (
      settings.poops >= settings.width * settings.height ||
      settings.poops < 5 ||
      settings.width > 40 ||
      settings.height > 40
    ) {
      window.alert(
        'Invalid settings. Number of poops should not be equal of exceed the number of cells (height * width)'
      );
      return;
    }

    // Clean up variables
    setShowOptions(false);

    dispatch({
      type: 'SET_DIFFICULTY',
      difficulty: settings,
    });

    navigate('/poop-field');
  }

  const optionsStyles: React.CSSProperties = {
    visibility: show_options ? 'visible' : 'hidden',
    opacity: show_options ? 1 : 0,
    transform: show_options ? 'scale(1)' : 'scale(0.95)',
  };

  return (
    <div className="Menu">
      <nav>
        <h1> ¯`*•.¸,¤°´✿.PoopssSweemer.✿`°¤,¸.•*´¯</h1>
        <form onSubmit={startGame}>
          <label>Difficulty</label>
          <div style={{ position: 'relative' }}>
            <div
              role="button"
              className="select"
              onClick={() => setShowOptions((oldvisibility) => !oldvisibility)}
            >
              {currentDifficulty()}
            </div>
            <div className="options" style={optionsStyles}>
              <button
                type="button"
                className="option"
                onClick={() => setDifficulty('junior')}
              >
                <img src={junior} alt="junior" />
                Junior
              </button>
              <button
                type="button"
                className="option"
                onClick={() => setDifficulty('middle')}
              >
                <img src={middle} alt="middle" />
                Middle
              </button>
              <button
                type="button"
                className="option"
                onClick={() => setDifficulty('senior')}
              >
                <img src={senior} alt="senior" />
                Senior
              </button>
              <button
                type="button"
                className="option"
                onClick={() => setDifficulty('custom')}
              >
                <img src={alien} alt="alien" />
                Custom
              </button>
            </div>
          </div>
          <div className="size-block">
            <div>
              <label>Width</label>
              <input
                type="number"
                name="width"
                value={settings.width}
                onChange={updateSettings}
                min="5"
                max="40"
              />
            </div>
            <div>
              <label>Height</label>
              <input
                type="number"
                name="height"
                value={settings.height}
                onChange={updateSettings}
                min="5"
                max="40"
              />
            </div>
          </div>
          <label>Poops</label>
          <input
            type="number"
            name="poops"
            value={settings.poops}
            onChange={updateSettings}
            min="5"
            max="400"
          />
          <button type="submit">Sweep the poops!</button>
        </form>
      </nav>
    </div>
  );
}

export default Menu;
