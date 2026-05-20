import api from "./axios.js";

export const tradeApi = {
  getTrades: (params) =>
    api
      .get("/trades", {
        params,
      })
      .then((r) => r.data),

  getTradeById: (id) => api.get(`/trades/${id}`).then((r) => r.data),

  updateTrade: (id, payload) =>
    api.put(`/trades/${id}`, payload).then((r) => r.data),

  createTrade: (payload) => api.post("/trades", payload).then((r) => r.data),

  deleteTrade: (id) => api.delete(`/trades/${id}`).then((r) => r.data),

  getTradeStats: () => api.get("/trades/stats").then((r) => r.data),
};

// Backward-compatible aliases used by existing components.
export const tradesApi = {
  ...tradeApi,
  getStats: tradeApi.getTradeStats,
};
