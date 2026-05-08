import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/items.$id";
import { API_BASE } from "~/lib/api";

interface Price {
  id: number;
  price: number;
  supermarket: { id: number; name: string };
}

interface ItemDetail {
  id: number;
  name: string;
  image_url: string | null;
  updated_at: string;
  prices: Price[];
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "商品詳細" }];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function ItemDetail({ params }: Route.ComponentProps) {
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    console.log('perry: params.id: ', params.id);
    fetch(`${API_BASE}/items/${params.id}`)
      .then((r) => r.json())
      .then(setItem)
      .catch(() => {});
  }, [params.id]);

  const sorted = item
    ? [...item.prices].sort((a, b) =>
        sortAsc ? a.price - b.price : b.price - a.price
      )
    : [];

  if (!item) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-16">

        {/* Item image */}
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-32 h-32 object-cover rounded-2xl mx-auto mb-5 shadow-sm"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-100 rounded-2xl mx-auto mb-5" />
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-3">
          {item.name}
        </h1>

        {/* Edit button + timestamp */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <Link
            to={`/items/${params.id}/edit`}
            className="px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:border-gray-400 transition-colors"
          >
            商品詳細を編集
          </Link>
          <p className="text-xs text-gray-400">
            最終更新: {formatDate(item.updated_at)}
          </p>
        </div>

        {/* Price table */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">スーパー</span>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              価格 <span className="text-xs">{sortAsc ? "▲" : "▼"}</span>
            </button>
          </div>
          {sorted.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              価格情報がありません
            </p>
          ) : (
            sorted.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-4 py-3 border-t border-gray-100"
              >
                <span className="text-sm text-gray-800">{p.supermarket.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-800">
                    {p.price.toLocaleString()}円
                  </span>
                  <Link
                    to={`/items/${params.id}/prices/${p.id}/edit`}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    編集
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add supermarket button */}
        <div className="mt-6">
          <Link
            to={`/items/${params.id}/add`}
            className="block w-full py-3 border border-gray-300 rounded-full text-sm text-center text-gray-600 hover:border-gray-400 transition-colors"
          >
            スーパー＆価格を追加
          </Link>
        </div>

      </div>
    </div>
  );
}
