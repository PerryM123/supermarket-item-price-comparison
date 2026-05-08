import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/supermarkets";
import { API_BASE } from "~/lib/api";

interface Supermarket {
  id: number;
  name: string;
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "スーパー一覧" }];
}

export default function Supermarkets() {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/supermarkets`)
      .then((r) => r.json())
      .then((data) => setSupermarkets(data.supermarkets ?? []))
      .catch(() => {});
  }, []);

  const filtered = supermarkets.filter((s) => s.name.includes(search));

  return (
    <div className="flex-1 bg-white">
      <div className="px-4 pt-4 pb-24">
        <h1 className="text-xl font-semibold text-center text-gray-900 mb-4">
          スーパー一覧
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

        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              スーパーが登録されていません
            </p>
          ) : (
            filtered.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center justify-between px-4 py-4 ${
                  i !== 0 ? "border-t border-gray-100" : ""
                }`}
              >
                <span className="text-sm text-gray-800">{s.name}</span>
                <Link
                  to={`/supermarkets/${s.id}/edit`}
                  className="px-3 py-1 bg-gray-900 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  編集
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      <Link
        to="/supermarkets/add"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white text-3xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: "#2196F3" }}
        aria-label="スーパーを追加"
      >
        +
      </Link>
    </div>
  );
}
