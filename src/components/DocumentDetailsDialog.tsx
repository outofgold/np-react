import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Stack, Typography } from '@mui/material';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { uk } from 'date-fns/locale';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScaleIcon from '@mui/icons-material/Scale';
import { StatusDocument } from '../types/StatusDocument';
import { DocumentEWMovement } from '../types/DocumentEWMovement';
import { getDocumentsEWMovement } from '../api';
import { DocumentMovementItem } from './DocumentMovementItem';

interface Props {
  document: StatusDocument | null;
  handleClose: () => void;
}

const DocumentDetailsDialog: FC<Props> = ({ document, handleClose }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [movementDetails, setMovementDetails] = useState<DocumentEWMovement | null>(null);

  useEffect(() => {
    if (!document) {
      setMovementDetails(null);

      return;
    }

    getDocumentsEWMovement(document.Number).then((result) => setMovementDetails(result[0]));
  }, [document]);

  // smooth modal closing
  useEffect(() => {
    setIsOpen(Boolean(document));
  }, [document]);

  // smooth modal closing
  const handleSmoothClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(handleClose, 200);
  }, [handleClose]);

  const dateReceived =
    document?.RecipientDateTime &&
    format(parse(document.RecipientDateTime, 'dd.MM.y H:m:ss', new Date()), 'dd MMM y HH:mm', { locale: uk });

  const dateActualDelivery =
    document?.ActualDeliveryDate &&
    format(parse(document.ActualDeliveryDate, 'y-MM-dd H:m:ss', new Date()), 'dd MMM y HH:mm', { locale: uk });

  const dateScheduledDelivery =
    !dateActualDelivery &&
    document?.ScheduledDeliveryDate &&
    format(parse(document.ScheduledDeliveryDate, 'dd-MM-y H:m:ss', new Date()), 'dd MMM y HH:mm', { locale: uk });

  const dateSent =
    document?.DateCreated &&
    format(parse(document.DateCreated, 'dd-MM-y H:m:ss', new Date()), 'dd MMM y HH:mm', { locale: uk });

  return (
    <Dialog fullWidth={true} maxWidth={'md'} open={isOpen} onClose={handleSmoothClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        Інформація про посилку
        <IconButton sx={{ ml: 'auto' }} onClick={handleSmoothClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {document && (
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Typography fontWeight={'bold'}>{document.Number}</Typography>

              <Stack direction="row" alignItems="center" gap={1} color={'grey'}>
                <Typography color={'white'}>{document.CargoDescriptionString}</Typography>

                <ScaleIcon fontSize={'small'} />

                <Typography>{document.DocumentWeight} кг</Typography>
              </Stack>

              <Box sx={{ mt: 1 }}>
                {dateSent && (
                  <Stack direction="row" alignItems="center" gap={1} color={'grey'}>
                    <ChevronRightIcon />

                    <Typography>Відправлено {dateSent}</Typography>
                  </Stack>
                )}

                {dateScheduledDelivery && (
                  <Stack direction="row" alignItems="center" gap={1} color={'orange'}>
                    <LocalShippingIcon />

                    <Typography>Плановий час {dateScheduledDelivery}</Typography>
                  </Stack>
                )}

                {dateActualDelivery && (
                  <Stack direction="row" alignItems="center" gap={1} color={dateReceived ? 'grey' : 'lightgreen'}>
                    {dateReceived ? <ChevronRightIcon /> : <LocalShippingIcon />}

                    <Typography>Прибуло {dateActualDelivery}</Typography>
                  </Stack>
                )}

                {dateReceived && (
                  <Stack direction="row" alignItems="center" gap={1} color={'lightgreen'}>
                    <LocalShippingIcon />

                    <Typography>Отримано {dateReceived}</Typography>
                  </Stack>
                )}
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography fontWeight={'bolder'}>Адреса доставки</Typography>

                <Typography fontSize={14} sx={{ ml: 2 }}>
                  {document.RecipientAddress}
                </Typography>

                <Typography fontWeight={'bolder'} sx={{ mt: 1 }}>
                  Відправник
                </Typography>

                <Typography fontSize={14} sx={{ ml: 2 }}>
                  {document.SenderFullNameEW}
                </Typography>

                <Typography fontSize={14} sx={{ ml: 2 }}>
                  {document.PhoneSender.replace(/^380/, '0')}
                </Typography>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography fontWeight={'bolder'}>Послуги з доставки {document.AmountToPay} грн</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              {!movementDetails && (
                <Grid container justifyContent={'center'} alignItems={'center'} height={'100%'}>
                  <CircularProgress color={'error'} />
                </Grid>
              )}

              {movementDetails && (
                <>
                  {movementDetails.movement.passed.map((item, index) => (
                    <DocumentMovementItem key={index} type={'passed'} item={item} />
                  ))}

                  {movementDetails.movement.now.map((item, index) => (
                    <DocumentMovementItem key={index} type={'now'} item={item} />
                  ))}

                  {movementDetails.movement.future.map((item, index) => (
                    <DocumentMovementItem key={index} type={'future'} item={item} />
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { DocumentDetailsDialog };
