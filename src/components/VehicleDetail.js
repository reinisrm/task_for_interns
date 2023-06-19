import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {  CircularProgress, Typography, Table, TableBody, TableCell, TableRow, TableContainer, Paper, Box, IconButton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../VehicleDetail.css';

function VehicleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://swapi.dev/api/vehicles/${id}`)
      .then(res => {
        setVehicle({
          ...res.data,
          vehicle_number: Math.floor(Math.random() * 9000) + 1000,
          mileage: `${Math.floor(Math.random() * (700000 - 150000 + 1)) + 150000}km`,
          power: `${Math.floor(Math.random() * 50000)}hp`,
          number_of_seats: Math.floor(Math.random() * 99) + 2
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    navigate('/people');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <Box className="vehicle-detail-page">
      <IconButton onClick={handleBack} className="back-button">
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" className="vehicle-info-title">Vehicle Info</Typography>
      <TableContainer component={Paper} className="vehicle-detail-table">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="table-cell">Vehicle Number</TableCell>
              <TableCell className="table-cell">{vehicle.vehicle_number}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell">Mileage</TableCell>
              <TableCell className="table-cell">{vehicle.mileage}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell">Power</TableCell>
              <TableCell className="table-cell">{vehicle.power}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell">Number of Seats</TableCell>
              <TableCell className="table-cell">{vehicle.number_of_seats}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default VehicleDetail;