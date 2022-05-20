import {
  EMPTY_CELL, EVENT_TYPE_ERROR, EVENT_TYPE_PLAY, EVENT_TYPE_WIN, EVENT_TYPES,
  PLAYER_COLOR_RED,
  PLAYER_COLOR_YELLOW,
  PLAYER_COLORS,
  SIDE_LEFT,
  SIDE_RIGHT,
  SIDES
} from './constants';

type Brand<K, T> = K & { __brand: T }

export type GameId = Brand<string, "GameId">;
export type PlayerName = Brand<string, "PlayerName">;

export type Right = typeof SIDE_RIGHT;
export type Left = typeof SIDE_LEFT;
export type Side = typeof SIDES[number];
export type Red = typeof PLAYER_COLOR_RED;
export type Yellow = typeof PLAYER_COLOR_YELLOW;
export type PlayerColor = typeof PLAYER_COLORS[number];
export type EmptyCell = typeof EMPTY_CELL;
export type Cell = PlayerColor | EmptyCell;
export type X = Brand<number, "X">;
export type Y = Brand<number, "Y">;

export type Game = Cell[][];

export type EventTypePlay = typeof EVENT_TYPE_PLAY;
export type EventTypeWin = typeof EVENT_TYPE_WIN;
export type EventTypeError = typeof EVENT_TYPE_ERROR;
export type EventType = typeof EVENT_TYPES[number];

interface WithEventType<T extends EventType> {
  type: T
}

// api events

export interface ApiEventPlay extends WithEventType<EventTypePlay> {
  player_color: PlayerColor;
  movement: [string/*to be parsed as a number*/, Side];
}

export interface ApiEventWin extends WithEventType<EventTypeWin> {
  player: PlayerName;
}

export interface ApiEventError extends WithEventType<EventTypeError> {
  message: string;
}

export type ApiEvent = ApiEventPlay | ApiEventWin | ApiEventError;