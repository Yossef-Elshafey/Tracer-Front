import { Component, OnInit } from "@angular/core";
import { PlansService } from "../services/plans.service";
import { Plan } from "../interfaces/plan";

@Component({
  selector: "app-plans",
  standalone: true,
  imports: [],
  templateUrl: "./plans.component.html",
  styleUrl: "./plans.component.scss",
})
export class PlansComponent implements OnInit {
  constructor(private planService: PlansService) {}
  plans = [] as Plan[];

  ngOnInit(): void {
    this.planService.fetchPlans().subscribe((plans) => (this.plans = plans));
  }
}
