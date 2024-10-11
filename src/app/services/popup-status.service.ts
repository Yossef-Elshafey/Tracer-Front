import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

// Each popup gets a name for its display, ( PopupEnum )
export class PopupStatusService {
  private popupStatusMap: Map<number, BehaviorSubject<boolean>> = new Map();

  constructor() {}

  // subscribe to observable
  getPopupStatus(popupId: number): Observable<boolean> {
    if (!this.popupStatusMap.has(popupId)) {
      this.popupStatusMap.set(popupId, new BehaviorSubject<boolean>(false));
    }
    return this.popupStatusMap.get(popupId)!.asObservable();
  }

  // show the popup via the service given a popupId
  show(popupId: number) {
    document.body.style.overflow = 'hidden';
    if (!this.popupStatusMap.has(popupId)) {
      this.popupStatusMap.set(popupId, new BehaviorSubject<boolean>(true));
    } else {
      this.popupStatusMap.get(popupId)!.next(true);
    }
  }

  // popup component hides it self just showing it and it closes it self on spesific actions
  // you could close it manually by calling this method
  hide(popupId: number) {
    document.body.style.overflow = 'auto';
    if (this.popupStatusMap.has(popupId)) {
      this.popupStatusMap.get(popupId)!.next(false);
    }
  }
}
