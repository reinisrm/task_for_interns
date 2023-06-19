import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Grid, CircularProgress, Typography, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Link } from 'react-router-dom';


function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    axios.get(`https://swapi.dev/api/people/${id}`)
      .then(res => {
        setPerson(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [id]);

  

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{person.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
          </Grid>
          <Grid item xs={6}>
            {person.vehicles.map((vehicle, index) => (
              <Typography variant="body1">
                <Link to={`/vehicles/${extractIdFromUrl(vehicle)}`}>Vehicle {index + 1}</Link>
              </Typography>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default PersonDetail;

function extractIdFromUrl(url) {
  return url.split('/').filter(Boolean).pop();
}
