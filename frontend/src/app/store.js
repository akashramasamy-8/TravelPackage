import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import packageReducer from '../features/packages/packageSlice';
import bookingReducer from '../features/bookings/bookingSlice';

import resourceReducer from '../features/resources/resourceSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        packages: packageReducer,
        bookings: bookingReducer,
        resources: resourceReducer,
    },
});
