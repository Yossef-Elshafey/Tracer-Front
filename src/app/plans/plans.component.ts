import { Component, OnInit } from '@angular/core';
import { PlansService } from '../services/plans.service';
import { Plan } from '../types/interface';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { Caller } from '../common/caller';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
})
export class PlansComponent implements OnInit {
  // TODO: Complete the right hand side of plans
  constructor(
    private planService: PlansService,
    private caller: Caller,
  ) {}

  plans = [] as Plan[];
  plansStartAt: string[] = [];
  plansEndAt: string[] = [];
  serverState = '';
  dayClicked = '';

  ngOnInit(): void {
    this.planService.fetchPlans().subscribe();
    this.planService.$plans.subscribe((plans) => {
      this.plans = plans;
      this.startAt();
      this.endAt();
    });

    this.caller.$state.subscribe((state) => {
      this.serverState = state;
    });
  }

  startAt() {
    this.plansStartAt = this.plans.map((obj) => obj.added);
  }

  endAt() {
    this.plansEndAt = this.plans.map((obj) => obj.finish_by);
  }

  captureEmitValue(e: string) {
    this.dayClicked = e;
  }

  baseCompare(key: keyof Pick<Plan, 'finish_by' | 'added'>) {
    return this.plans.some((obj) => {
      const planDate = new Date(obj[key]);

      if (this.dayClicked) {
        const date = new Date(this.dayClicked);
        return (
          date.getFullYear() === planDate.getFullYear() &&
          date.getMonth() === planDate.getMonth() &&
          date.getDate() === planDate.getDate()
        );
      }
      return false;
    });
  }

  isDateStartOfPlan() {
    return this.baseCompare('added');
  }
  isDateEndOfPlan() {
    return this.baseCompare('finish_by');
  }
}
