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

  async updatePlanProgress(
    path: string,
    payload: Partial<Plan>,
  ): Promise<void> {
    const res = await this.caller.patch<Plan>(path, payload);

    if (Object.keys(res).length) {
      const curr = this.planSubject.getValue();
      const replaceIndex = curr.findIndex((plan) => res.id === plan.id);
      curr[replaceIndex] = res;
    }
  }

  async post(id: string, payload: Partial<Plan>): Promise<void> {
    const res = await this.caller.post<Plan>(id, payload);

    if (res.id) {
      const curr = this.planSubject.getValue();
      curr.push(res);
    }
  }

  async delete(id: number) {
    const res = await this.caller.delete(`plan/${id}`);

    if (res.affected) {
      const curr = this.planSubject.getValue().filter((plan) => plan.id !== id);
      this.planSubject.next(curr);
    }
  }
}
