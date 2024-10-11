import { Component } from '@angular/core';
import { PopupComponent } from '../../popup/popup.component';
import { PopupStatusService } from '../../services/popup-status.service';
import { CommonModule } from '@angular/common';
import { PopupEnum } from '../../types/enums/PopupEnum';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [PopupComponent, CommonModule],
  templateUrl: './input.component.html',
})
export class InputComponent {
  constructor(private popupStatus: PopupStatusService) {}
  popupID: number = PopupEnum.CLI;
  popupForCli() {
    this.popupStatus.show(this.popupID);
  }
}
