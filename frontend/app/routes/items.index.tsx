import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useItems } from "~/features/items/hooks/useItems";

export const Route = createFileRoute("/items/")({
  component: Items,
});

export default function Items() {
  document.title = "商品一覧";
  const [search, setSearch] = useState("");

  const { data: items = [] } = useItems();

  const filtered = items.filter((item) => item.name.includes(search));

  return (
    <>
      <h1 className="text-xl font-semibold text-center text-gray-900 mb-4">
        商品一覧
      </h1>
      <div className="flex justify-center">
        <Link
          to="/items/add"
          className="block w-55 py-3 rounded-full text-white text-sm font-medium transition-opacity disabled:opacity-50 text-center mb-6"
          style={{ backgroundColor: "#f1582c" }}
        >
          商品追加
        </Link>
      </div>

      <div className="relative mb-5">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((item) => (
          <Link
            key={item.id}
            to="/items/$id"
            params={{ id: String(item.id) }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-full aspect-square rounded-xl">
              <div className="flex items-center h-full">
                <img src={item.imageUrl} alt={item.name} />
              </div>
            </div>
            <span className="text-sm text-gray-800">{item.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
