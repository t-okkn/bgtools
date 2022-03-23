import {
  BgPartialData,
  ConnectResponse,
  RoomResponse,
  PointResponse,
  Message
} from './interface.models';

/**
 * WsResponse内のParamsに入る型セット
 */
export type ResponseParams =
  ConnectResponse | RoomResponse | PointResponse | Message;

/**
 * 得点ツールで保持する用のボードゲーム情報一覧
 */
 export type ScoreBoardgames = { [index: string]: BgPartialData; }

/**
 * メソッド定数
 */
export const METHOD = {
  BROADCAST:  'BROADCAST',
  CREATE:     'CREATE',
  JOIN:       'JOIN',
  LEAVE:      'LEAVE',

  NONE:       'NONE',
  CONNECT:    'CONNECT',
  DISCONNECT: 'DISCONNECT',
  EJECT:      'EJECT',
  NOTIFY:     'NOTIFY',
  OK:         'OK',
  ERROR:      'ERROR',
} as const;

/**
 * メソッド型
 */
export type Method = typeof METHOD[keyof typeof METHOD];
