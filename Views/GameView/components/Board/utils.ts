import { Board, Mark, RowMark } from '@/server/gameTypes';

export const valueToNumber: Record<RowMark, number> = {
  '-': 0.5,
  x: 1,
  o: 0,
};

export function getEmptyBoard(): Board {
  return [
    [
      { value: '-', lives: 6, winState: false },
      { value: '-', lives: 6, winState: false },
      { value: '-', lives: 6, winState: false },
    ],
    [
      { value: '-', lives: 6, winState: false },
      { value: '-', lives: 6, winState: false },
      { value: '-', lives: 6, winState: false },
    ],
    [
      { value: '-', lives: 6, winState: false },
      { value: '-', lives: 6, winState: false },
      { value: '-', lives: 6, winState: false },
    ],
  ];
}
