import axios, { AxiosResponse } from 'axios';
import format from 'date-fns/format';
import { DocumentByPhone } from '@app/types/DocumentByPhone';
import { StatusDocument } from '@app/types/StatusDocument';
import { ApiResponse } from '@app/types/ApiResponse';
import { DocumentEWMovement } from '@app/types/DocumentEWMovement';
import { deviceName } from '@app/api/constants';

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
  internetDocument: makeModel('InternetDocument'),
  loyaltyUser: makeModel('LoyaltyUser'),
  trackingDocument: makeModel('TrackingDocument'),
};

const instance = axios.create({
  // fixme for production
  baseURL: `${window.location.protocol}//${window.location.hostname}:9999/https://api.novaposhta.ua/v2.0/json/`,
  headers: {
    'content-type': 'application/json; charset=UTF-8',
    'devicename': deviceName,
    'npuid': localStorage.getItem('npuid'),
    'tokenoauth2': localStorage.getItem('tokenoauth2'),
  },
});

instance.interceptors.response.use(({ data: { data, translatedErrors } }: AxiosResponse<ApiResponse<unknown>>) => {
  const [firstError] = translatedErrors || [];

  if (firstError) {
    throw new Error(firstError);
  }

  return data as unknown as AxiosResponse;
});

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
      Language: 'UA',
    }),
    {
      headers: {
        ew: `[${documentIDs.map(Number).join(', ')}]`,
      },
    }
  );
};

const getDocumentsEWMovement = async (number: string | number): Promise<DocumentEWMovement[]> => {
  // todo many?
  return instance.post(
    'getDocumentsEWMovement',
    model.internetDocument('getDocumentsEWMovement', {
      Number: number,
      NewFormat: 1,
    })
  );
};

const getCities = async () => {}; // todo

const getWarehouses = async () => {}; // todo

export {
  getUnclosedDocumentsByPhone,
  getClosedDocumentsByPhone,
  getStatusDocuments,
  getDocumentsEWMovement,
  getCities,
  getWarehouses,
};
