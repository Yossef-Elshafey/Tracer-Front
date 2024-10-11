import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

// Class to control popup all over the app
export class PopupStatusService {
  constructor() {}
  /*
   * Each popup is registered on a mapper,
   * you could display popus from the mapper by calling show method or even add new ones
   */
  private popupStatusMap: Map<number, BehaviorSubject<boolean>> = new Map();

  // subscribe to observable
  getPopupStatus(popupId: number): Observable<boolean> {
    if (!this.popupStatusMap.has(popupId)) {
      this.popupStatusMap.set(popupId, new BehaviorSubject<boolean>(false));
    }
    return this.popupStatusMap.get(popupId)!.asObservable();
  }

  // add the popup id that being require to show through out the PopupEnum
  // @Param popupId: NOTE: use PopupEnum to pass which popup to show
  show(popupId: number) {
    document.body.style.overflow = 'hidden';
    if (!this.popupStatusMap.has(popupId)) {
      this.popupStatusMap.set(popupId, new BehaviorSubject<boolean>(true));
    } else {
      this.popupStatusMap.get(popupId)!.next(true);
    }
  }

  // popups have the ability to hide themselves under some actions
  // @Param popupId: NOTE: use PopupEnum to pass which popup to remove for manually remove
  remove(popupId: number) {
    document.body.style.overflow = 'auto';
    if (this.popupStatusMap.has(popupId)) {
      this.popupStatusMap.get(popupId)!.next(false);
    }
  }
}
