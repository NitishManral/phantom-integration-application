// KeyPairSlice.js
import { createSlice } from '@reduxjs/toolkit'

export const keyPairSlice = createSlice({
  name: 'keyPair',
  initialState: {
    publicKey: '',
    privateKey: '',
    solanaKey: ''
  },
  reducers: {
    setPublicKey: (state, action) => {
      state.publicKey = action.payload;
    },
    setPrivateKey: (state, action) => {
      state.privateKey = action.payload;
    },
    setSolanaKey: (state, action) => {
      state.solanaKey = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setPublicKey, setPrivateKey } = keyPairSlice.actions

export default keyPairSlice.reducer