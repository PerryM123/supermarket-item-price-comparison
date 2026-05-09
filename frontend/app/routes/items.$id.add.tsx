import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useItem } from "~/features/items/hooks/useItem";
import { useCreatePrice } from "~/features/items/hooks/useCreatePrice";
import { useSupermarkets } from "~/features/supermarkets/hooks/useSupermarkets";

export const Route = createFileRoute("/items/$id/add")({
  component: ItemAdd,
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function ItemAdd() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [supermarketId, setSupermarketId] = useState("");
  const [price, setPrice] = useState("");

  const { data: item } = useItem(id);
  const { data: supermarkets = [] } = useSupermarkets();

  useEffect(() => {
    if (supermarkets.length && !supermarketId) {
      setSupermarketId(String(supermarkets[0].id));
    }
  }, [supermarkets]);

  const { mutate, isPending, isError } = useCreatePrice(id);

  if (item) document.title = `${item.name}の価格追加`;

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    mutate(
      { supermarket_id: Number(supermarketId), price: Number(price) },
      { onSuccess: () => navigate({ to: "/items/$id", params: { id } }) }
    );
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

        {isError && (
          <p className="text-sm text-red-500 text-center">保存に失敗しました。もう一度お試しください。</p>
        )}

        <div className="flex flex-col gap-3 mt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-full text-white text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#f1582c" }}
          >
            {isPending ? "保存中..." : "保存"}
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
