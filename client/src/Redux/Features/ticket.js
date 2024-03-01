import { createSlice } from "@reduxjs/toolkit";
import {
  addNewTicket,
  getSingleTicket,
  getTicketFaq,
  getTicketNotificationCount,
  getTickets,
  updateMessageRead,
  addUploadProgress,
  closeTicket,
  reOpenTicket,
  handleNewMessage,
  newTicket,
  handleTicketReply,
} from "../Actions/ticket";
const initialState =  {
  tokens: {},
  loading: false,
  tickets: [],
  ticketNotificationCount: 0,
  ticketFaqs: [],
  progress: 0,
}
const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    resetState: (state) => {
      return initialState;
    },
    addNewMessage: (state, action) => {
      const newMessage = action.payload;
      state.tokens.replies.push(newMessage);
    },
    closeNew: (state) => {
      state?.tokens?.replies?.forEach((reply) => {
        delete reply.new;
      });
    },
    clearProgress: (state) => {
      state.progress = 0;
    },
    clearTicketStateData: (state) => {
      return {
        ...state,
        tokens: {},
        loading: false,
        tickets: [],
        ticketNotificationCount: 0,
        ticketFaqs: [],
        progress: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        const data = action.payload;
        if (data?.length) {
          state.loading = false;
          state.tickets = data;
        } else {
          state.loading = false;
        }
      })
      .addCase(getSingleTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleTicket.fulfilled, (state, action) => {
        const {ticketData} = action.payload;
        state.tokens = ticketData
        state.loading = false;
      })
      .addCase(addNewTicket.fulfilled,(state,action)=>{
        const { ticketData } = action.payload;
        state.tickets = [ticketData, ...state.tickets];
      })
      .addCase(updateMessageRead.fulfilled,(state,action)=>{
        const { update } = action.payload;
        state.tickets= 
          state.tickets.map((ticket) =>
            ticket._id === update._id ? update : ticket
          )
        
      })
      .addCase(getTicketNotificationCount.fulfilled,(state,action)=>{
        const { count } = action.payload;
        state.ticketNotificationCount= count
      })
      .addCase(getTicketFaq.fulfilled,(state,action)=>{
        const { ticketFaqs } = action.payload;
        state.ticketFaqs = ticketFaqs
      })
      .addCase(addUploadProgress.fulfilled,(state,action)=>{
        const data = action.payload;
        state.progress = data
      })
      .addCase(closeTicket.fulfilled,(state,action)=>{
        state.tokens={
          ...state.tokens,
          status:false
        }
      })
      .addCase(reOpenTicket.fulfilled,(state,action)=>{
        state.tokens={
          ...state.tokens,
          status:true
        }
      })
      .addCase(handleNewMessage.fulfilled,(state,action)=>{
        state.tokens.replies.push(action.payload)
      })
      .addCase(newTicket.fulfilled,(state,action)=>{
        state.tickets.unshift(action.payload)
      })
      .addCase(handleTicketReply.fulfilled,(state,action)=>{
        const data = action.payload
        state.tickets= 
        state.tickets.map((ticket) =>
          ticket._id === data ? {...ticket,count:ticket.count?ticket.count+1:1,adminUnread:true,userUnread:true} : ticket
        )
      })
  },
});
 

export default ticketSlice.reducer;

export const {
  resetState,
  setTokenInReduxState,
  addNewMessage,
  clearProgress,
  closeNew,
  clearTicketStateData,
} = ticketSlice.actions;
