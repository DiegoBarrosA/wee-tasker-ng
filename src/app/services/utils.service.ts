import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}
  getActiveUser(){return localStorage.getItem('active_user')};
}
