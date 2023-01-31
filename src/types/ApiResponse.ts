export interface ApiResponse<T> {
  success: boolean;
  data: Array<T>;
  errors: Array<unknown>;
  translatedErrors: Array<unknown>;
  warnings: Array<unknown>;
  info: Array<string>;
  messageCodes: Array<unknown>;
  errorCodes: Array<unknown>;
  warningCodes: Array<unknown>;
  infoCodes: Array<string>;
}
