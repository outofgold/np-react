import React, { FC, ReactElement } from 'react';
import { Box, Card, CardActionArea, CardActions, CardContent, Divider, IconButton, SxProps } from '@mui/material';
import Grid from '@mui/material/Grid';
import ArchiveIcon from '@mui/icons-material/Archive';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import LanguageIcon from '@mui/icons-material/Language';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import StarsIcon from '@mui/icons-material/Stars';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { uk } from 'date-fns/locale';
import { CustomStatusDocument } from '@app/types/CustomStatusDocument';

interface Props {
  item: CustomStatusDocument;
  isArchived: boolean;
  handleClick: () => void;
  handleRemove?: () => void;
  handleChangeTitle?: () => void;
}

const headerGridItemStyle: SxProps = {
  paddingTop: '0 !important',
};

const DocumentCard: FC<Props> = ({ item, isArchived, handleClick, handleRemove, handleChangeTitle }): ReactElement => {
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardActionArea onClick={handleClick}>
          <CardContent>
            <Grid container alignItems="center" spacing={2} sx={{ height: 80 }}>
              <Grid item xs="auto" sx={headerGridItemStyle}>
                {item.CustomType === 'Sender' && (
                  <UnarchiveIcon color={isArchived ? 'disabled' : 'error'} fontSize="large" />
                )}

                {item.CustomType === 'Recipient' && (
                  <ArchiveIcon color={isArchived ? 'disabled' : 'error'} fontSize="large" />
                )}

                {item.CustomType === 'Fav' && <StarsIcon color={'error'} fontSize="large" />}
              </Grid>

              <Grid item sx={headerGridItemStyle}>
                {item.CustomName && (
                  <Typography fontSize={18} fontWeight="bold" component="div" title={item.CustomName}>
                    {item.CustomName}
                  </Typography>
                )}

                <Grid container alignItems="center">
                  <Grid item>
                    <Typography component="span" color={item.CustomName ? 'grey' : 'white'}>
                      №
                      {item.Number.length === 14
                        ? item.Number.replace(/^(.{2})(.{4})(.{4})(.{4})$/, '$1 $2 $3 $4')
                        : item.Number}
                    </Typography>
                  </Grid>

                  {item.InternationalDeliveryType === 'Import' && (
                    <Grid item>
                      <LanguageIcon fontSize="small" color="error" sx={{ ml: 0.5, mt: '5px' }} />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0 }}>
              <Grid item xs="auto">
                <Typography color="text.secondary">
                  {format(parse(item.DateCreated, 'dd-MM-y H:m:ss', new Date()), 'dd MMM y', { locale: uk })}
                </Typography>
              </Grid>

              <Grid item xs sx={{ px: 2 }}>
                <Divider />
              </Grid>

              <Grid item xs="auto" textAlign="right">
                <Typography color="text.secondary">
                  {Boolean(item.ActualDeliveryDate.length || item.ScheduledDeliveryDate.length)
                    ? format(
                        item.ActualDeliveryDate
                          ? parse(item.ActualDeliveryDate, 'y-MM-dd H:m:ss', new Date())
                          : parse(item.ScheduledDeliveryDate, 'dd-MM-y H:m:ss', new Date()),
                        'dd MMM y',
                        { locale: uk }
                      )
                    : '???'}
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0 }}>
              <Grid item xs="auto">
                <Typography>{item.CitySender}</Typography>
              </Grid>

              <Grid item xs="auto" textAlign="right">
                <Typography>{item.CityRecipient}</Typography>
              </Grid>
            </Grid>

            <Typography align="center" fontSize="small" fontWeight="bold" sx={{ mt: 1 }}>
              {item.Status}
            </Typography>
          </CardContent>
        </CardActionArea>

        <Divider sx={{ mt: 'auto' }} />

        <CardActions>
          <Typography sx={{ fontSize: 14, ml: 1 }} color="text.secondary" gutterBottom>
            {item.CargoDescriptionString}
          </Typography>

          <Box sx={{ ml: 'auto' }}>
            {handleChangeTitle && (
              <IconButton sx={{ p: 0, ml: 1 }} onClick={handleChangeTitle}>
                <EditIcon htmlColor="grey" />
              </IconButton>
            )}

            {handleRemove && (
              <IconButton sx={{ p: 0, ml: 1 }} onClick={handleRemove}>
                <CancelIcon htmlColor="grey" />
              </IconButton>
            )}
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
};

export { DocumentCard };
