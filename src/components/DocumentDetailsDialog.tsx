import React, { FC } from 'react';
import { StatusDocument } from '../types/StatusDocument';
import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface Props {
  document: StatusDocument | null;
  handleClose: () => void;
}

const DocumentDetailsDialog: FC<Props> = ({ document, handleClose }) => {
  return (
    <Dialog
      fullWidth={true}
      maxWidth={'md'}
      open={Boolean(document)}
      onClose={handleClose}
    >
      <DialogTitle>Інформація про посилку</DialogTitle>

      <DialogContent>
       todo
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Закрити</Button>
      </DialogActions>
    </Dialog>
  );
};

export { DocumentDetailsDialog };
