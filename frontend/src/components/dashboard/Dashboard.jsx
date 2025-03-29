import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import { getDeals } from '../../store/slices/dealSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { deals, loading } = useSelector((state) => state.deals);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getDeals());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Welcome, {user?.name}
            </Typography>
            <Button
              component={RouterLink}
              to="/create-deal"
              variant="contained"
              color="primary"
            >
              Create New Deal
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Deals
            </Typography>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : deals.length === 0 ? (
              <Typography>No deals found</Typography>
            ) : (
              <Grid container spacing={2}>
                {deals.map((deal) => (
                  <Grid item xs={12} sm={6} md={4} key={deal._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {deal.title}
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                          {deal.description}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6" color="primary">
                            {formatPrice(deal.currentPrice)}
                          </Typography>
                          <Chip
                            label={deal.status.replace('_', ' ')}
                            color={getStatusColor(deal.status)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {user?.role === 'buyer' ? 'Seller' : 'Buyer'}:{' '}
                          {deal.buyer._id === user?._id ? deal.seller.name : deal.buyer.name}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          component={RouterLink}
                          to={`/deals/${deal._id}`}
                          size="small"
                          color="primary"
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 