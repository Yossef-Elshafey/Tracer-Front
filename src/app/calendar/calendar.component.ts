import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarInfo } from '../types/interface';

type PrevDaysOrNext = {
  next: boolean;
  prev: boolean;
};

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  @Input() markEnd: string[] = []; // to be marked as end dates on the calendar.
  @Output() dayClicked = new EventEmitter<string>();

  calendarBuilder = {} as CalendarInfo; // Object that holds information about the calendar's structure
  month = new Date().getMonth();
  year = new Date().getFullYear();

  calendarHead = '';

  prevMonthDays = [] as number[]; // the last few days from the previous month.
  currMonthDays = [] as number[]; // all days of the current month.
  nextMonthDays = [] as number[]; // the first few days from the next month.

  ngOnInit(): void {
    this.loadCalendar();
  }

  emitValue(e: MouseEvent, month: number) {
    const btn = e.currentTarget as HTMLButtonElement;

    this.dayClicked.emit(
      `${this.year}-${this.month + month}-${btn.innerHTML.trim()}`,
    );
  }

  trackByDay(index: number): number {
    return index;
  }

  // while calendar is displayed, it has values from prev,curr,next, month's days
  // to.next mark the displayed data for the next month, same for to.prev but the previous
  // if { to } not provided calc for the curr month
  marker(
    day: number,
    mark: 'markEnd', // Input values
    to: PrevDaysOrNext = { next: false, prev: false },
  ) {
    const dates = this[mark];

    return dates.some((date: string) => {
      let monthCompare;

      if (to.prev) {
        monthCompare = this.month - 1;
      } else if (to.next) {
        monthCompare = this.month + 1;
      } else {
        monthCompare = this.month;
      }

      const dateInstance = new Date(date);
      const isSameDay = day === dateInstance.getDate();
      const isSameMonth = monthCompare === dateInstance.getMonth();
      const isSameYear = this.year === dateInstance.getFullYear();
      return isSameDay && isSameMonth && isSameYear;
    });
  }

  markAsEndDate(
    day: number,
    to: { next: boolean; prev: boolean } = { next: false, prev: false },
  ): boolean {
    return this.marker(day, 'markEnd', to);
  }

  isToday(day: number) {
    const date = new Date();
    const today = date.getDate();
    const currMonth = date.getMonth();
    const currYear = date.getFullYear();
    const compare =
      today === day && this.month === currMonth && this.year === currYear;
    return compare;
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
    const max = 6 * 7; // always 6 rows
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
