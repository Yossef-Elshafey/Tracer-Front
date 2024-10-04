import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Task } from "../interfaces/task";
import { Caller } from "../common/caller";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  constructor() {}
  private taskSubject: BehaviorSubject<Task[]> = new BehaviorSubject(
    [] as Task[],
  );
  $tasks = this.taskSubject.asObservable();

  fetchTasks(): Observable<Task[]> {
    const caller = new Caller();

    return caller.call<Task>("task", this.taskSubject);
  }
}
