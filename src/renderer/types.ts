export interface StoreState {
  difficulty: string;
  poops: number;
  width: number;
  height: number;
  games: GameReacord[];
}

export interface Difficulty {
  difficulty: string;
  width?: number;
  height?: number;
  poops?: number;
}

export interface FieldSquare {
  hasPoop: 0 | 1;
  near: number;
  open: boolean;
  flag: boolean;
}

export interface GameReacord {
  id: string;
  difficulty: string;
  time: number;
  poops: number;
  width: number;
  height: number;
  field: FieldSquare[];
}
