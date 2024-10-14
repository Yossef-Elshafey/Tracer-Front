import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarInfo } from '../types/interface';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  arrOfMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  calendarBuilder = {} as CalendarInfo;
  month = new Date().getMonth();
  year = new Date().getFullYear();
  calendarHead = '';
  calendar = [] as number[];

  constructor() {
    this.calendarHead = `${this.arrOfMonths[this.month]} ${this.year}`;
    this.calendarInit();
  }

  trackByDay(day: number): number {
    return day;
  }

  isToday(day: number) {
    const date = new Date();
    const today = date.getDate();
    const currMonth = date.getMonth();
    const currYear = date.getFullYear();
    return today === day && this.month === currMonth && this.year === currYear;
  }

  prepareCalendar() {
    /* holds the day of the week for the first day of the month */
    const start = new Date(this.year, this.month, 1).getDay();
    // holds the last day as number of the current month
    const endDate = new Date(this.year, this.month + 1, 0).getDate();
    // generate date for the current month end
    const end = new Date(this.year, this.month, endDate).getDay();
    // holds the last day of the previous month
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
      this.calendar.push(this.calendarBuilder.endPrevDate - i + 1);
    }
  }

  getCurrMonthDays() {
    for (let i = 1; i <= this.calendarBuilder.endDate; i++) {
      this.calendar.push(i);
    }
  }

  getNextMonthDays() {
    for (let i = this.calendarBuilder.end; i < 6; i++) {
      this.calendar.push(i - this.calendarBuilder.end + 1);
    }
  }

  toNextMonth() {
    if (this.month + 1 > 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this.calendarInit();
  }

  toPrevMonth() {
    if (this.month - 1 < 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this.calendarInit();
  }

  calendarInit() {
    this.calendar = [];
    this.calendarHead = `${this.arrOfMonths[this.month]} ${this.year}`;
    this.prepareCalendar();
    this.getPrevMonthDays();
    this.getCurrMonthDays();
    this.getNextMonthDays();
  }
}
