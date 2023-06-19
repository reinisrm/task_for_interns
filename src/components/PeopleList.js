import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, TextField, Avatar, Grid, Container, CircularProgress, Dialog} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import '../App.css';


const WhiteTextTypography = styled(Typography)({
  color: "#FFFFFF",
});

const StyledButton = styled(Button)({
  color: "#FFFFFF",
  borderColor: "#FFFFFF",
});

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
});

function PeopleList() {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState(2);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPersonVehicles, setSelectedPersonVehicles] = useState(null);

  useEffect(() => {
    const fetchPeople = async (page = 1, people = []) => {
      try {
        const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
        const newPeople = people.concat(response.data.results);

        if (response.data.next) {
          fetchPeople(page + 1, newPeople);
        } else {
          setPeople(newPeople);
          setLoading(false);
        }
      } catch {
        setError('Error while fetching people');
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  function generateRandomPhoneNumber() {
    let num = Math.floor(Math.random() * 8999) + 1000;
    return `202-555-${num}`;
  }
  
  function generateEmail(name) {
    let emailName = name.toLowerCase().split(' ').join('');
    return `${emailName}@email.com`;
  }

  const handlePersonClick = async (index) => {
    let person = { ...people[index] };
    person.phoneNr = generateRandomPhoneNumber();
    person.email = generateEmail(person.name);
    setSelectedPerson(person);
    
    const vehicles = await axios.get(`https://swapi.dev/api/vehicles/`);
    
    // Choose two random vehicles
    let randomVehicles = [];
    for(let i=0; i<2; i++) {
      let randIndex = Math.floor(Math.random() * vehicles.data.results.length);
      randomVehicles.push(vehicles.data.results[randIndex]);
      vehicles.data.results.splice(randIndex, 1);  // Remove chosen vehicle from array to avoid duplicate selections
    }
    setSelectedPersonVehicles(randomVehicles);
  
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  const displayedPeople = search 
    ? people.filter(person => person.name.toLowerCase().includes(search.toLowerCase())) 
    : people.slice(0, rows * 8);



  return (
    <Container maxWidth="xl" style={{ marginTop: '70px' }}>
      <WhiteTextTypography variant="h4" align="center" gutterBottom>People</WhiteTextTypography>
      <StyledTextField  
        fullWidth
        style={{ width: '15%' }}  
        InputProps={{
          style: {
            color: 'white'
          }
        }}
        InputLabelProps={{
          style: {
            color: 'white'
          }
        }}
        label="Search"
        variant="outlined"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Grid container spacing={4} style={{ marginTop: '40px', alignItems: 'start', justifyContent: 'center' }}>
        {displayedPeople.map((person, index) => (
          <Grid item xs={6} sm={3} md={2} lg={1.5} key={person.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar style={{ background: 'black', border: '1px solid white' }}>{person.name[0]}</Avatar>
            <WhiteTextTypography variant="h6" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => handlePersonClick(index)}>
              {person.name}
            </WhiteTextTypography>
          </div>
        </Grid>
        ))}
      </Grid>
      {!search && people.length > rows * 8 && (
        <Grid container justifyContent="center" style={{ marginTop: '40px' }}>
          <StyledButton variant="outlined" onClick={() => setRows(rows + 1)}>
            ...
          </StyledButton>
        </Grid>
      )}
      <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          PaperProps={{
              style: {
                  backgroundColor: "#212121",
                  color: "white",
                  width: '50%', 
                  height: '40%',
                  border: '2px solid white'
              },
          }}
      >
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
              <button className="close-button" onClick={handleDialogClose} style={{ position: 'absolute', top: 10, right: 10 }}>X</button>

              <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }}>
                      <Avatar style={{ backgroundColor: 'black', color: 'white', marginBottom: '10px' }}>{selectedPerson?.name[0]}</Avatar>
                      <Typography variant="h5">{selectedPerson?.name}</Typography>
                      <Typography>{`Phone: ${selectedPerson?.phoneNr}`}</Typography>
                      <Typography>{`Email: ${selectedPerson?.email}`}</Typography>
                  </div>
                  <div style={{ borderLeft: "1px solid white", height: "100%" }}></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }}>
                      <Typography variant="h5">Vehicles</Typography>
                      {selectedPersonVehicles?.map((vehicle, index) => (
                          <Button
                              key={vehicle.name}
                              onClick={() => navigate(`/vehicles/${vehicle.url.match(/\/(\d+)\/$/)[1]}`)}
                          >
                              {vehicle.name}
                          </Button>
                      ))}
                  </div>
              </div>
          </div>
      </Dialog>
    </Container>
  );
}

export default PeopleList;
