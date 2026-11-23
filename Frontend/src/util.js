export const toDate = (d) =>
  !d ? null : Array.isArray(d) ? new Date(d[0], d[1] - 1, d[2], d[3] || 0, d[4] || 0) : new Date(d);
export const fmtDate = (d) => {
  const x = toDate(d);
  return x ? x.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";
};
export const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
export const STATUSES = ["CREATED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
