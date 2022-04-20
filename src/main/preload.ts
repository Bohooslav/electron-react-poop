import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { GameRecord } from 'renderer/types';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    updateLeaderboard(newGame: GameRecord) {
      ipcRenderer.send('update-leaderboard', newGame);
    },

    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = [
        'restart',
        'update-difficulty',
        'update-leaderboard',
      ];
      if (validChannels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      }

      return undefined;
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
});
