import { GameRecord } from './types';

export interface IElectron {
  ipcRenderer: {
    updateLeaderboard: (newGame: GameRecord) => void;

    on: (channel: string, func: (...args: any[]) => void) => () => void;

    once: (channel: string, func: (...args: any[]) => void) => void;
  };
}

declare global {
  interface Window {
    electron: IElectron;
  }
}
