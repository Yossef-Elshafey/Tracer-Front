import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopupStatusService } from "../services/popup-status.service";

@Component({
  selector: "app-popup",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./popup.component.html",
})
export class PopupComponent implements AfterViewInit {
  constructor(private popupStatus: PopupStatusService) {}

  @ViewChild("popupContainer") popupContainer!: ElementRef;

  isOpen: boolean = false;

  ngAfterViewInit(): void {
    this.popupStatus.$popupStatus.subscribe((status) => (this.isOpen = status));
  }

  @HostListener("document:click", ["$event"])
  onDocClick(event: MouseEvent) {
    if (this.isOpen && !this.isInsidePopUp(event)) {
      this.popupStatus.hide();
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
