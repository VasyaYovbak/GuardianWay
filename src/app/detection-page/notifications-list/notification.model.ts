export enum NotificationTypes {
  Pothole,
  BatchSave
}

export interface NotificationModel {
  type: NotificationTypes
  date: string
}
