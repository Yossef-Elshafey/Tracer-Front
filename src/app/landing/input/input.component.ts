import { Component } from "@angular/core";
import { PopupComponent } from "../../popup/popup.component";
import { PopupStatusService } from "../../services/popup-status.service";

@Component({
  selector: "app-input",
  standalone: true,
  imports: [PopupComponent],
  templateUrl: "./input.component.html",
})
export class InputComponent {
  constructor(private popupStatus: PopupStatusService) {}

  popupForCli() {
    this.popupStatus.show();
  }
}
