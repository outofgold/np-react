import axios, { AxiosResponse } from 'axios';
import { baseUrl, deviceName } from './constants';
import { DocumentByPhone } from '../types/DocumentByPhone';
import { StatusDocument } from '../types/StatusDocument';
import format from 'date-fns/format';

const userPhone = localStorage.getItem('npuid')?.slice(-12);

const makeModel = (name: string) => {
  return (method: string, payload: Record<string, unknown>) => ({
    apiKey: '',
    system: 'MobileApp',
    Language: 'ua',
    modelName: name,
    calledMethod: method,
    methodProperties: payload,
  });
};

const model = {
  loyaltyUser: makeModel('LoyaltyUser'),
  trackingDocument: makeModel('TrackingDocument'),
};

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    'content-type': 'application/json; charset=UTF-8',
    'devicename': deviceName,
    'npuid': localStorage.getItem('npuid'),
    'tokenoauth2': localStorage.getItem('tokenoauth2'),
  },
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response.data.data
);

const getUnclosedDocumentsByPhone = async (): Promise<DocumentByPhone[]> => {
  return instance.post(
    'getUnclosedDocumentsByPhone',
    model.loyaltyUser('getUnclosedDocumentsByPhone', {
      Phone: userPhone,
    })
  );
};

const getClosedDocumentsByPhone = async (): Promise<DocumentByPhone[]> => {
  const now = new Date();

  return instance.post(
    'getClosedDocumentsByPhone',
    model.loyaltyUser('getClosedDocumentsByPhone', {
      Phone: userPhone,
      Month: format(now, 'M'),
      Year: format(now, 'yyyy'),
    })
  );
};

const getStatusDocuments = async (documentIDs: Array<string | number>): Promise<StatusDocument[]> => {
  if (!documentIDs.length) {
    return [];
  }

  return instance.post(
    'getStatusDocuments',
    model.trackingDocument('getStatusDocuments', {
      Documents: documentIDs.map((id) => ({
        DocumentNumber: String(id),
        Phone: userPhone,
      })),
      Language: 'UA'
    }),
    {
      headers: {
        'ew': `[${documentIDs.map(Number).join(', ')}]`,
      }
    }
  );
};

const getDocumentsEWMovement = async () => {}; // todo

const getCities = async () => {}; // todo

const getWarehouses = async () => {}; // todo

export {
  getUnclosedDocumentsByPhone,
  getClosedDocumentsByPhone,
  getStatusDocuments,
  getDocumentsEWMovement,
  getCities,
  getWarehouses
};
