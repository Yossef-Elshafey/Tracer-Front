import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../types/task';
import { CommonModule } from '@angular/common';
import { ShowLessMoreComponent } from '../show-less-more/show-less-more.component';
import { PopupComponent } from '../popup/popup.component';
import { PopupStatusService } from '../services/popup-status.service';
import { PopupEnum } from '../types/enums/PopupEnum';

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
  ) {}

  editAt: number = -1;
  showAll: boolean = false;
  tasks: Task[] = [];
  randomDisplay = 0;
  getConfirmation: boolean = false;
  popupID = PopupEnum.DELETETASK;

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  ngOnInit(): void {
    this.taskService.fetchTasks().subscribe((tasks) => {
      this.tasks = tasks;
      // display random task while showAll is false
      this.randomTaskDisplay(tasks.length);
    });
  }

  randomTaskDisplay(max: number): void {
    setInterval(() => {
      if (this.editAt !== -1) {
        // set randomDisplay to current index of task under editing
        this.randomDisplay = this.tasks.findIndex(
          (task) => task.id === this.editAt,
        );
      } else {
        this.randomDisplay = Math.floor(Math.random() * max);
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
    this.taskService.editTask(task.id, { done: !currState });
  }

  enterPress(e: KeyboardEvent, task: Task) {
    const ele = e.currentTarget as HTMLInputElement;
    const newTaskTitle = ele.value;

    if (e.key === 'Enter') {
      e.preventDefault(); // prevent new lines while pressing enter
      ele.readOnly = true;
      this.editAt = -1;
      task.title = newTaskTitle;
      this.taskService.editTask(task.id, { title: newTaskTitle });
    }
  }

  deleteTask(task: Task) {
    this.popupService.show(this.popupID);
  }
}
