export enum NotificationTypes {
  Pothole
}

export interface NotificationModel {
  type: NotificationTypes
  date: string
}
