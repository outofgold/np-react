import React, { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { uk } from 'date-fns/locale';
import { addMinutes, differenceInCalendarDays, format, formatRelative, parseISO } from 'date-fns';
import { MovementItem } from '../types/DocumentEWMovement';

interface Props {
  type: 'passed' | 'now' | 'future';
  item: MovementItem;
}

const icon = (type: Props['type']): JSX.Element => {
  switch (type) {
    case 'passed':
      return <CheckCircleIcon color={'success'} />;

    case 'now':
      return <LocalShippingIcon color={'warning'} />;

    default:
      return <CircleIcon color={'disabled'} />;
  }
};

const DocumentMovementItem: FC<Props> = ({ type, item }) => {
  const dateItem = addMinutes(parseISO(item.Date), new Date().getTimezoneOffset());

  const diffDays = differenceInCalendarDays(dateItem, new Date());

  const dateString =
    Math.abs(diffDays) <= 1
      ? formatRelative(dateItem, new Date(), { locale: uk })
      : format(dateItem, 'dd MMM y HH:mm', { locale: uk });

  return (
    <Stack direction="row" alignItems="center" gap={1} sx={{ my: 1 }}>
      {icon(type)}

      <Box>
        <Typography fontSize={13}>{item.EventDescription}</Typography>

        <Typography fontSize={13} color={'grey'}>
          {dateString}
        </Typography>
      </Box>
    </Stack>
  );
};

export { DocumentMovementItem };
