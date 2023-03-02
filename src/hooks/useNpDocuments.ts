import { useCallback, useEffect, useMemo, useState } from 'react';
import { DocumentByPhone } from '@app/types/DocumentByPhone';
import { StatusDocument } from '@app/types/StatusDocument';
import { getClosedDocumentsByPhone, getStatusDocuments, getUnclosedDocumentsByPhone } from '@app/api';
import { CustomStatusDocument } from '@app/types/CustomStatusDocument';
import { useLocalStorage } from '@app/hooks/useLocalStorage';
import { useFirstRender } from '@app/hooks/useFirstRender';

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
  const [unclosedDocs, setUnclosedDocs] = useLocalStorage<DocumentByPhone[] | null>('UnclosedDocuments', null);
  const [closedDocs, setClosedDocs] = useLocalStorage<DocumentByPhone[] | null>('ClosedDocuments', null);
  const [favDocs, setFavDocs] = useLocalStorage<DocumentByPhone[] | null>('FavDocuments', null);
  const [statusDocs, setStatusDocs] = useLocalStorage<StatusDocument[] | null>('StatusDocuments', null);

  const firstRender = useFirstRender();
  const [favDocsUpdateTrigger, setFavDocsUpdateTrigger] = useState<number>(Date.now());

  const fetchDocs = useCallback(async () => {
    const [freshUnclosedDocuments, freshClosedDocuments] = await Promise.all([
      getUnclosedDocumentsByPhone(),
      getClosedDocumentsByPhone(),
    ]);

    setUnclosedDocs(freshUnclosedDocuments);
    setClosedDocs(freshClosedDocuments);

    const docIDsToFetch = [
      ...freshUnclosedDocuments.map(({ Barcode }) => Barcode),
      ...freshClosedDocuments.map(({ Barcode }) => Barcode),
      ...(favDocs?.map(({ Barcode }) => Barcode) || []),
    ];

    const freshStatusDocuments = await getStatusDocuments([...new Set(docIDsToFetch)]);

    setStatusDocs(freshStatusDocuments);
  }, [favDocs]);

  const addFavDoc = useCallback(async (number: DocumentByPhone['Barcode']) => {
    // todo: verify via request?
    setFavDocs((prevState) => [
      ...(prevState || []),
      {
        Barcode: number,
        DataType: 'Fav',
      },
    ]);

    setFavDocsUpdateTrigger(Date.now());
  }, [setFavDocs, setFavDocsUpdateTrigger]);

  const removeFavDoc = useCallback(
    (number: DocumentByPhone['Barcode']) => {
      if (confirm(`Видалити ТТН ${number}?`)) {
        setFavDocs((prevState) => prevState?.filter(({ Barcode }) => Barcode !== number) || []);
      }
    },
    [setFavDocs]
  );

  useEffect(() => {
    if (!firstRender && statusDocs && favDocs) {
      const statusDocBarcodes = statusDocs.map((doc) => doc.Number);

      const needToUpdate = Boolean(favDocs.filter((doc) => !statusDocBarcodes.includes(doc.Barcode)).length);

      if (needToUpdate) {
        fetchDocs().then();
      }
    }
  }, [favDocsUpdateTrigger, statusDocs, favDocs]);

  const unclosedStatusDocs = useMemo(
    () => (unclosedDocs && statusDocs && transformResult(unclosedDocs, statusDocs)) || [],
    [unclosedDocs, statusDocs]
  );

  const closedStatusDocs = useMemo(
    () => (closedDocs && statusDocs && transformResult(closedDocs, statusDocs)) || [],
    [closedDocs, statusDocs]
  );

  const favStatusDocs = useMemo(
    () => (favDocs && statusDocs && transformResult(favDocs, statusDocs)) || [],
    [favDocs, statusDocs]
  );

  return {
    unclosedStatusDocs,
    closedStatusDocs,
    favStatusDocs,
    addFavDoc,
    removeFavDoc,
    fetchDocs,
  };
};

export { useNpDocuments };
