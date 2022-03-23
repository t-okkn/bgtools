import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, lastValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Const, Err } from '../app.const';
import { CheckRoomResult, BgPartialData } from '../models/interface.models';
import { METHOD, ScoreBoardgames } from '../models/type.models';


/**
 * WebAPIと通信して値を送受信するサービスを提供します
 */
@Injectable({ providedIn: 'root' })
export class WebAPIService {

  private _bgdata: ScoreBoardgames;
  private _header: HttpHeaders;

  public get score_bgdata(): ScoreBoardgames {
    return this._bgdata;
  }

  constructor(
    private _http: HttpClient,
  ) {
    this._bgdata = {};
    this._header = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      });
  }

  public async getScoreBgData(): Promise<void> {
    const host = Const.BACKEND_HOST + '/score/boardgames';
    const op = {headers: this._header};

    const getter$ = this._http.get<ScoreBoardgames>(host, op).pipe(
      map((res) => {
        if (res == null) {
          throw new Error('undefined');
        }

        return res as ScoreBoardgames;
      }),

      catchError((err) => {
        const tmp: ScoreBoardgames = {};
        return of(tmp);
      })
    );

    this._bgdata = await lastValueFrom(getter$);
  }

  public checkRoom(roomid: string): Observable<CheckRoomResult> {
    const host = `${Const.BACKEND_HOST}/score/rooms/${roomid}`;
    const op = {headers: this._header};

    return this._http.get<CheckRoomResult>(host, op).pipe(
      map((res) => {
        if (res == null) {
          throw new Error('undefined');
        }

        return res as CheckRoomResult;
      }),

      catchError((err) => {
        const tmp: CheckRoomResult = {
          is_exist: false,
          game_id:  '',
        };

        return of(tmp);
      })
    );
  }

}
