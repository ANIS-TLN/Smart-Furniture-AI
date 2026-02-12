// Importation des dépendances React et MUI nécessaires
import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';

// Composant personnalisé pour le layout des champs du formulaire
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

// Composant principal : formulaire d'adresse
export default function AddressForm({ onChange, initialValues = {} }) {
  // Utilisation des données de commande comme valeurs initiales
  const [firstName, setFirstName] = React.useState(initialValues.firstname || '');
  const [lastName, setLastName] = React.useState(initialValues.lastname || '');
  const [address1, setAddress1] = React.useState(initialValues.address || '');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [zip, setZip] = React.useState('');
  const [country, setCountry] = React.useState('Algerie');
  const [saveAddress, setSaveAddress] = React.useState(false);

  // Fonction qui gère les changements dans tous les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Mise à jour de l’état correspondant au champ modifié
    if (name === 'firstName') setFirstName(value);
    if (name === 'lastName') setLastName(value);
    if (name === 'address1') setAddress1(value);
    if (name === 'city') setCity(value);
    if (name === 'state') setState(value);
    if (name === 'zip') setZip(value);
    if (name === 'country') setCountry(value);
    if (name === 'saveAddress') setSaveAddress(e.target.checked);

    // Envoi des données modifiées au parent si une fonction de rappel est fournie
    onChange({
      firstName,
      lastName,
      address1,
      city,
      state,
      zip,
      country,
      saveAddress
    });
  };

  return (
    // Grille responsive MUI avec des espacements
    <Grid container spacing={3}>

      {/* Champ prénom */}
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="first-name" required>
          Prénom
        </FormLabel>
        <OutlinedInput
          id="first-name"
          name="firstName"
          value={firstName}
          onChange={handleInputChange}
          placeholder="Jean"
          autoComplete="prénom"
          required
          size="small"
        />
      </FormGrid>

      {/* Champ nom de famille */}
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="last-name" required>
          Nom de famille
        </FormLabel>
        <OutlinedInput
          id="last-name"
          name="lastName"
          value={lastName}
          onChange={handleInputChange}
          placeholder="Dupont"
          autoComplete="nom de famille"
          required
          size="small"
        />
      </FormGrid>

      {/* Champ adresse ligne 1 */}
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="address1" required>
          Adresse ligne 1
        </FormLabel>
        <OutlinedInput
          id="address1"
          name="address1"
          value={address1}
          onChange={handleInputChange}
          placeholder="Nom de rue et numéro"
          autoComplete="adresse-ligne1"
          required
          size="small"
        />
      </FormGrid>

      {/* Champ ville */}
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="city" required>
          Ville
        </FormLabel>
        <OutlinedInput
          id="city"
          name="city"
          value={city}
          onChange={handleInputChange}
          placeholder="Paris"
          autoComplete="ville"
          required
          size="small"
        />
      </FormGrid>

      {/* Champ état / région */}
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="state" required>
          État / Région
        </FormLabel>
        <OutlinedInput
          id="state"
          name="state"
          value={state}
          onChange={handleInputChange}
          placeholder="Île-de-France"
          autoComplete="état"
          required
          size="small"
        />
      </FormGrid>

      {/* Champ code postal */}
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="zip" required>
          Code postal
        </FormLabel>
        <OutlinedInput
          id="zip"
          name="zip"
          value={zip}
          onChange={handleInputChange}
          placeholder="75000"
          autoComplete="code-postal"
          required
          size="small"
        />
      </FormGrid>

      {/* Champ pays */}
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="country" required>
          Pays
        </FormLabel>
        <OutlinedInput
          id="country"
          name="country"
          value={country}
          onChange={handleInputChange}
          placeholder="France"
          autoComplete="pays"
          required
          size="small"
        />
      </FormGrid>

      {/* Case à cocher pour enregistrer l'adresse */}
      <FormGrid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              name="saveAddress"
              checked={saveAddress}
              onChange={handleInputChange}
            />
          }
          label="Utiliser cette adresse pour les détails de paiement"
        />
      </FormGrid>

    </Grid>
  );
}
