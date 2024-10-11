import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../types/task';
import { Caller } from '../common/caller';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor() {}
  private taskSubject: BehaviorSubject<Task[]> = new BehaviorSubject(
    [] as Task[],
  );
  $tasks = this.taskSubject.asObservable();

  fetchTasks(): Observable<Task[]> {
    const caller = new Caller();
    return caller.getDataFor<Task>('task', this.taskSubject);
  }

  async update(id: number, payload: Partial<Task>): Promise<void> {
    const caller = new Caller();
    const res = await caller.patch<Task>(`task/${id}`, payload);
    if (Object.keys(res).length) {
      const curr = this.taskSubject.getValue();
      const replaceIndex = curr.findIndex((task) => res.id === task.id);
      curr[replaceIndex] = res;
    }
  }

  async delete(id: number): Promise<void> {
    const caller = new Caller();
    const res = await caller.delete(`task/${id}`);
    if (res.affected) {
      const curr = this.taskSubject.getValue().filter((task) => task.id !== id);
      this.taskSubject.next(curr);
    }
  }
}
