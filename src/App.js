import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PeopleList from './components/PeopleList';
import PersonDetail from './components/PersonDetail';
import VehicleDetail from './components/VehicleDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/people" />} />
        <Route path="/people" element={<PeopleList />} />
        <Route path="/people/:id" element={<PersonDetail />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
      </Routes>
    </Router>
  );
}

export default App;



