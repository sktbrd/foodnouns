import { BigNumber } from '@ethersproject/bignumber';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuctionCreateEvent,
  AuctionExtendedEvent,
  AuctionSettledEvent,
  BidEvent,
} from '../../utils/types';
import { Auction as IAuction } from '../../wrappers/nounsAuction';

export interface AuctionState {
  foodnouns: {
    activeAuction?: IAuction;
    bids: BidEvent[];
  },
  nouns: {
    activeAuction?: IAuction;
    bids: BidEvent[];
  }
}

const initialState: AuctionState = {
  foodnouns: {
    activeAuction: undefined,
    bids: [],
  },
  nouns: {
    activeAuction: undefined,
    bids: [],
  }
};

export const reduxSafeNewAuction = (auction: AuctionCreateEvent): IAuction => ({
  amount: BigNumber.from(0).toJSON(),
  bidder: '',
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.endTime).toJSON(),
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: false,
});

export const reduxSafeAuction = (auction: IAuction): IAuction => ({
  amount: BigNumber.from(auction.amount).toJSON(),
  bidder: auction.bidder,
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.endTime).toJSON(),
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: auction.settled,
});

export const reduxSafeBid = (bid: BidEvent): BidEvent => ({
  nounId: BigNumber.from(bid.nounId).toJSON(),
  sender: bid.sender,
  value: BigNumber.from(bid.value).toJSON(),
  extended: bid.extended,
  transactionHash: bid.transactionHash,
  timestamp: bid.timestamp,
});

const maxBid = (bids: BidEvent[]): BidEvent => {
  return bids.reduce((prev, current) => {
    return BigNumber.from(prev.value).gt(BigNumber.from(current.value)) ? prev : current;
  });
};

const auctionsEqual = (
  a: IAuction,
  b: AuctionSettledEvent | AuctionCreateEvent | BidEvent | AuctionExtendedEvent,
) => BigNumber.from(a.nounId).eq(BigNumber.from(b.nounId));

const containsBid = (bidEvents: BidEvent[], bidEvent: BidEvent) =>
  bidEvents.map(bid => bid.transactionHash).indexOf(bidEvent.transactionHash) >= 0;

/**
 * State of **current** auction (sourced via websocket)
 */
export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setActiveFoodNounAuction: (state, action: PayloadAction<AuctionCreateEvent>) => {
      state.foodnouns.activeAuction = reduxSafeNewAuction(action.payload);
      state.foodnouns.bids = [];
      console.log('processed auction create', action.payload);
    },
    setFullFoodNounAuction: (state, action: PayloadAction<IAuction>) => {
      console.log(`from set full auction: `, action.payload);
      state.foodnouns.activeAuction = reduxSafeAuction(action.payload);
    },
    appendFoodNounBid: (state, action: PayloadAction<BidEvent>) => {
      if (!(state.foodnouns.activeAuction && auctionsEqual(state.foodnouns.activeAuction, action.payload))) return;
      if (containsBid(state.foodnouns.bids, action.payload)) return;
      state.foodnouns.bids = [reduxSafeBid(action.payload), ...state.foodnouns.bids];
      const maxBid_ = maxBid(state.foodnouns.bids);
      state.foodnouns.activeAuction.amount = BigNumber.from(maxBid_.value).toJSON();
      state.foodnouns.activeAuction.bidder = maxBid_.sender;
      console.log('processed bid', action.payload);
    },
    setFoodNounAuctionSettled: (state, action: PayloadAction<AuctionSettledEvent>) => {
      if (!(state.foodnouns.activeAuction && auctionsEqual(state.foodnouns.activeAuction, action.payload))) return;
      state.foodnouns.activeAuction.settled = true;
      state.foodnouns.activeAuction.bidder = action.payload.winner;
      state.foodnouns.activeAuction.amount = BigNumber.from(action.payload.amount).toJSON();
      console.log('processed auction settled', action.payload);
    },
    setFoodNounAuctionExtended: (state, action: PayloadAction<AuctionExtendedEvent>) => {
      if (!(state.foodnouns.activeAuction && auctionsEqual(state.foodnouns.activeAuction, action.payload))) return;
      state.foodnouns.activeAuction.endTime = BigNumber.from(action.payload.endTime).toJSON();
      console.log('processed auction extended', action.payload);
    },

    // noun methods
    setActiveNounAuction: (state, action: PayloadAction<AuctionCreateEvent>) => {
      state.nouns.activeAuction = reduxSafeNewAuction(action.payload);
      state.nouns.bids = [];
      console.log('processed auction create', action.payload);
    },
    setFullNounAuction: (state, action: PayloadAction<IAuction>) => {
      console.log(`from set full auction: `, action.payload);
      state.nouns.activeAuction = reduxSafeAuction(action.payload);
    },
    appendNounBid: (state, action: PayloadAction<BidEvent>) => {
      if (!(state.nouns.activeAuction && auctionsEqual(state.nouns.activeAuction, action.payload))) return;
      if (containsBid(state.nouns.bids, action.payload)) return;
      state.nouns.bids = [reduxSafeBid(action.payload), ...state.nouns.bids];
      const maxBid_ = maxBid(state.nouns.bids);
      state.nouns.activeAuction.amount = BigNumber.from(maxBid_.value).toJSON();
      state.nouns.activeAuction.bidder = maxBid_.sender;
      console.log('processed bid', action.payload);
    },
    setNounAuctionSettled: (state, action: PayloadAction<AuctionSettledEvent>) => {
      if (!(state.nouns.activeAuction && auctionsEqual(state.nouns.activeAuction, action.payload))) return;
      state.nouns.activeAuction.settled = true;
      state.nouns.activeAuction.bidder = action.payload.winner;
      state.nouns.activeAuction.amount = BigNumber.from(action.payload.amount).toJSON();
      console.log('processed auction settled', action.payload);
    },
    setNounAuctionExtended: (state, action: PayloadAction<AuctionExtendedEvent>) => {
      if (!(state.nouns.activeAuction && auctionsEqual(state.nouns.activeAuction, action.payload))) return;
      state.nouns.activeAuction.endTime = BigNumber.from(action.payload.endTime).toJSON();
      console.log('processed auction extended', action.payload);
    },
  },
});

export const {
  setActiveFoodNounAuction,
  appendFoodNounBid,
  setFoodNounAuctionExtended,
  setFoodNounAuctionSettled,
  setFullFoodNounAuction,
  setActiveNounAuction,
  appendNounBid,
  setNounAuctionExtended,
  setNounAuctionSettled,
  setFullNounAuction,
} = auctionSlice.actions;

export default auctionSlice.reducer;
