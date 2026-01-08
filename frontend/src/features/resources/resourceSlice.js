import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

const initialState = {
    hotels: [],
    flights: [],
    loading: false,
    error: null,
};

export const fetchHotels = createAsyncThunk('resources/fetchHotels', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/admin/hotels');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch hotels');
    }
});

export const fetchFlights = createAsyncThunk('resources/fetchFlights', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/admin/flights');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch flights');
    }
});

export const createHotel = createAsyncThunk('resources/createHotel', async (hotelData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/admin/hotels', hotelData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create hotel');
    }
});

export const createFlight = createAsyncThunk('resources/createFlight', async (flightData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/admin/flights', flightData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create flight');
    }
});

const resourceSlice = createSlice({
    name: 'resources',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Hotels
            .addCase(fetchHotels.pending, (state) => { state.loading = true; })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading = false;
                state.hotels = action.payload;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createHotel.fulfilled, (state, action) => {
                state.hotels.push(action.payload);
            })
            // Flights
            .addCase(fetchFlights.pending, (state) => { state.loading = true; })
            .addCase(fetchFlights.fulfilled, (state, action) => {
                state.loading = false;
                state.flights = action.payload;
            })
            .addCase(fetchFlights.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createFlight.fulfilled, (state, action) => {
                state.flights.push(action.payload);
            });
    },
});

export default resourceSlice.reducer;
