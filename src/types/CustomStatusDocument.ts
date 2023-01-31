import { StatusDocument } from './StatusDocument';
import { DocumentByPhone } from './DocumentByPhone';

export interface CustomStatusDocument extends StatusDocument {
  CustomType: DocumentByPhone['DataType'];
  CustomName?: string;
}
