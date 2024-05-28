import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {SettingsService} from "../../services";
import {SoundSettingsForm} from "./models";

@Component({
  selector: 'app-sound-settings',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule, MatSlideToggleModule, ReactiveFormsModule],
  templateUrl: './sound-settings.component.html',
  styleUrl: './sound-settings.component.scss'
})
export class SoundSettingsComponent implements OnInit {
  form!: FormGroup<SoundSettingsForm>

  private location = inject(Location);
  private _SettingsService = inject(SettingsService);

  ngOnInit(): void {
    const detectionSettings = this._SettingsService.getSoundSettings();
    console.log(detectionSettings)

    this.form = new FormGroup({
      playPotholesDetectionSound: new FormControl(detectionSettings.playPotholesDetectionSound, {nonNullable: true}),
      playTrafficLightsDetectionSound: new FormControl(detectionSettings.playTrafficLightsDetectionSound, {nonNullable: true})
    })
  }

  goBack(): void {
    this.location.back();
  }

  updateSettingsConfig() {
    this._SettingsService.updateSoundSettings(this.form.getRawValue())
  }
}
