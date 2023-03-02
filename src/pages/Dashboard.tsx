import * as React from 'react';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CircularProgress, Divider } from '@mui/material';
import { useState } from 'react';
import { DocumentCard } from '@app/components/DocumentCard';
import { useNpDocuments } from '@app/hooks/useNpDocuments';
import { DocumentDetailsDialog } from '@app/components/DocumentDetailsDialog';
import { CustomStatusDocument } from '@app/types/CustomStatusDocument';
import { AddDocumentDialog } from '@app/components/AddDocumentDialog';
import { EditDocTitle } from '@app/components/EditDocTitle';

const Dashboard = () => {
  const {
    unclosedStatusDocs,
    closedStatusDocs,
    favStatusDocs,
    addFavDoc,
    removeFavDoc,
    fetchDocs,
    setDocTitle,
    isLoading,
  } = useNpDocuments();

  const [modalDocument, setModalDocument] = useState<CustomStatusDocument | null>(null);
  const [modalEditDocumentTitle, setModalEditDocumentTitle] = useState<CustomStatusDocument | null>(null);
  const [isDocAddModalOpen, setIsDocAddModalOpen] = useState<boolean>(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <MuiAppBar position="absolute">
        <Toolbar>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Мої посилки
          </Typography>

          {isLoading && <CircularProgress color={'error'} />}

          {!isLoading && (
            <Box>
              <IconButton color="inherit" title="Додати" onClick={() => setIsDocAddModalOpen(true)}>
                <AddIcon />
              </IconButton>

              <IconButton color="inherit" title="Оновити" onClick={() => fetchDocs()}>
                <RefreshIcon />
              </IconButton>
            </Box>
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
            {unclosedStatusDocs.map((item) => (
              <DocumentCard
                key={item.Number}
                isArchived={false}
                item={item}
                handleClick={() => setModalDocument(item)}
                handleChangeTitle={() => setModalEditDocumentTitle(item)}
              />
            ))}

            {Boolean(unclosedStatusDocs.length && favStatusDocs.length) && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}

            {favStatusDocs.map((item) => (
              <DocumentCard
                key={item.Number}
                isArchived={false}
                item={item}
                handleClick={() => setModalDocument(item)}
                handleChangeTitle={() => setModalEditDocumentTitle(item)}
                handleRemove={() => removeFavDoc(item.Number)}
              />
            ))}

            {Boolean(favStatusDocs.length && closedStatusDocs.length) && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}

            {Boolean(unclosedStatusDocs.length && closedStatusDocs.length && !favStatusDocs.length) && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}

            {closedStatusDocs.map((item) => (
              <DocumentCard
                key={item.Number}
                isArchived={true}
                item={item}
                handleClick={() => setModalDocument(item)}
                handleChangeTitle={() => setModalEditDocumentTitle(item)}
              />
            ))}
          </Grid>
        </Container>
      </Box>

      <DocumentDetailsDialog document={modalDocument} handleClose={() => setModalDocument(null)} />

      <AddDocumentDialog
        isOpen={isDocAddModalOpen}
        handleAdd={addFavDoc}
        handleClose={() => setIsDocAddModalOpen(false)}
      />

      <EditDocTitle
        document={modalEditDocumentTitle}
        handleEdit={setDocTitle}
        handleClose={() => setModalEditDocumentTitle(null)}
      />
    </Box>
  );
};

export { Dashboard };
