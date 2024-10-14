import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Plan } from '../types/interface';
import { Caller } from '../common/caller';

@Injectable({
  providedIn: 'root',
})
export class PlansService {
  private planSubject: BehaviorSubject<Plan[]> = new BehaviorSubject(
    [] as Plan[],
  );
  $plans = this.planSubject.asObservable();
  constructor(private caller: Caller) {}

  fetchPlans(): Observable<Plan[]> {
    return this.caller.get<Plan>('plan', this.planSubject);
  }
}
