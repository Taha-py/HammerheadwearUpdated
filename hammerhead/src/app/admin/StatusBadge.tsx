export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${map[status] ?? "bg-gray-100"}`}>{status}</span>;
}
