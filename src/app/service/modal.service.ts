
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Program } from '../components/programs/model/program.model';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  program = new Subject<Program>();
  onCloseSuccessfulModal = new Subject<Program>();


  openModal(program: Program) {
    this.program.next(program);
    return this.onCloseSuccessfulModal;
  }

  // OnCloseSuccessModal(){
  //   return this.OnCloseModal;
  // }

}