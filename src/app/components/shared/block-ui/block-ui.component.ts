import { Component } from '@angular/core';
import { ModalService } from 'src/app/service/modal.service';
import { ProgramService } from '../../programs/service/programs-service';
import { BlockUiService } from 'src/app/service/block-ui.service';

@Component({
  selector: 'app-block-ui',
  templateUrl: './block-ui.component.html',
  styleUrls: ['./block-ui.component.css']
})
export class BlockUiComponent {

  constructor(private blockUiService: BlockUiService) { }
  isBlocking = false;

  ngOnInit(): void {
    this.blockUiService.isBlocking.subscribe(isBlocking => {
      this.isBlocking = isBlocking
    })
  }


}
