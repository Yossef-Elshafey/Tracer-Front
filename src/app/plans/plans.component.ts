import { Component, OnInit } from '@angular/core';
import { PlansService } from '../services/plans.service';
import { Plan } from '../types/interface';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
})
export class PlansComponent implements OnInit {
  constructor(private planService: PlansService) {}
  plans = [] as Plan[];

  ngOnInit(): void {
    this.planService.fetchPlans().subscribe();
    this.planService.$plans.subscribe((plans) => {
      this.plans = plans;
    });
  }
}
