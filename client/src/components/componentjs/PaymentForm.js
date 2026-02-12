import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

// Style personnalisé pour la carte de sélection de méthode de paiement
const Card = styled(MuiCard)(({ theme }) => ({
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  width: '100%',
  '&:hover': {
    background:
      'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)',
    borderColor: 'primary.light',
    boxShadow: '0px 2px 8px hsla(0, 0%, 0%, 0.1)',
    ...theme.applyStyles('dark', {
      background:
        'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
      borderColor: 'primary.dark',
      boxShadow: '0px 1px 8px hsla(210, 100%, 25%, 0.5) ',
    }),
  },
  [theme.breakpoints.up('md')]: {
    flexGrow: 1,
    maxWidth: `calc(50% - ${theme.spacing(1)})`,
  },
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        borderColor: (theme.vars || theme).palette.primary.light,
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

// Conteneur pour les champs de paiement par carte
const PaymentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  height: 375,
  padding: theme.spacing(3),
  borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
  border: '1px solid ',
  borderColor: (theme.vars || theme).palette.divider,
  background:
    'linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)',
  boxShadow: '0px 4px 8px hsla(210, 0%, 0%, 0.05)',
  [theme.breakpoints.up('xs')]: {
    height: 300,
  },
  [theme.breakpoints.up('sm')]: {
    height: 350,
  },
  ...theme.applyStyles('dark', {
    background:
      'linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)',
    boxShadow: '0px 4px 8px hsl(220, 35%, 0%)',
  }),
}));

// Grille pour les champs individuels du formulaire
const FormGrid = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

