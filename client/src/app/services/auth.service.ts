import { Injectable, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
// tslint:disable-next-line:import-blacklist
import 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';

const BASEURL = environment.BASEURL;

@Injectable()
export class AuthService {

  private user: object;
  private userLoginEvent: EventEmitter<any> = new EventEmitter<any>();
  private options = {withCredentials: true};

  constructor(private http: Http, private router: Router) {
    this.isLoggedIn().subscribe();
  }

    public getLoginEventEmitter(): EventEmitter<any> {
      return this.userLoginEvent;
    }

    public getUser() {
      return this.user;
    }

    private emitUserLoginEvent(user) {
      this.user = user;
      this.userLoginEvent.emit(user);
      return user;
    }

    private handleError(e) {
      return Observable.throw(e.json().message);
    }

    signup(username, password) {
      return this.http.post(`${BASEURL}/signup`, {username, password}, this.options)
        .map(res => res.json())
        .map(user => this.emitUserLoginEvent(user))
        .map(() => this.router.navigate(['']))
        .catch(this.handleError);
    }

    login(username, password) {
      return this.http.post(`${BASEURL}/login`, {username, password}, this.options)
        .map(res => res.json())
        .map(user => this.emitUserLoginEvent(user))
        .map(() => this.router.navigate(['']))
        .catch(this.handleError);
    }

    logout() {
      this.router.navigate(['']);
      return this.http.get(`${BASEURL}/logout`, this.options)
        .map(res => res.json())
        .map(user => this.emitUserLoginEvent(null))
        .map(() => this.router.navigate(['']))
        .catch(this.handleError);
    }

    isLoggedIn() {
      return this.http.get(`${BASEURL}/loggedin`, this.options)
        .map(res => res.json())
        .map(user => this.emitUserLoginEvent(user))
        .catch(this.handleError);
    }
}
