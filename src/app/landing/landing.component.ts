import { Component } from "@angular/core";
import { InputComponent } from "./input/input.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { PlansComponent } from "../plans/plans.component";
import { TaskComponent } from "../task/task.component";

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [InputComponent, NavbarComponent, PlansComponent, TaskComponent],
  templateUrl: "./landing.component.html",
  styleUrl: "./landing.component.scss",
})
export class LandingComponent {}
