import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../types/interface';
import { CommonModule } from '@angular/common';
import { ShowLessMoreComponent } from '../show-less-more/show-less-more.component';
import { PopupComponent } from '../popup/popup.component';
import { PopupStatusService } from '../services/popup-status.service';
import { PopupEnum } from '../types/enums/PopupEnum';
import { Caller } from '../common/caller';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, ShowLessMoreComponent, PopupComponent],
  templateUrl: './task.component.html',

  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private popupService: PopupStatusService,
    private caller: Caller,
  ) {}

  tasks: Task[] = []; // Array to hold the list of tasks
  editAt: number = -1; // Index of the task currently being edited, -1 means no task is being edited
  randomDisplay = 0; // Index of the currently displayed random task
  deleteTaskID: number = -1; // ID of the task to be deleted
  showAll: boolean = false; // all tasks should be displayed ? (ShowLessMoreComponent)
  popupEnum = PopupEnum; // Expose the enum through the class
  serverState = 'down';

  ngOnInit(): void {
    this.taskService.fetchTasks().subscribe();
    this.taskService.$tasks.subscribe((tasks) => {
      this.tasks = tasks;
    });
    this.caller.$state.subscribe((state) => {
      this.serverState = state;
    });
    this.shuffleTasks();
  }

  // display random task while showAll is false
  shuffleTasks() {
    setInterval(() => {
      if (this.editAt !== -1) {
        // set randomDisplay to current index of the task under editing
        this.randomDisplay = this.tasks.findIndex(
          (task) => task.id === this.editAt,
        );
      } else {
        this.randomDisplay = Math.floor(Math.random() * this.tasks.length);
      }
    }, 5000);
  }

  editTitle(task: Task, ele: HTMLInputElement) {
    this.editAt = task.id;
    ele.readOnly = false;
    ele.focus();
  }

  editDone(task: Task) {
    const currState = task.done;
    this.taskService.update(task.id, { done: !currState });
  }

  enterPress(e: KeyboardEvent, task: Task) {
    const ele = e.currentTarget as HTMLInputElement;
    const newTaskTitle = ele.value;

    if (e.key === 'Enter') {
      e.preventDefault(); // prevent new lines while pressing enter
      ele.readOnly = true;
      this.editAt = -1;
      task.title = newTaskTitle;
      this.taskService.update(task.id, { title: newTaskTitle });
    }
  }

  preDeleteTask(id: number) {
    this.popupService.show(this.popupEnum.DELETE_TASK);
    this.deleteTaskID = id;
  }

  deleteTask() {
    this.taskService.delete(this.deleteTaskID);
    this.popupService.remove(this.popupEnum.DELETE_TASK);
  }

  preAddTask() {
    this.popupService.show(this.popupEnum.ADD_TASK);
  }

  addTask(inp: HTMLInputElement) {
    this.taskService.addTask(inp.value);
    inp.value = '';
    this.popupService.remove(this.popupEnum.ADD_TASK);
  }
}
