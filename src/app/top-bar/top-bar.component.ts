import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {

}
