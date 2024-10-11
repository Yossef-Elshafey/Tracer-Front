import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupStatusService } from '../services/popup-status.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
})
export class PopupComponent implements OnInit {
  constructor(private popupStatus: PopupStatusService) {}

  @ViewChild('popupContainer') popupContainer!: ElementRef;

  isOpen: boolean = false;
  @Input() popupID: number = -1;

  ngOnInit(): void {
    this.popupStatus
      .getPopupStatus(this.popupID)
      .subscribe((status) => (this.isOpen = status));
  }

  @HostListener('window:keydown', ['$event'])
  closeESC(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isOpen) {
      this.popupStatus.hide(this.popupID);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    if (this.isOpen && !this.isInsidePopUp(event)) {
      this.popupStatus.hide(this.popupID);
    }
  }

  isInsidePopUp(event: MouseEvent) {
    if (this.popupContainer) {
      const popupCont = this.popupContainer.nativeElement;
      const target = event.target;
      return popupCont.isEqualNode(target);
    }
    return true;
  }

  onPopupClick(event: MouseEvent): void {
    event.stopImmediatePropagation();
  }
}
