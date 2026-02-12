// Cette page présente un résumé de la commande, comprenant les détails du produit, de l'expédition et du paiement, ainsi que le total à payer et le nombre de produits sélectionnés.

import * as React from 'react';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';


// Informations de paiement — données simulées
const payments = [
  { name: 'Type de carte:', detail: 'Visa' },
  { name: 'Propriétaire  :', detail: 'Mr. John Smith' },
  { name: 'Numero de la carte:', detail: 'xxxx-xxxx-xxxx-1234' },
  { name: 'Date exp:', detail: '04/2024' },
];


export default function Review({ commande }) {
  const location = useLocation();

  if (!commande) return <div>Aucune commande trouvée</div>;
  const { produits = [], total = 0, firstname = '', lastname = '', address = '' } = commande || {};
  const totalItems = produits.reduce((acc, item) => acc + item.quantite, 0);
  // les informations de paiement sont également transmises comme partie de la commande ou ailleurs
  const { paymentInfo = {} } = commande;
  return (

    <Stack spacing={2}>

      {/* Liste des lignes de facturation : produits, livraison, total */}
      <List disablePadding>
        {/* Ligne produit : nombre de produits sélectionnés et leur prix total */}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Produits" secondary={`${totalItems} séléctionné`} />
          <Typography variant="body2">{total} Dz</Typography>

        </ListItem>

        {/* Ligne expédition : coût de la livraison */}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Livraison" secondary="Plus taxes" />
          <Typography variant="body2">1000 Dz</Typography>
        </ListItem>

        {/* Ligne total général : somme totale à payer */}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {(parseFloat(total) + 1000).toFixed(2)} Dz
          </Typography>
        </ListItem>
      </List>

      <Divider />

      {/* Section détails expédition et paiement */}
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        {/* Informations de livraison */}
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Détails de livraison
          </Typography>
          <Typography gutterBottom>{`${firstname} ${lastname}`}</Typography>
          <Typography gutterBottom sx={{ color: 'text.secondary' }}>
            {address}
          </Typography>
        </div>

        {/* Informations de paiement */}
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Détails de paiement
          </Typography>
          <Grid container>
            {paymentInfo.paymentType === 'creditCard' ? (
              <>
                <Stack direction="row" spacing={1} sx={{ width: '100%', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Type de carte :
                  </Typography>
                  <Typography variant="body2">{paymentInfo.paymentType}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ width: '100%', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Propriétaire :
                  </Typography>
                  <Typography variant="body2">{firstname}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ width: '100%', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Numéro de carte :
                  </Typography>
                  <Typography variant="body2">
                    {paymentInfo.cardNumber
                      ? `xxxx xxxx xxxx ${paymentInfo.cardNumber.slice(-4).replace(/\s/g, '')}`
                      : 'Non fourni'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ width: '100%', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Date d'expiration :
                  </Typography>
                  <Typography variant="body2">{paymentInfo.expirationDate}</Typography>
                </Stack>
              </>
            ) : (
              <Typography variant="body2">Virement bancaire : Nous attendons la confirmation du paiement.</Typography>
            )}
          </Grid>
        </div>
      </Stack>
    </Stack>
  );
}
