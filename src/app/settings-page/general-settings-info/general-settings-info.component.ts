import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-general-settings-info',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDividerModule, MatButtonModule, RouterLink],
  templateUrl: './general-settings-info.component.html',
  styleUrl: './general-settings-info.component.scss'
})
export class GeneralSettingsInfoComponent {

}
