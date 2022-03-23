import { environment } from './../environments/environment';

export class Const {

  static readonly BACKEND_HOST: string = environment.backend;
  static readonly WS_URL: string = this.getWebSocketUrl();

  private static getWebSocketUrl(): string {
    let url = location.protocol.replace('http', 'ws');
    url += '//' + location.hostname;

    if (environment.wsport !== '80' && environment.wsport !== '443') {
      url += ':' + environment.wsport;
    }

    url += environment.wsendpoint;
    return url;
  }
}

export class Err {

  static readonly UNEXPECTED: string =`\
    予期せぬエラーが発生しました。
    ページを更新してください。`.replace(/ /g, '');

  static readonly SERIOUS: string =`\
    現在、このアプリは利用可能な状態ではありません。
    時間が経ってからアクセスし直してください。`.replace(/ /g, '');
}
