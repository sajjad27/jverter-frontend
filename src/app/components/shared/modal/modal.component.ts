import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Program } from 'src/app/components/programs/model/program.model';
import { ModalService } from '../../../service/modal.service';
import { ProgramService } from '../../programs/service/programs-service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  isLoading: boolean = false

  constructor(private modalService: ModalService, private programService: ProgramService) { }

  result: string = ""
  modelIsOpen = false;
  program: Program | undefined
  @ViewChild('btn', { static: false }) closeBtn: ElementRef | undefined;




  ngOnInit(): void {
    this.isLoading = true
    this.modalService.program.subscribe(program => {
      this.modelIsOpen = true;
      this.programService.getProgram(program.id!).subscribe(program => {
        this.program = program
        this.isLoading = false
        setTimeout(() => {
          this.closeBtn?.nativeElement.focus();
        }, 100);
      })
    })
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    // this.onEscapeKey();
    if (this.modelIsOpen) {
      this.closeModal()
    }
  }

  onEnter(result: string) {
    this.result = result;
  }

  closeModal() {
    this.modelIsOpen = false;
    if (this.program) {
      this.reset();
      this.modalService.onCloseSuccessfulModal.next(this.program);
    }
  }

  reset() {
    this.result = ""
  }
}
