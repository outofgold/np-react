import { StatusDocument } from '@app/types/StatusDocument';
import { DocumentByPhone } from '@app/types/DocumentByPhone';

export interface CustomStatusDocument extends StatusDocument {
  CustomType: DocumentByPhone['DataType'];
  CustomName?: string;
}
