import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Plan } from "../interfaces/plan";
import { Caller } from "../common/caller";

@Injectable({
  providedIn: "root",
})
export class PlansService {
  private planSubject: BehaviorSubject<Plan[]> = new BehaviorSubject(
    [] as Plan[],
  );
  $plans = this.planSubject.asObservable();
  constructor() {}

  fetchPlans(): Observable<Plan[]> {
    const caller = new Caller();
    return caller.getDataFor<Plan>("plan", this.planSubject);
  }
}
