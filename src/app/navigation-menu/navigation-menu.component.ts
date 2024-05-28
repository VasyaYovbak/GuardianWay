import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {RouterLink, RouterModule} from "@angular/router";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonToggleModule, RouterLink, RouterModule, MatIconButton],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss'
})
export class NavigationMenuComponent {

}
