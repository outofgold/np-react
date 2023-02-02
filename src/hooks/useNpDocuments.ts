import { useCallback, useMemo } from 'react';
import { DocumentByPhone } from '@app/types/DocumentByPhone';
import { StatusDocument } from '@app/types/StatusDocument';
import { getClosedDocumentsByPhone, getStatusDocuments, getUnclosedDocumentsByPhone } from '@app/api';
import { CustomStatusDocument } from '@app/types/CustomStatusDocument';
import { useLocalStorage } from '@app/hooks/useLocalStorage';

const transformResult = (docsByPhone: DocumentByPhone[], statusDocs: StatusDocument[]): CustomStatusDocument[] => {
  const ids = docsByPhone.map(({ Barcode }) => Barcode);

  return statusDocs
    .filter((item) => ids.includes(item.Number))
    .map((item) => ({
      ...item,
      CustomType: docsByPhone.find(({ Barcode }) => item.Number === Barcode)!.DataType,
    }));
};

const useNpDocuments = () => {
  // todo api error handling
  const [unclosedDocuments, setUnclosedDocuments] = useLocalStorage<DocumentByPhone[] | null>(
    'UnclosedDocuments',
    null
  );

  const [closedDocuments, setClosedDocuments] = useLocalStorage<DocumentByPhone[] | null>('ClosedDocuments', null);
  const [statusDocuments, setStatusDocuments] = useLocalStorage<StatusDocument[] | null>('StatusDocuments', null);

  const fetchDocuments = useCallback(async () => {
    const [freshUnclosedDocuments, freshClosedDocuments] = await Promise.all([
      getUnclosedDocumentsByPhone(),
      getClosedDocumentsByPhone(),
    ]);

    setUnclosedDocuments(freshUnclosedDocuments);
    setClosedDocuments(freshClosedDocuments);

    const freshStatusDocuments = await getStatusDocuments([
      ...freshUnclosedDocuments.map(({ Barcode }) => Barcode),
      ...freshClosedDocuments.map(({ Barcode }) => Barcode),
    ]);

    setStatusDocuments(freshStatusDocuments);
  }, [setClosedDocuments, setStatusDocuments, setUnclosedDocuments]);

  const unclosedStatusDocuments = useMemo(
    () => (unclosedDocuments && statusDocuments && transformResult(unclosedDocuments, statusDocuments)) || [],
    [unclosedDocuments, statusDocuments]
  );

  const closedStatusDocuments = useMemo(
    () => (closedDocuments && statusDocuments && transformResult(closedDocuments, statusDocuments)) || [],
    [closedDocuments, statusDocuments]
  );

  return { unclosedStatusDocuments, closedStatusDocuments, fetchDocuments };
};

export { useNpDocuments };
