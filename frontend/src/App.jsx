import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import DealList from './components/deals/DealList';
import DealDetail from './components/deals/DealDetail';
import CreateDeal from './components/deals/CreateDeal';
import Profile from './components/profile/Profile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/deals"
                element={
                  <PrivateRoute>
                    <DealList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/deals/:id"
                element={
                  <PrivateRoute>
                    <DealDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-deal"
                element={
                  <PrivateRoute>
                    <CreateDeal />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;