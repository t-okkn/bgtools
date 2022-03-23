import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { WebAPIService } from './webapi.service';

import * as INF from '../models/interface.models';
import { METHOD } from '../models/type.models';
import {
  RoomConfig,
  PlayerDetails,
  ErrorInfoSet,
} from '../models/config.models';


/**
 * WebSocketサーバへの接続サービスを提供します
 */
@Injectable({ providedIn: 'root' })
export class WebSocketService {

  private _socket$: WebSocketSubject<INF.WsReqRes>;
  private _connid: string;
  private _room: RoomConfig;
  private _roomwait: boolean;
  private _wserror: ErrorInfoSet;

  public get connection_id(): string {
    return this._connid;
  }

  public get room_config(): RoomConfig {
    return this._room;
  }

  public get room_waited(): boolean {
    return this._roomwait;
  }

  public get error_info(): ErrorInfoSet {
    return this._wserror;
  }

  constructor(
    private _webapi: WebAPIService
  ) {
    this._socket$ = new WebSocketSubject<INF.WsReqRes>('');
    this._connid = '';
    this._roomwait = false;

    this._room = this.getEmptyRoomConfig();
    this._wserror = {
      is_error: false,
      error: '',
      message: '',
    }
  }

/**
 * WebSocketサーバへの接続を開始します
 * @param {string} url 接続先のURL
 */
  public connect(url: string): void {
    this._socket$ = webSocket<INF.WsReqRes>(url);

    this._socket$.subscribe({
      next: (data) => {
        const res = data as INF.WsResponse;

        switch (res.method){

          /**
           * Method: CONNECT で受け取るインターフェースの形式
           * @type {ConnectResponse}
           */
          case METHOD.CONNECT:
            const cr = res.params as INF.ConnectResponse;
            this._connid = cr.connection_id;

            break;

          /**
           * Method: OK で受け取るインターフェースの形式
           * @type {RoomResponse}
           * @type {PointResponse}
           * @type {OKMessage}
           */
          case METHOD.OK:
            if ('room' in res.params) {
              const rr = res.params as INF.RoomResponse;
              this.updateRoomData(rr);

            } else if ('points') {
              const pr = res.params as INF.PointResponse;
              this.updatePlayerPointsData(pr);

            } else {
              const okr = res.params as INF.OKMessage;

              if (okr.message.indexOf('LEAVE') != -1) {
                this._room = this.getEmptyRoomConfig();

                // TODO: 部屋から退室する処理
              }
            }

            break;

          /**
           * Method: NOTIFY で受け取るインターフェースの形式
           * @type {RoomResponse}
           */
          case METHOD.NOTIFY:
            const rr = res.params as INF.RoomResponse;
            this.updateRoomData(rr);

            break;

          /**
           * Method: NOTIFY で受け取るインターフェースの形式
           * @type {PointResponse}
           */
          case METHOD.BROADCAST:
            const pr = res.params as INF.PointResponse;
            this.updatePlayerPointsData(pr);

            break;

          /**
           * Method: ERROR で受け取るインターフェースの形式
           * @type {ErrorMessage}
           */
          case METHOD.ERROR:
            const em = res.params as INF.ErrorMessage;

            this._wserror = {
              is_error: true,
              error: em.error,
              message: em.message,
            }
        }
      },

      error: (err) => {
        if ('code' in err) {
          const ce = err as CloseEvent;

          switch (ce.code) {
            case 1005:
              console.log('close-1005');
              this._room = this.getEmptyRoomConfig();
              break;

            case 1006:
              console.log('close-1006');
              this._room = this.getEmptyRoomConfig();
              break;
          }
        }
      },

      complete: () => {
        console.log('complete');
      }
    });
  }

  /**
   * WebSocketサーバへデータを送信します
   * @param {WsRequest} req リクエスト用パラメータ
   */
  public send(req: INF.WsRequest): void {
    this._socket$.next(req);
  }

  /**
   * WebSocketサーバから切断します
   */
  public disconnect(): void {
    this._socket$.complete();
  }

  /**
   * RoomConfigの情報を更新します
   * @param {RoomResponse} room_res 更新元の情報
   */
  private updateRoomData(room_res: INF.RoomResponse): void {
    if (this._room.room_id === '') {
      this._room.room_id = room_res.room_id;
    }

    if (this._room.game_id === '') {
      const gameid = room_res.room.game_id;
      this._room.game_id = gameid;

      const bgd = this._webapi.score_bgdata[gameid];
      if (bgd != null) {
        this._room.game_data = bgd;
      }
    }

    let diff = new Set<string>();
    const source = this._room.players.map(p => p.connection_id);
    const update = room_res.room.players.map(p => p.connection_id);

    if (room_res.room.players.length > this._room.players.length) {
      // 更新するプレイヤー情報で差集合を取得
      diff = new Set(update);
      source.map(p => diff.delete(p));

      // 増えているものを追加
      for (let player of room_res.room.players) {
        if (diff.has(player.connection_id)) {
          const newp: PlayerDetails = {
            connection_id: player.connection_id,
            player_color: player.player_color,
            points: [],
          };

          this._room.players.push(newp);
        }
      }

    } else {
      // 現在持っているプレイヤー情報に対して差集合を取得
      diff = new Set(source);
      update.map(p => diff.delete(p));

      // 減っているものを削除
      for (let i = 0; i < this._room.players.length; i++) {
        if (diff.has(this._room.players[i].connection_id)) {
          delete this._room.players[i];
        }
      }
    }

    this._roomwait = room_res.is_wait;
  }

  /**
   * RoomConfig内のプレイヤーごとの得点情報を更新します
   * @param {PointResponse} point_res 更新元の情報
   */
  private updatePlayerPointsData(point_res: INF.PointResponse): void {
    for (let i = 0; i < this._room.players.length; i++) {
      const cid = this._room.players[i].connection_id;

      if (cid === point_res.player.connection_id) {
        this._room.players[i].points = point_res.points;
        break;
      }
    }
  }

  /**
   * RoomConfigの空データを取得します
   * @return {RoomConfig} 空のRoomConfig
   */
  private getEmptyRoomConfig(): RoomConfig {
    return {
      room_id: '',
      game_id: '',
      game_data: {
        title: '',
        min_players: 0,
        max_players: 0,
        colors: [],
      },
      players: [],
    };
  }
}
