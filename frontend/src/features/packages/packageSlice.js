import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

const initialState = {
    packages: [],
    currentPackage: null, // includes details
    loading: false,
    error: null,
};

// Async Thunks
export const fetchPackages = createAsyncThunk('packages/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/user/packages');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch packages');
    }
});

export const fetchPackageById = createAsyncThunk('packages/fetchById', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/user/packages/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch package details');
    }
});

export const createPackage = createAsyncThunk('packages/create', async (pkgData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/admin/packages', pkgData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create package');
    }
});

export const deletePackage = createAsyncThunk('packages/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/admin/packages/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete package');
    }
});

export const addHotel = createAsyncThunk('packages/addHotel', async ({ id, hotel }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/admin/packages/${id}/hotels`, hotel);
        return { packageId: id, hotel: response.data };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add hotel');
    }
});

export const addFlight = createAsyncThunk('packages/addFlight', async ({ id, flight }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/admin/packages/${id}/flights`, flight);
        return { packageId: id, flight: response.data };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add flight');
    }
});

export const addItinerary = createAsyncThunk('packages/addItinerary', async ({ id, itinerary }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/admin/packages/${id}/itinerary`, itinerary);
        return { packageId: id, itinerary: response.data };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add itinerary');
    }
});

const packageSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {
        clearCurrentPackage: (state) => {
            state.currentPackage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPackages.pending, (state) => { state.loading = true; })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload;
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPackageById.pending, (state) => { state.loading = true; })
            .addCase(fetchPackageById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPackage = action.payload;
            })
            .addCase(fetchPackageById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createPackage.fulfilled, (state, action) => {
                state.packages.push(action.payload);
            })
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.packages = state.packages.filter(p => p.id !== action.payload);
            })
            .addCase(addHotel.fulfilled, (state, action) => {
                if (state.currentPackage && state.currentPackage.id === +action.payload.packageId) {
                    state.currentPackage.hotels.push(action.payload.hotel);
                }
            })
            .addCase(addFlight.fulfilled, (state, action) => {
                if (state.currentPackage && state.currentPackage.id === +action.payload.packageId) {
                    state.currentPackage.flights.push(action.payload.flight);
                }
            })
            .addCase(addItinerary.fulfilled, (state, action) => {
                if (state.currentPackage && state.currentPackage.id === +action.payload.packageId) {
                    state.currentPackage.itinerary.push(action.payload.itinerary);
                }
            });
    },
});

export const { clearCurrentPackage } = packageSlice.actions;
export default packageSlice.reducer;
