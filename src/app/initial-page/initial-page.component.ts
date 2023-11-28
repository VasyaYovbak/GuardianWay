import {AfterViewInit, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {InitialPageService} from "./initial-page.service";
import {PotholePosition} from "./models";
import {POTHOLE_POSITIONS} from "./constants";

@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.scss'
})
export class InitialPageComponent implements AfterViewInit {
  protected isAnimationActive = false;
  protected renderedPotholePositions: PotholePosition[] = [];

  private _initialPageService = inject(InitialPageService);
  private _router = inject(Router)

  private _initialPotholes = POTHOLE_POSITIONS;


  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.renderedPotholePositions = this._initialPotholes
        .map(pothole => this._initialPageService.getCurrentPotholePosition(pothole))
    })

  }

  onGoEvent() {
    this.isAnimationActive = true;

    setTimeout(() => {
      this._router.navigate(['home'])
    }, 2000)
  }
}
