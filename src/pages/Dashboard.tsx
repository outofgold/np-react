import * as React from 'react';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CircularProgress, Divider } from '@mui/material';
import { useCallback, useState } from 'react';
import { DocumentCard } from '@app/components/DocumentCard';
import { useNpDocuments } from '@app/hooks/useNpDocuments';
import { DocumentDetailsDialog } from '@app/components/DocumentDetailsDialog';
import { CustomStatusDocument } from '@app/types/CustomStatusDocument';

const Dashboard = () => {
  const { unclosedStatusDocuments, closedStatusDocuments, fetchDocuments } = useNpDocuments();
  const [modalDocument, setModalDocument] = useState<CustomStatusDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshAll = useCallback(() => {
    setLoading(true);
    fetchDocuments().then(() => setLoading(false));
  }, [fetchDocuments]);

  return (
    <Box sx={{ display: 'flex' }}>
      <MuiAppBar position="absolute">
        <Toolbar>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Мої посилки
          </Typography>

          {loading && <CircularProgress color={'error'} />}

          {!loading && (
            <IconButton color="inherit" title="Оновити" onClick={() => loading || refreshAll()}>
              <RefreshIcon />
            </IconButton>
          )}
        </Toolbar>
      </MuiAppBar>

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {unclosedStatusDocuments.map((item) => (
              <DocumentCard
                key={item.Number}
                isArchived={false}
                item={item}
                handleClick={() => setModalDocument(item)}
              />
            ))}

            {Boolean(unclosedStatusDocuments.length && closedStatusDocuments.length) && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}

            {closedStatusDocuments.map((item) => (
              <DocumentCard
                key={item.Number}
                isArchived={true}
                item={item}
                handleClick={() => setModalDocument(item)}
              />
            ))}
          </Grid>
        </Container>
      </Box>

      <DocumentDetailsDialog document={modalDocument} handleClose={() => setModalDocument(null)} />
    </Box>
  );
};

export { Dashboard };
