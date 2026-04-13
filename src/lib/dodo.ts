import DodoPayments from "dodopayments";

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: "test_mode", // Change to "live_mode" for production
});
