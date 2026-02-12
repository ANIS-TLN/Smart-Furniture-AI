import * as React from 'react';
import {
  Box, Button, Card, CardContent, CssBaseline,
  Grid, Stack, Step, StepLabel, Stepper, Typography
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddressForm from './AddressForm'; // Formulaire d’adresse
import Info from './Info'; // Résumé sur grand écran
import InfoMobile from './InfoMobile'; // Résumé sur petit écran
import PaymentForm from './PaymentForm'; // Formulaire de paiement
import Review from './Review'; // Revue de la commande
import SitemarkIcon from './SitemarkIcon'; // Logo ou marque du site
import AppTheme from '../theme/AppTheme'; // Thème personnalisé
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown'; // Choix du mode clair/sombre
import { useLocation } from 'react-router-dom';
import { confirmCommande } from '../../api'; // Importez la nouvelle fonction
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useNavigate } from 'react-router-dom';
// Étapes du formulaire
const steps = ['Adresse de livraison', 'Détails de paiement', 'Vérifiez votre commande'];

function getStepContent(step, commandeData, onChange, handlePaymentChange, paymentInfo) {
  switch (step) {
    case 0:
      return <AddressForm initialValues={commandeData} onChange={onChange} />;
    case 1:
      return <PaymentForm onChange={handlePaymentChange} />;
    case 2:
      return <Review commande={commandeData} paymentInfo={paymentInfo} />;
    default:
      throw new Error('Étape inconnue');
  }
}

export default function Checkout(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [commandeData, setCommandeData] = React.useState(() => {
    return location.state?.commande || {
      _id: null,
      produits: [],
      total: "0.00",
      address: "",
      firstname: "",
      lastname: ""
    };
  });
  const [paymentInfo, setPaymentInfo] = React.useState({}); // Etat pour les informations de paiement

  const handleChange = (updatedValues) => {
    setCommandeData((prevData) => ({
      ...prevData,
      ...updatedValues,
    }));
  };

  // Mise à jour de handleChange pour gérer les informations de paiement
  const handlePaymentChange = (paymentData) => {
    setPaymentInfo(paymentData);
    setCommandeData(prev => ({
      ...prev,
      paymentInfo: paymentData
    }));
  };
  if (!commandeData) return <p>Aucune commande reçue.</p>;

  // Passer à l'étape suivante
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  // Revenir à l'étape précédente
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  /// confirmer la commande 
  const handleCommander = async () => {
    try {
      const commandeId = commandeData._id || localStorage.getItem('currentCommandeId');

      if (!commandeId) {
        throw new Error("ID de commande manquant");
      }

      const result = await confirmCommande(commandeId);
    } catch (error) {
      console.error("Erreur:", error);
      alert(`Échec: ${error.message}`);
    }
  };

  // 2. Vérification avant rendu
  if (!location.state?.commande) {
    console.warn('Aucune donnée de commande dans location.state');
    // Redirection ou gestion alternative
  }
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }}>
        <ColorModeIconDropdown />
      </Box>
      <Grid container sx={{
        height: {
          xs: '100%',
          sm: 'calc(100dvh - var(--template-frame-height, 0px))',
        },
        mt: {
          xs: 4,
          sm: 0,
        },
      }}>

        <Grid
          size={{ xs: 12, sm: 5, lg: 4 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRight: { sm: 'none', md: '1px solid' },
            borderColor: { sm: 'none', md: 'divider' },
            alignItems: 'start',
            pt: 16,
            px: 10,
            gap: 4,
          }}
        >
          <SitemarkIcon />



          <Box sx={{ p: 2 }}>
            {commandeData ? (
              <Info commande={commandeData} />
            ) : (
              <Typography>Préparation de votre commande...</Typography>
            )}
          </Box>
        </Grid>

        <Grid
          size={{ sm: 12, md: 7, lg: 8 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'start',
            pt: { xs: 0, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: { sm: 'space-between', md: 'flex-end' },
            width: '100%',
            maxWidth: { sm: '100%', md: 600 },
          }}>
            <Stepper
              id="desktop-stepper"
              activeStep={activeStep}
              sx={{ width: '100%', height: 40 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Card sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Produits sélectionnés
                </Typography>
                <Typography variant="body1">
                  {activeStep >= 2 ? `${commandeData.total} Dz` : `${commandeData.total} Dz`}
                </Typography>
              </div>
              <InfoMobile totalPrice={`${commandeData.total} Dz`} />
            </CardContent>
          </Card>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: { sm: '100%', md: 600 },
            maxHeight: '720px',
            gap: { xs: 5, md: 'none' },
          }}>
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: 'flex', md: 'none' } }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length ? (
              <Stack spacing={2}>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Merci pour votre commande !</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Votre numéro de commande est <strong>#140396</strong>.
                  Un e-mail de confirmation vous a été envoyé.
                </Typography>

                <Button variant="contained" onClick={() => navigate("/acheter")}>
                  Accéder à mes commandes
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep, commandeData, handleChange, handlePaymentChange, paymentInfo)}
                <Box
                  sx={[
                    {
                      display: 'flex',
                      flexDirection: { xs: 'column-reverse', sm: 'row' },
                      alignItems: 'end',
                      gap: 1,
                      pb: { xs: 12, sm: 0 },
                      mt: { xs: 2, sm: 0 },
                      mb: '60px',
                    },
                    activeStep !== 0
                      ? { justifyContent: 'space-between' }
                      : { justifyContent: 'flex-end' },
                  ]}
                >
                  {activeStep !== 0 && (
                    <>
                      <Button
                        startIcon={<ChevronLeftRoundedIcon />}
                        onClick={handleBack}
                        variant="text"
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                      >
                        Précédent
                      </Button>
                      <Button
                        startIcon={<ChevronLeftRoundedIcon />}
                        onClick={handleBack}
                        variant="outlined"
                        fullWidth
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                      >
                        Précédent
                      </Button>
                    </>
                  )}

                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={async () => {
                      if (activeStep === steps.length - 1) {
                        // Dernière étape : exécute les deux fonctions
                        await handleCommander(); // Attendre la confirmation
                        handleNext(); // Passer à l'étape suivante (si nécessaire)
                      } else {
                        // Étapes normales : juste handleNext
                        handleNext();
                      }
                    }}
                    sx={{
                      width: { xs: '100%', sm: 'fit-content' }
                    }}
                  >
                    {activeStep === steps.length - 1 ? (
                      <>
                        Commander <ShoppingCartCheckoutIcon sx={{ ml: 1 }} />
                      </>
                    ) : (
                      'Suivant'
                    )}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
    </AppTheme>
  );
}
