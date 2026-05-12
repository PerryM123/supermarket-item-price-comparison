import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useItem } from "~/features/items/hooks/useItem";
import { useItemPrices } from "~/features/items/hooks/useItemPrices";

type SortColumn = "supermarket" | "created_at" | "id" | "price";

export const Route = createFileRoute("/items/$id/")({
  validateSearch: (search: Record<string, unknown>) => ({
    sortBy: (search.sortBy as SortColumn) ?? "id",
    sortAsc: search.sortAsc !== false,
    page: typeof search.page === "number" ? search.page : 1,
  }),
  component: ItemDetail,
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function SortIcon({ active, asc }: { active: boolean; asc: boolean }) {
  return (
    <span className={`text-xs ${active ? "text-gray-700" : "text-gray-300"}`}>
      {active && !asc ? "▼" : "▲"}
    </span>
  );
}

export default function ItemDetail() {
  const { id } = Route.useParams();
  const { sortBy, sortAsc, page } = Route.useSearch();
  const navigate = useNavigate({ from: "/items/$id/" });

  const { data: item } = useItem(id);
  const { data: pricesPage } = useItemPrices({ id, page, sortBy, sortAsc });

  function handleSort(col: SortColumn) {
    navigate({
      search: { sortBy: col, sortAsc: sortBy === col ? !sortAsc : true, page: 1 },
      resetScroll: false,
    });
  }

  function handlePage(newPage: number) {
    navigate({
      search: { sortBy, sortAsc, page: newPage },
      resetScroll: false,
    });
  }

  if (!item) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        読み込み中...
      </div>
    );
  }

  document.title = item.name;

  const prices = pricesPage?.data ?? [];
  const meta = pricesPage?.meta;

  return (
    <>
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-32 h-32 object-cover rounded-2xl mx-auto mb-5 shadow-sm"
        />
      ) : (
        <div className="w-32 h-32 bg-gray-100 rounded-2xl mx-auto mb-5" />
      )}

      <h1 className="text-2xl font-bold text-center text-gray-900 mb-3">
        {item.name}
      </h1>

      <div className="flex flex-col items-center gap-2 mb-8">
        <Link
          to="/items/$id/edit"
          params={{ id }}
          className="px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:border-gray-400 transition-colors"
        >
          商品詳細を編集
        </Link>
        <p className="text-xs text-gray-400">
          最終更新: {formatDate(item.updated_at)}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("supermarket")}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  スーパー名 <SortIcon active={sortBy === "supermarket"} asc={sortAsc} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  投稿日 <SortIcon active={sortBy === "created_at"} asc={sortAsc} />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("id")}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors ml-auto"
                >
                  価格ID <SortIcon active={sortBy === "id"} asc={sortAsc} />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("price")}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors ml-auto"
                >
                  価格 <SortIcon active={sortBy === "price"} asc={sortAsc} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {prices.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-sm text-gray-400 text-center py-6">
                  {pricesPage ? "価格情報がありません" : "読み込み中..."}
                </td>
              </tr>
            ) : (
              prices.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {p.supermarket.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {formatDate(p.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-sm font-medium text-gray-800">{p.id}</span>
                      <Link
                        to="/items/$id/prices/$priceId/edit"
                        params={{ id, priceId: String(p.id) }}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        編集
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-800">
                    {p.price.toLocaleString()}円
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>{meta.total.toLocaleString()}件</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              ‹
            </button>
            <span className="px-2">
              {page} / {meta.last_page}
            </span>
            <button
              onClick={() => handlePage(page + 1)}
              disabled={page >= meta.last_page}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link
          to="/items/$id/add"
          params={{ id }}
          className="block w-full py-3 rounded-full text-white text-sm font-medium transition-opacity disabled:opacity-50 text-center"
          style={{ backgroundColor: "#f1582c" }}
        >
          スーパー＆価格を追加
        </Link>
      </div>
    </>
  );
}
