export interface DocumentEWMovement {
  number: string;
  createdAt: string;
  status: DocumentStatus;
  movement: DocumentMovement;
}

interface DocumentStatus {
  code: string;
  description: string;
  scheduledAt: string;
  settlementId: string;
  cityId: string;
  addressDescription: string;
}

interface DocumentMovement {
  passed: Array<MovementItem>;
  now: Array<MovementItem>;
  future: Array<MovementItem>;
}

export interface MovementItem {
  Barcode: string;
  Date: string;
  Event: 'Arrival' | 'CreateID' | 'CreateIDInternational' | 'Departure' | 'InCityRecipient' | 'MovingPostomat' | 'Received';
  EventDescription: string;
  Settlement: string;
  SettlementDescription: string;
  Warehouse: string;
  WarehouseDescription: string;
  IsFirst?: number;
}
