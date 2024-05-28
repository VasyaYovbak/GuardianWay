import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {NotificationModel, NotificationTypes} from "./notification.model";

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsListComponent {
  protected notificationList: NotificationModel[] = [];

  readonly NotificationTypes = NotificationTypes;

  private _changeDetectionRef = inject(ChangeDetectorRef)

  addNotification(notification: NotificationModel) {
    this.notificationList.push(notification);
    this._changeDetectionRef.detectChanges();
  }
}
