export interface StoreState {
  poops: number;
  width: number;
  height: number;
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
