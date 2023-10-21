
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class BlockUiService {

  isBlocking = new Subject<boolean>();

  block() {
    this.isBlocking.next(true);
  }

  unblock(){
    this.isBlocking.next(false)
  }

}