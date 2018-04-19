import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
@Injectable()
export class urlService {

  constructor(public http: Http) {

  }

  private headers = new Headers({'Content-Type': 'application/json'});
  public getDatas(url){
    return this.http.get(url)
          .timeout(2000).toPromise().then(response => response.json()).catch(this.handleError);
  }

  public postDatas(url: string, param: any): Promise<any> {
    return this.http
          .post(url, JSON.stringify(param), {headers: this.headers})
          .timeout(2000)  
          .toPromise()
          .then(response => response.json())
          .catch(this.handleError);

  }

  private  extractData(res: Response) {
    let body = res.json().data;
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return errMsg;
    // return Observable.throw(errMsg);
  }

}