export type Mark = 'o' | 'x';
export type RowMark = Mark | '-';

export type Cell = {
  value: RowMark;
  lives: number;
  winState: boolean;
};
export type Row = [Cell, Cell, Cell];
export type Board = [Row, Row, Row];

export enum GameState {
  WAITING = 'waiting',
  PLAYING = 'playing',
  FINISHED = 'finished',
  OPPONENT_DISCONNECTED = 'opponentDisconnected',
  NONE = 'none',
}
