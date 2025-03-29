import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
} from '@mui/material';
import { createDeal } from '../../store/slices/dealSlice';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  initialPrice: Yup.number()
    .positive('Price must be positive')
    .required('Initial price is required'),
  sellerId: Yup.string().required('Seller is required'),
});

const CreateDeal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.deals);
  const { user } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      initialPrice: '',
      sellerId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const result = await dispatch(createDeal(values));
      if (!result.error) {
        navigate('/');
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create New Deal
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              margin="normal"
            />
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              margin="normal"
            />
            <TextField
              fullWidth
              id="initialPrice"
              name="initialPrice"
              label="Initial Price"
              type="number"
              value={formik.values.initialPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.initialPrice && Boolean(formik.errors.initialPrice)}
              helperText={formik.touched.initialPrice && formik.errors.initialPrice}
              margin="normal"
              InputProps={{
                startAdornment: '$',
              }}
            />
            <TextField
              fullWidth
              id="sellerId"
              name="sellerId"
              select
              label="Seller"
              value={formik.values.sellerId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.sellerId && Boolean(formik.errors.sellerId)}
              helperText={formik.touched.sellerId && formik.errors.sellerId}
              margin="normal"
            >
              <MenuItem value="seller1">Seller 1</MenuItem>
              <MenuItem value="seller2">Seller 2</MenuItem>
              {/* Add more sellers as needed */}
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? 'Creating...' : 'Create Deal'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateDeal; 