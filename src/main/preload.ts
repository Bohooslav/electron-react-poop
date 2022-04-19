import {
  contextBridge,
  ipcRenderer,
  ipcMain,
  IpcRendererEvent,
} from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // onUpdateDifficulty: (callback) => ipcRenderer.on('update-counter', callback),
  updateDifficulty: (callback: () => void) =>
    ipcRenderer.on('update-difficulty', callback),

  restart: (callback: () => void) => ipcRenderer.on('restart', callback),

  onUpdateLeaderboard: (callback: () => void) =>
    ipcRenderer.on('update-leaderboard', callback),

  ipcRenderer: {
    myPing() {
      console.log('ping');
      ipcRenderer.send('ipc-example', 'ping');
    },

    updateLeaderboard() {
      ipcRenderer.send('update-leaderboard');
      // BrowserWindow.fromId(2)!.webContents.send('update-leaderboard');
    },

    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['update-difficulty', 'update-leaderboard'];
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
      const validChannels = ['update-difficulty', 'update-leaderboard'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
});
