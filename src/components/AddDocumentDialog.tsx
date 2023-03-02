import React, { FC, useCallback, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useHotkeys } from 'react-hotkeys-hook';

interface Props {
  isOpen: boolean;
  handleAdd: (number: string) => void;
  handleClose: () => void;
}

const AddDocumentDialog: FC<Props> = ({ isOpen, handleAdd, handleClose }) => {
  const [barcode, setBarcode] = useState<string>('');

  const validateBarcode = useCallback(() => {
    const trimmed = barcode.replaceAll(' ', '');

    if (!/^[0-9]{14}$/.test(trimmed)) {
      return alert('Неправильний номер');
    }

    handleAdd(trimmed);
    handleClose();
  }, [barcode, handleAdd, handleClose]);

  useHotkeys('Enter', validateBarcode, { enabled: isOpen, enableOnFormTags: true, keyup: true, keydown: false }, [
    isOpen,
    validateBarcode,
  ]);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Додати посилку</DialogTitle>

      <DialogContent>
        <DialogContentText>Введіть трек-номер посилки, що складається з 14 цифр</DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          label="Трек-номер"
          type="text"
          fullWidth
          variant="standard"
          autoComplete="off"
          value={barcode}
          onChange={({ target: { value } }) => setBarcode(value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Відмінити</Button>

        <Button onClick={validateBarcode}>Додати</Button>
      </DialogActions>
    </Dialog>
  );
};

export { AddDocumentDialog };
