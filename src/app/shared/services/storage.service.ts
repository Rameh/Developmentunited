import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  addItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  addMode(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  addState(value: boolean) {
    localStorage.setItem('isRegistered', value.toString());
  }

  getItem(key: string) {
    return localStorage.getItem(key);
  }

  getMode(key: string) {
    return localStorage.getItem(key);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  getState() {
    return localStorage.getItem('isRegistered');
  }

  getAvatar() {
    return localStorage.getItem('photoURL') || '/assets/img/default_avatar.png';
  }
  getUserName(){
    return localStorage.getItem('name') || 'Guest';
  }
  getemail(){
    return localStorage.getItem('email') || 'Anonymous';
  }

  logout() {
    localStorage.clear();
  }

}
