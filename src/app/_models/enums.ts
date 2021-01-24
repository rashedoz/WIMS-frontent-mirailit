export enum StatusTypes {
    ACTIVE = 1,
    INACTIVE = 2,
    DELETED = 3,
    DRAFTED = 4,
    PUBLISHED = 5
  }

  export enum PaymentType {
    CASH = 1,
    FROM_BALANCE = 2,
    CARD_PAYMENT = 3,
    ONLINE_BANKING = 4
  }

  export enum StockStatus {
    AVAILABLE = 1,
    SUBSCRIBED = 2,
    RETURNED = 3,
    CANCELLED = 4,
    DAMAMGED = 5,
    SOLD = 6,
    HELD = 7,
    PERMANENTLY_CANCELLED = 8
  }

  export enum SubscriptionStatus {
    ACTIVE = 1,
    CANCELLED = 2,
    HELD = 3
  }

  export enum BillStatus {
    NOT_PAID_YET = 1,
    PARTIALLY_PAID = 2,
    PAID = 3,
    FULLY_PAID_WITH_REFUND = 4
  }

  export enum SubsItemsStaus {
    OK = 1,
    CLOSE_FROM_NEXT_MONTH  = 2,
    HELD_FROM_NEXT_MONTH = 3
  }

  export enum ReissuanceStatus{
    OK = 1,
    REISSUED = 2
  }