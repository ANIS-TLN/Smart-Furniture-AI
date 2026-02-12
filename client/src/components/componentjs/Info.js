import * as React from 'react';
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  CircularProgress
} from '@mui/material';

function Info({ commande }) {
  // État pour suivre si les données ont été perdues
  const [dataLost, setDataLost] = React.useState(false);

  React.useEffect(() => {
    if (commande === undefined) {
      setDataLost(true);
      console.error('Les données de commande ont été perdues!');
    }
  }, [commande]);

  if (dataLost) {
    return (
      <Box sx={{ p: 2, border: '2px dashed red' }}>
        <Typography color="error" variant="h6">
          Erreur : Les données ont disparu après le chargement initial
        </Typography>
        <Typography>
          Veuillez rafraîchir la page ou retourner au panier
        </Typography>
      </Box>
    );
  }

  if (!commande) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Total
      </Typography>
      
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          fontSize: '1.5rem'
        }}
      >
        {commande.total} Dz
      </Typography>

      <List disablePadding>
        {commande.produits.map((item, index) => (
          <ListItem key={`prod-${index}`} sx={{ py: 1, px: 0 }}>
            <ListItemText
              primary={item.produit?.nom}
              secondary={item.produit?.description}
            />
            <Typography>
              {item.produit?.prix} x {item.quantite}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Info;