import {
  BgPartialData,
  PlayerInfoSet,
  ErrorMessage
} from './interface.models'

/**
 * プレイヤーの詳細情報
 */
export interface PlayerDetails extends PlayerInfoSet {
  points: number[];
}

/**
 * エラー情報の連携用
 */
 export interface ErrorInfoSet extends ErrorMessage {
  is_error: boolean;
}

/**
 * 部屋情報設定保持用
 */
export interface RoomConfig {
  room_id:   string;
  game_id:   string;
  game_data: BgPartialData;
  players:   PlayerDetails[];
}

/**
 * ボードゲーム情報の表示用
 */
export interface BgDisplayData {
  game_id: string;
  title:   string;
}
