import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionFoodNounId: number | undefined;
  onDisplayAuctionFoodNounId: number | undefined;
  lastAuctionNounId: number | undefined;
  onDisplayAuctionNounId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionFoodNounId: undefined,
  onDisplayAuctionFoodNounId: undefined,
  lastAuctionNounId: undefined,
  onDisplayAuctionNounId: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
    setLastAuctionFoodNounId: (state, action: PayloadAction<number>) => {
      state.lastAuctionFoodNounId = action.payload;
    },
    setOnDisplayAuctionFoodNounId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionFoodNounId = action.payload;
    },
    setPrevOnDisplayAuctionFoodNounId: state => {
      if (!state.onDisplayAuctionFoodNounId) return;
      if (state.onDisplayAuctionFoodNounId === 0) return;
      state.onDisplayAuctionFoodNounId = state.onDisplayAuctionFoodNounId - 1;
    },
    setNextOnDisplayAuctionFoodNounId: state => {
      if (state.onDisplayAuctionFoodNounId === undefined) return;
      if (state.lastAuctionFoodNounId === state.onDisplayAuctionFoodNounId) return;
      state.onDisplayAuctionFoodNounId = state.onDisplayAuctionFoodNounId + 1;
    },
    setLastAuctionNounId: (state, action: PayloadAction<number>) => {
      state.lastAuctionNounId = action.payload;
    },
    setOnDisplayAuctionNounId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionNounId = action.payload;
    },
    setPrevOnDisplayAuctionNounId: state => {
      if (!state.onDisplayAuctionNounId) return;
      if (state.onDisplayAuctionNounId === 0) return;
      state.onDisplayAuctionNounId = state.onDisplayAuctionNounId - 1;
    },
    setNextOnDisplayAuctionNounId: state => {
      if (state.onDisplayAuctionNounId === undefined) return;
      if (state.lastAuctionNounId === state.onDisplayAuctionNounId) return;
      state.onDisplayAuctionNounId = state.onDisplayAuctionNounId + 1;
    },
  },
});

export const {
  setLastAuctionFoodNounId,
  setOnDisplayAuctionFoodNounId,
  setPrevOnDisplayAuctionFoodNounId,
  setNextOnDisplayAuctionFoodNounId,
  setLastAuctionNounId,
  setOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
  setNextOnDisplayAuctionNounId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
