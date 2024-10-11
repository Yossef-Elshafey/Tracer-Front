import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-less-more',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-less-more.component.html',
  styleUrl: './show-less-more.component.scss',
})
export class ShowLessMoreComponent {
  @Input() showAll: boolean = false;
}
