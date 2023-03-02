import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { CustomStatusDocument } from '@app/types/CustomStatusDocument';
import { useHotkeys } from 'react-hotkeys-hook';

interface Props {
  document: CustomStatusDocument | null;
  handleEdit: (number: string, title: string | undefined) => void;
  handleClose: () => void;
}

const EditDocTitle: FC<Props> = ({ document, handleEdit, handleClose }) => {
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    setTitle(document?.CustomName || '');
  }, [document]);

  const handleSubmit = useCallback(() => {
    if (!document) {
      return;
    }

    handleEdit(document.Number, title || undefined);

    handleClose();
  }, [document, title, handleEdit, handleClose]);

  useHotkeys(
    'Enter',
    handleSubmit,
    { enabled: Boolean(document), enableOnFormTags: true, keyup: true, keydown: false },
    [document, handleSubmit]
  );

  return (
    <Dialog open={Boolean(document)} onClose={handleClose}>
      <DialogTitle>Змінити назву</DialogTitle>

      <DialogContent>
        <DialogContentText>Введіть назву посилки, що буде відображатись над ТТН</DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          label="Назва"
          type="text"
          fullWidth
          variant="standard"
          autoComplete="off"
          value={title}
          onChange={({ target: { value } }) => setTitle(value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Відмінити</Button>

        <Button onClick={handleSubmit}>Зберегти</Button>
      </DialogActions>
    </Dialog>
  );
};

export { EditDocTitle };
