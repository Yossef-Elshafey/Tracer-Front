import { Component } from '@angular/core';
import { Caller } from '../common/caller';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  state = 'down';

  constructor(private caller: Caller) {
    this.isServerUp();
  }

  async isServerUp() {
    this.state = await this.caller.healthCheck();
  }
}
