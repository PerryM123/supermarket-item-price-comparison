import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/items.$id.prices.$priceId.edit";

interface Supermarket {
  id: number;
  name: string;
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "価格の編集" }];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const BASE = "http://local.super-price-check.com:8082/api";

export default function ItemPriceEdit({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [supermarketId, setSupermarketId] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/items/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setUpdatedAt(data.updated_at ?? null);
        const match = data.prices?.find(
          (p: { id: number }) => String(p.id) === params.priceId
        );
        if (match) {
          setPrice(String(match.price));
          setSupermarketId(String(match.supermarket.id));
        }
      })
      .catch(() => {});

    fetch(`${BASE}/supermarkets`)
      .then((r) => r.json())
      .then((data) => setSupermarkets(data.supermarkets ?? []))
      .catch(() => {});
  }, [params.id, params.priceId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // TODO: replace with real item-price endpoint when available
      // PUT /api/items/:id/prices/:priceId  { supermarket_id, price }
      await Promise.resolve();
      navigate(`/items/${params.id}`);
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-16">

        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            価格の編集
          </h1>
          {updatedAt && (
            <p className="text-xs text-gray-400">
              最終更新: {formatDate(updatedAt)}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1">
            <label htmlFor="supermarket" className="text-sm font-semibold text-gray-800">
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
            <label htmlFor="price" className="text-sm font-semibold text-gray-800">
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
              to={`/items/${params.id}`}
              className="block w-full py-3 border border-gray-300 rounded-full text-sm text-center text-gray-600 hover:border-gray-400 transition-colors"
            >
              キャンセル
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
