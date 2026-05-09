import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_BASE } from "~/lib/api";

export const Route = createFileRoute("/items/$id/add")({
  component: ItemAdd,
});

interface ItemSummary {
  name: string;
  updated_at: string;
}

interface Supermarket {
  id: number;
  name: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function ItemAdd() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [supermarketId, setSupermarketId] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: item } = useQuery<ItemSummary>({
    queryKey: ["items", id],
    queryFn: async () => {
      const r = await fetch(`${API_BASE}/items/${id}`);
      if (!r.ok) throw new Error("Network error");
      return r.json();
    },
  });

  const { data: supermarkets = [] } = useQuery<Supermarket[]>({
    queryKey: ["supermarkets"],
    queryFn: async () => {
      const r = await fetch(`${API_BASE}/supermarkets`);
      if (!r.ok) throw new Error("Network error");
      const data = await r.json();
      return data.supermarkets ?? [];
    },
    select: (data) => {
      if (data.length && !supermarketId) setSupermarketId(String(data[0].id));
      return data;
    },
  });

  if (item) document.title = `${item.name}の価格追加`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/items/${id}/prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supermarket_id: Number(supermarketId), price: Number(price) }),
      });
      if (!res.ok) throw new Error();
      navigate({ to: "/items/$id", params: { id } });
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {item ? `${item.name}の価格追加` : "スーパー＆価格の追加"}
        </h1>
        {item && (
          <p className="text-xs text-gray-400">
            最終更新: {formatDate(item.updated_at)}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="supermarket" className="text-sm font-medium text-gray-700">
            スーパーの名前
          </label>
          <select
            id="supermarket"
            value={supermarketId}
            onChange={(e) => setSupermarketId(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          >
            {supermarkets.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            価格
          </label>
          <input
            id="price"
            type="number"
            min="0"
            placeholder="168"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <div className="flex flex-col gap-3 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full text-white text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#f1582c" }}
          >
            {submitting ? "保存中..." : "保存"}
          </button>
          <Link
            to="/items/$id"
            params={{ id }}
            className="block w-full py-3 border border-gray-300 rounded-full text-sm text-center text-gray-600 hover:border-gray-400 transition-colors"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </>
  );
}
