import { Method, ResponseParams } from './type.models'

/**
 * プレイヤーの情報
 */
export interface PlayerInfoSet {
  connection_id: string;
  player_color:  string;
}

/**
 * 部屋のゲーム内容と部屋にいるプレーヤー情報
 */
export interface RoomInfoSet {
  game_id: string;
  players: PlayerInfoSet[];
}

/**
 * WebSocketでのリクエスト・レスポンス用親インターフェース
 */
export interface WsReqRes {
  method: Method;
}

/**
 * WebSocketでの送信用データ
 */
export interface WsRequest extends WsReqRes {
  connection_id: string;
  room_id:       string;
  game_id:       string;
  player_color:  string;
  points:        number[];
}

/**
 * WebSocketでの受信用データ
 */
export interface WsResponse extends WsReqRes {
  params: ResponseParams;
}

/**
 * 接続時、Response内のParamsに使用されるデータ群
 */
export interface ConnectResponse {
  connection_id: string;
}

/**
 * 部屋の情報伝達時、Response内のParamsに使用されるデータ群
 */
export interface RoomResponse {
  is_wait: boolean;
  room_id: string;
  room:    RoomInfoSet;
}

/**
 * 得点のブロードキャスト時、Response内のParamsに使用されるデータ群
 */
export interface PointResponse {
  player: PlayerInfoSet;
  points: number[];
}

/**
 * メッセージが伝達されます
 */
export interface Message {
  message: string;
}

/**
 * METHODがOKのときのみ使用されます
 */
export interface OKMessage extends Message {}

/**
 * エラー内容が入ります
 */
export interface ErrorMessage extends Message {
  error: string;
}

/**
 * 部屋の存在確認に使用される構造体
 */
export interface CheckRoomResult {
  is_exist: boolean;
  game_id:  string;
}

/**
 * スコアツール対応のボードゲームデータ
 */
export interface BgPartialData {
  title:       string;
  min_players: number;
  max_players: number;
  colors:      string[];
}

/**
 * 接続情報の一覧表示用
 */
export interface ConnectionSummary {
  connection_id: string;
  room_id:       string;
  game_id:       string;
  game_data:     BgPartialData;
  player_color:  string;
  othe_players:  PlayerInfoSet[];
}

/**
 * 部屋情報の一覧表示用
 */
export interface RoomSummary {
  room_id:   string;
  game_id:   string;
  game_data: BgPartialData;
  players:   PlayerInfoSet[];
}
