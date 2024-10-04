import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PopupStatusService {
  constructor() {}
  private popupStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );
  $popupStatus = this.popupStatusSubject.asObservable();

  show() {
    document.body.style.overflow = "hidden";
    this.popupStatusSubject.next(true);
  }

  hide() {
    document.body.style.overflow = "auto";
    this.popupStatusSubject.next(false);
  }
}
