import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../types/interface';
import { Caller } from '../common/caller';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private caller: Caller) {}

  private taskSubject: BehaviorSubject<Task[]> = new BehaviorSubject(
    [] as Task[],
  );

  $tasks = this.taskSubject.asObservable();

  fetchTasks(): Observable<Task[]> {
    return this.caller.get<Task>('task', this.taskSubject);
  }

  async update(id: number, payload: Partial<Task>): Promise<void> {
    const res = await this.caller.patch<Task>(`task/${id}`, payload);
    if (Object.keys(res).length) {
      const curr = this.taskSubject.getValue();
      const replaceIndex = curr.findIndex((task) => res.id === task.id);
      curr[replaceIndex] = res;
    }
  }

  async delete(id: number): Promise<void> {
    const res = await this.caller.delete(`task/${id}`);
    if (res.affected) {
      const curr = this.taskSubject.getValue().filter((task) => task.id !== id);
      this.taskSubject.next(curr);
    }
  }

  async addTask(title: string) {
    const res = await this.caller.post<Task>('task', { title: title });
    if (res.id) {
      const curr = this.taskSubject.getValue();
      curr.push(res);
    }
  }
}