// Composant principal du formulaire de paiement
export default function PaymentForm({ onChange }) {
    // État local pour la méthode de paiement
    const [paymentType, setPaymentType] = React.useState('creditCard');
    const [cardNumber, setCardNumber] = React.useState('');
    const [cvv, setCvv] = React.useState('');
    const [expirationDate, setExpirationDate] = React.useState('');
    const [cardName, setCardName] = React.useState('');
  
      // Fonction pour envoyer les données de paiement
  const sendPaymentData = () => {
    if (onChange) {
      onChange({
        paymentType,
        cardNumber,
        cvv,
        expirationDate,
        cardName
      });
    }
  };

    // Gestion du changement de type de paiement
    const handlePaymentTypeChange = (event) => {
      const type = event.target.value;
      setPaymentType(type);
      if (onChange) {
        onChange({
          paymentType: type,
          cardNumber,
          cvv,
          expirationDate,
          cardName
        });
      }
    };
  
    // Ajoutez une fonction pour envoyer toutes les infos de paiement
    const handlePaymentDetailsChange = () => {
      onChange({
        paymentType,
        cardNumber,
        cvv,
        expirationDate,
      });
    };
  
    // Formatage du numéro de carte bancaire
    const handleCardNumberChange = (event) => {
      let value = event.target.value.replace(/\D/g, ''); // Supprime tout sauf les chiffres
      // Limite à 16 chiffres
      if (value.length > 16) {
        value = value.slice(0, 16);
      }
      // Format : 1234 5678 9012 3456
      const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
      setCardNumber(formattedValue);
      if (onChange) {
        onChange({
          paymentType,
          cardNumber: formattedValue,
          cvv,
          expirationDate,
          cardName
        });
      }
    };
  
  
    // Limite le CVV à 3 chiffres
    const handleCvvChange = (event) => {
      let value = event.target.value.replace(/\D/g, '');
      // Limite à 3 chiffres
      if (value.length > 3) {
        value = value.slice(0, 3);
      }
      setCvv(value);
      if (onChange) {
        onChange({
          paymentType,
          cardNumber,
          cvv: value,
          expirationDate,
          cardName
        });
      }
    };
  
    const handleCardNameChange = (event) => {
      const value = event.target.value;
      setCardName(value);
      if (onChange) {
        onChange({
          paymentType,
          cardNumber,
          cvv,
          expirationDate,
          cardName: value
        });
      }
    };
  
    // Formatage de la date d’expiration en MM/YY
    const handleExpirationDateChange = (event) => {
      let value = event.target.value;
      // Supprimer tout sauf les chiffres
      value = value.replace(/\D/g, '');
      // Limiter à 4 chiffres (MMYY)
      if (value.length > 4) {
        value = value.slice(0, 4);
      }
      // Ajouter le slash uniquement si on a plus de 2 chiffres
      if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
      setExpirationDate(value);
      if (onChange) {
        onChange({
          paymentType,
          cardNumber,
          cvv,
          expirationDate: value,
          cardName
        });
      }
    };

    // Envoi des données initiales au montage
    React.useEffect(() => {
      sendPaymentData();
    }, []);



  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      {/* Choix du type de paiement */}
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="Payment options"
          name="paymentType"
          value={paymentType}
          onChange={handlePaymentTypeChange}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          {/* Option carte de crédit */}
          <Card selected={paymentType === 'creditCard'}>
            <CardActionArea
              onClick={() => setPaymentType('creditCard')}
              sx={{
                '.MuiCardActionArea-focusHighlight': { backgroundColor: 'transparent' },
                '&:focus-visible': { backgroundColor: 'action.hover' },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCardRoundedIcon fontSize="small" />
                <Typography sx={{ fontWeight: 'medium' }}>Carte</Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          {/* Option virement bancaire */}
          <Card selected={paymentType === 'bankTransfer'}>
            <CardActionArea
              onClick={() => setPaymentType('bankTransfer')}
              sx={{
                '.MuiCardActionArea-focusHighlight': { backgroundColor: 'transparent' },
                '&:focus-visible': { backgroundColor: 'action.hover' },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceRoundedIcon fontSize="small" />
                <Typography sx={{ fontWeight: 'medium' }}>Virement bancaire</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </RadioGroup>
      </FormControl>

      {/* Si carte de crédit sélectionnée */}
      {paymentType === 'creditCard' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <PaymentContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">Carte bancaire</Typography>
              <CreditCardRoundedIcon sx={{ color: 'text.secondary' }} />
            </Box>
            <SimCardRoundedIcon
              sx={{ fontSize: { xs: 48, sm: 56 }, transform: 'rotate(90deg)', color: 'text.secondary' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              {/* Numéro de carte */}
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="card-number" required>Numéro de carte</FormLabel>
                <OutlinedInput
                  id="card-number"
                  autoComplete="card-number"
                  placeholder="0000 0000 0000 0000"
                  required
                  size="small"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
              </FormGrid>
              {/* CVV */}
              <FormGrid sx={{ maxWidth: '20%' }}>
                <FormLabel htmlFor="cvv" required>CVV</FormLabel>
                <OutlinedInput
                  id="cvv"
                  autoComplete="CVV"
                  placeholder="123"
                  required
                  size="small"
                  value={cvv}
                  onChange={handleCvvChange}
                />
              </FormGrid>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Nom sur la carte */}
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="card-name" required>Nom sur la carte</FormLabel>
                <OutlinedInput
                  id="card-name"
                  autoComplete="card-name"
                  placeholder="John Smith"
                  required
                  size="small"
                  value={cardName}
                  onChange={handleCardNameChange}
                />
              </FormGrid>
              {/* Date d’expiration */}
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="card-expiration" required>Date d'expiration</FormLabel>
                <OutlinedInput
                  id="card-expiration"
                  autoComplete="card-expiration"
                  placeholder="MM/YY"
                  required
                  size="small"
                  value={expirationDate}
                  onChange={handleExpirationDateChange}
                />
              </FormGrid>
            </Box>
          </PaymentContainer>
          {/* Option pour sauvegarder la carte */}
          <FormControlLabel
            control={<Checkbox name="saveCard" />}
            label="Rappel de la carte"
          />
        </Box>
      )}

      {/* Si virement bancaire sélectionné */}
      {paymentType === 'bankTransfer' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="warning" icon={<WarningRoundedIcon />}>
            Votre commande sera traitée une fois que nous aurons reçu les fonds.
          </Alert>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            Virement bancaire
          </Typography>
          <Typography variant="body1" gutterBottom>
            Veuillez transférer le paiement sur le compte bancaire indiqué ci-dessous.
          </Typography>
          {/* Détails bancaires fictifs */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Banque :</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>Mastercredit</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Numéro de compte :</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>123456789</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Numéro de routage :</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>987654321</Typography>
          </Box>
        </Box>
      )}
    </Stack>
  );
}
