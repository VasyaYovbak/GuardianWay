import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDividerModule, NgOptimizedImage],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {

}
