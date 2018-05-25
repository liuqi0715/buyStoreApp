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

  private handleError(err):Promise<any> {
    if(err.status==503||err.status==0){
            return Promise.reject({"errorMassage":'应用服务器不可用！'});
        }
        if(err.status==404){
            return Promise.reject({"errorMassage":'您请求的资源不存在！'});
        }
        //防止服务器返回非约定格式的错误信息时，向用户弹出离奇错误提示
        if(err.errorMassage&&err.errorMassage!==""&&typeof err.errorMassage=='string'){
            return Promise.reject(err);
        }else if(err.message == "Timeout has occurred") {
            return Promise.reject({"errorMassage": "请求超时，请重试！"});
        }else {
            console.error('HxsmartHttp.post:服务器内部错误，原始响应如下：',err);
            return Promise.reject({"errorMassage":'服务器内部错误'});
     }
  }

}
