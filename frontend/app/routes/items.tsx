import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/items";

interface Items {
  id: number
  name: string
  imageUrl: string
  created_at: string
  updated_at: string
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "商品一覧" }];
}

export default function Items() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Items[]>([]);

  useEffect(() => {
    const fetchItems = async ()  => {
      try {
        // TODO: Need to try out react query or something
        const response = await fetch('http://local.super-price-check.com:8082/api/items');
        console.log('perry: response: ', response);
        if (!response.ok) throw new Error('Network error');
        const result = await response.json();
        console.log('perry: result: ', result);
        // TODO: any type and bad var name...
        setItems(result.items.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            imageUrl: item.image_url,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }
        }))
      } catch (error) {
        // TODO: Error handling
      }
    }
    fetchItems()
  }, [])

  const filtered = items.filter((item) => item.name.includes(search));

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 pt-4 pb-24">
        <h1 className="text-xl font-semibold text-center text-gray-900 mb-4">
          商品一覧
        </h1>

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
              to={`/items/${item.id}`}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-full aspect-square bg-gray-100 rounded-xl">
                <img className="perry" src={item.imageUrl} alt={item.name} />
              </div>
              <span className="text-sm text-gray-800">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white text-3xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: "#2196F3" }}
        aria-label="商品を追加"
      >
        +
      </button>
    </div>
  );
}
