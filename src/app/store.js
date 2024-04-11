import { configureStore } from '@reduxjs/toolkit'
import keyPairReducer from '../slice/KeyPairSlice'

export const store = configureStore({
  reducer: {
    keyPair: keyPairReducer
  }
})