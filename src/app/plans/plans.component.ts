import { Component, EventEmitter, OnInit } from '@angular/core';
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
  constructor(
    private planService: PlansService,
    private caller: Caller,
  ) {}

  plans = [] as Plan[];
  plansStartAt: Date[] = [];
  serverState = '';
  dayClicked = '';

  ngOnInit(): void {
    this.planService.fetchPlans().subscribe();
    this.planService.$plans.subscribe((plans) => {
      this.plans = plans;
      this.startAt();
    });

    this.caller.$state.subscribe((state) => {
      this.serverState = state;
    });
  }

  startAt() {
    this.plansStartAt = this.plans.map((obj) => obj.added);
  }

  captureEmitValue(e: string) {
    console.log(e);
  }
}
