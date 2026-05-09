import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { API_BASE } from "~/lib/api";

export const Route = createFileRoute("/supermarkets/add")({
  component: SupermarketsAdd,
});

export default function SupermarketsAdd() {
  document.title = "スーパー追加";
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/supermarkets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      navigate({ to: "/supermarkets" });
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-center text-gray-900 mb-8">
        スーパー追加
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-semibold text-gray-800">
            スーパーの名前
          </label>
          <input
            id="name"
            type="text"
            placeholder="OKスーパー（池上店）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-1 py-2 border-b border-gray-300 text-sm text-gray-800 bg-transparent focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center -mt-4">{error}</p>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full text-white text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#f1582c" }}
          >
            {submitting ? "保存中..." : "保存"}
          </button>
          <Link
            to="/supermarkets"
            className="block w-full py-3 border border-gray-300 rounded-full text-sm text-center text-gray-600 hover:border-gray-400 transition-colors"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </>
  );
}
