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
      providesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
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
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),
    testPayOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/test-pay-order/${orderId}`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
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
  useTestPayOrderMutation,
} = ordersApiSlice;

// add  payOrder endpoint
