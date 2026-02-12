// Ce composant affiche un bouton mobile "View details" qui ouvre un panneau coulissant (Drawer) depuis le haut de l'écran.
// Il contient un résumé des informations de la commande, affiché via le composant Info.

// Importation des dépendances nécessaires
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import Info from './Info'; // Importation du composant Info (récapitulatif commande)

// Déclaration du composant InfoMobile
function InfoMobile({ commande }) {
  // État local pour savoir si le Drawer est ouvert ou fermé
  const [open, setOpen] = React.useState(false);

  // Fonction utilitaire pour ouvrir ou fermer le Drawer
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Contenu à afficher dans le Drawer
  const DrawerList = (
    <Box sx={{ width: 'auto', px: 3, pb: 3, pt: 8 }} role="presentation">
      {/* Bouton pour fermer le Drawer (coin supérieur droit) */}
      <IconButton
        onClick={toggleDrawer(false)}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>

      {/* Inclusion du composant Info avec le total à payer */}
      <Info commande={commande} />
    </Box>
  );

  // Structure de rendu du composant
  return (
    <div>
      {/* Bouton qui ouvre le Drawer */}
      <Button
        variant="text"
        endIcon={<ExpandMoreRoundedIcon />}
        onClick={toggleDrawer(true)}
      >
        View details
      </Button>

      {/* Drawer coulissant depuis le haut de la page */}
      <Drawer
        open={open}
        anchor="top"
        onClose={toggleDrawer(false)} // Ferme le Drawer quand on clique en dehors ou sur close
        PaperProps={{
          sx: {
            // Décalage depuis le haut si utilisé dans un layout avec barre d'en-tête
            top: 'var(--template-frame-height, 0px)',
            backgroundImage: 'none',
            backgroundColor: 'background.paper', // Couleur de fond du Drawer
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}

// Définition des types de props attendues
InfoMobile.propTypes = {
  commande: PropTypes.shape({
    produits: PropTypes.array.isRequired,
    total: PropTypes.string.isRequired,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
};

// Export du composant pour utilisation dans d'autres parties de l'application
export default InfoMobile;
