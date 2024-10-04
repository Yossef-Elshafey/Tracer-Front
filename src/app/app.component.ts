import { Component } from "@angular/core";
import { LandingComponent } from "./landing/landing.component";

export const SERVER_URL = "http://localhost:3000";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [LandingComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {}
