import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5 * 1000,
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5 * 1000,
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
    }),
    payOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/orders/${orderId}/pay`,
        method: "PUT",
        body: {},
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ orderId, order }) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "PUT",
        body: order,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} = ordersApiSlice;

// add  payOrder endpoint
