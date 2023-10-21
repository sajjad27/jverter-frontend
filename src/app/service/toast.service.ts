
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})



export class ToastService {

  isBlocking = new Subject<boolean>();

  show() {
    this.isBlocking.next(true);
  }

  unblock(){
    this.isBlocking.next(false)
  }

}