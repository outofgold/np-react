export interface ApiResponse<T> {
  success: boolean;
  data: Array<T>;
  errors: Array<string>;
  translatedErrors: Array<string>;
  warnings: Array<string>;
  info: Array<string | Record<string, string | number>>;
  messageCodes: Array<string>;
  errorCodes: Array<string>;
  warningCodes: Array<string>;
  infoCodes: Array<string>;
}
