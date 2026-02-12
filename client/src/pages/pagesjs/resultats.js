import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../../components/componentjs/navbar";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  width: 250px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
`;

const Resultats = () => {
  const location = useLocation();
  const results = location.state?.results || [];

  return (
    <PageWrapper>
      <Navbar /> 
      <Container>
        {results.length > 0 ? (
          results.map((chaussure) => (
            <Card key={chaussure._id}>
              <h3>{chaussure.nom}</h3>
              <p>Couleur: {chaussure.couleur.join(", ")}</p>
              <p>Type: {chaussure.type}</p>
              <p>Prix: {chaussure.prix}€</p>
            </Card>
          ))
        ) : (
          <p>Aucun résultat trouvé.</p>
        )}
      </Container>
    </PageWrapper>
  );
};

export default Resultats;
