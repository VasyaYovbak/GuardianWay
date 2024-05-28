import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Location} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {DetectionSettingsForm} from "./models";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {SettingsService} from "../../services";

@Component({
  selector: 'app-detection-settings',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink, MatButtonToggleModule, MatSlideToggleModule, ReactiveFormsModule],
  templateUrl: './detection-settings.component.html',
  styleUrl: './detection-settings.component.scss'
})
export class DetectionSettingsComponent implements OnInit {
  form!: FormGroup<DetectionSettingsForm>

  private location = inject(Location);
  private _SettingsService = inject(SettingsService);

  ngOnInit(): void {
    const detectionSettings = this._SettingsService.getCameraDetectionSettings();
    console.log(detectionSettings)

    this.form = new FormGroup({
      showPotholes: new FormControl(detectionSettings.showPotholes, {nonNullable: true}),
      showTrafficLights: new FormControl(detectionSettings.showTrafficLights, {nonNullable: true})
    })
  }

  goBack(): void {
    this.location.back();
  }

  updateSettingsConfig() {
    this._SettingsService.updateCameraDetectionSettings(this.form.getRawValue())
  }
}
