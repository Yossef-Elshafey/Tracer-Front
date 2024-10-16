import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarInfo } from '../types/interface';
import { Caller } from '../common/caller';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  constructor(private caller: Caller) {}

  @Input() markStart: Date[] = []; // Array of dates to be marked as start dates on the calendar.
  @Input() markEnd: Date[] = []; // markEnd - Array of dates to be marked as end dates on the calendar

  calendarBuilder = {} as CalendarInfo; // Object that holds information about the calendar's structure
  month = new Date().getMonth();
  year = new Date().getFullYear();

  calendarHead = '';

  prevMonthDays = [] as number[]; // the last few days from the previous month.
  currMonthDays = [] as number[]; // all days of the current month.
  nextMonthDays = [] as number[]; // the first few days from the next month.

  serverState = '';

  ngOnInit(): void {
    this.caller.$state.subscribe((state) => {
      this.serverState = state;
    });
    this.calendarHead = `${this.getMonthName(this.month)} ${this.year}`;
    this.loadCalendar();
  }

  trackByDay(index: number): number {
    return index;
  }

  isStartDateFor(day: number): boolean {
    return this.markStart.some((date) => {
      const dateInstance = new Date(date);
      const isSameDay = day === dateInstance.getDate();
      const isSameMonth = this.month === dateInstance.getMonth();
      const isSameYear = this.year === dateInstance.getFullYear();
      return isSameDay && isSameMonth && isSameYear;
    });
  }

  isToday(day: number) {
    const date = new Date();
    const today = date.getDate();
    const currMonth = date.getMonth();
    const currYear = date.getFullYear();
    return today === day && this.month === currMonth && this.year === currYear;
  }

  prepareCalendar() {
    const start = new Date(this.year, this.month, 1).getDay();
    const endDate = new Date(this.year, this.month + 1, 0).getDate();
    const end = new Date(this.year, this.month, endDate).getDay();
    const endPrevDate = new Date(this.year, this.month, 0).getDate();

    this.calendarBuilder = {
      start: start,
      endDate: endDate,
      end: end,
      endPrevDate: endPrevDate,
    };
  }

  getPrevMonthDays() {
    for (let i = this.calendarBuilder.start; i > 0; i--) {
      this.prevMonthDays.push(this.calendarBuilder.endPrevDate - i + 1);
    }
  }

  getCurrMonthDays() {
    for (let i = 1; i <= this.calendarBuilder.endDate; i++) {
      this.currMonthDays.push(i);
    }
  }

  getNextMonthDays() {
    const beforeNext = [...this.prevMonthDays, ...this.currMonthDays].length;
    const max = 6 * 7; // 6 rows, 7 columns
    const range = max - beforeNext;

    for (let i = 1; i <= range; i++) {
      if (this.nextMonthDays.length < range) {
        this.nextMonthDays.push(i);
      } else {
        break;
      }
    }
  }

  // move to next month
  toNextMonth() {
    const nextMonth = new Date(this.year, this.month + 1);
    this.month = nextMonth.getMonth();
    this.year = nextMonth.getFullYear();
    this.loadCalendar();
  }

  // move to previous month
  toPrevMonth() {
    const prevMonth = new Date(this.year, this.month - 1);
    this.month = prevMonth.getMonth();
    this.year = prevMonth.getFullYear();
    this.loadCalendar();
  }

  loadCalendar() {
    this.currMonthDays = [];
    this.nextMonthDays = [];
    this.prevMonthDays = [];
    this.calendarHead = `${this.getMonthName(this.month)} ${this.year}`;
    this.prepareCalendar();
    this.getPrevMonthDays();
    this.getCurrMonthDays();
    this.getNextMonthDays();
  }

  getMonthName(monthIndex: number): string {
    return new Date(this.year, monthIndex).toLocaleString('default', {
      month: 'long',
    });
  }
}
