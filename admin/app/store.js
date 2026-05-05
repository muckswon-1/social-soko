import {configureStore} from '@reduxjs/toolkit'
import { adminApiSlice } from './services/adminApiSlice'

export const store = configureStore({
    reducer: {
        [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(adminApiSlice.middleware),
})