import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

const initialState = {
    bookings: [],
    loading: false,
    error: null,
    successMessage: null,
};

export const createBooking = createAsyncThunk('bookings/create', async (bookingData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/user/bookings', bookingData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Booking failed');
    }
});

export const fetchUserBookings = createAsyncThunk('bookings/fetchUser', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/user/bookings');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
});

export const fetchAllBookings = createAsyncThunk('bookings/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/admin/bookings');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch all bookings');
    }
});

export const updateBookingStatus = createAsyncThunk('bookings/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/admin/bookings/${id}/status`, null, { params: { status } });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
});

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        clearBookingMessage: (state) => {
            state.successMessage = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; state.successMessage = null; })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = "Booking Confirmed!";
                state.bookings.push(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.bookings = action.payload;
            })
            .addCase(fetchAllBookings.fulfilled, (state, action) => {
                state.bookings = action.payload;
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(b => b.id === action.payload.id);
                if (index !== -1) state.bookings[index] = action.payload;
            });
    },
});

export const { clearBookingMessage } = bookingSlice.actions;
export default bookingSlice.reducer;
