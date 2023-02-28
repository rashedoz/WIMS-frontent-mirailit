export enum StatusTypes {
  ACTIVE = 1,
  INACTIVE = 2,
  DELETED = 3,
  DRAFTED = 4,
  PUBLISHED = 5,
}

export enum PaymentType {
  CASH = 1,
  FROM_BALANCE = 2,
  CARD_PAYMENT = 3,
  ONLINE_BANKING = 4,
}

export enum StockStatus {
  AVAILABLE = 1,
  SUBSCRIBED = 2,
  SOLD = 3,
  CANCELLED = 4,
  RETURNED = 5,
  SENT_FOR_REISSUANCE = 6,
  HELD = 7,
  PERMANENTLY_CANCELLED = 8,
}

export enum SubscriptionStatus {
  ACTIVE = 1,
  CANCELLED = 2,
  HELD = 3,
}

export enum ProductType {
  SIM = 1,
  DEVICE = 2,
}

export enum BillStatus {
  NOT_PAID_YET = 1,
  PARTIALLY_PAID = 2,
  PAID = 3,
  FULLY_PAID_WITH_REFUND = 4,
  PAYMENT_CONFIRMED = 5,
  NOT_APPLICABLE = 6,
}

export enum SubsItemsStaus {
  OK = 1,
  CLOSE_FROM_NEXT_MONTH = 2,
  HELD_FROM_NEXT_MONTH = 3,
}

export enum ReissuanceStatus {
  OK = 1,
  REISSUED = 2,
}

export enum SIMAndDeviceStatus {
  NOT_APPLICABLE = 0,
  ACTIVE = 1,
  FROZEN = 2,
  CANCELLED_IN_ADVANCE = 3,
  CANCELLED = 4,
  RETURNED = 5,
  SENT_FOR_REISSUANCE = 6,
  RECEIVED_FROM_MC = 7,
  PERMANENTLY_CANCELLED = 8,
  REPLACED = 9,
}

export enum Gender {
  NOT_SET = 1,
  MALE = 2,
  FEMALE = 3,
}

export enum ContractStatus {
  NOT_SET = 0,
  ACTIVE = 1,
  SET_AS_TERMINABLE = 2,
  ENDED = 3,
  CLOSED = 4,
}

export enum SIMType {
  phone_sim = 1,
  wifi_sim = 2,
  device_only_sim = 3,
  mixed = 4,
  unknown = 5,
}

export enum InvoiceLogStatus {
  NOT_APPLICABLE = 0,
  NOT_STARTED = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  FAILED = 4,
}
