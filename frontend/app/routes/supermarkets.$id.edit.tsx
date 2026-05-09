import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSupermarket } from "~/features/supermarkets/hooks/useSupermarket";
import { useUpdateSupermarket } from "~/features/supermarkets/hooks/useUpdateSupermarket";

export const Route = createFileRoute("/supermarkets/$id/edit")({
  component: SupermarketsEdit,
});

export default function SupermarketsEdit() {
  document.title = "スーパー編集";
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const { data: supermarketData } = useSupermarket(id);

  useEffect(() => {
    if (supermarketData) setName(supermarketData.name ?? "");
  }, [supermarketData]);

  const { mutate, isPending, isError } = useUpdateSupermarket(id);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    mutate({ name }, { onSuccess: () => navigate({ to: "/supermarkets" }) });
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-center text-gray-900 mb-8">
        スーパー編集
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

        {isError && (
          <p className="text-sm text-red-500 text-center -mt-4">保存に失敗しました。もう一度お試しください。</p>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-full text-white text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#f1582c" }}
          >
            {isPending ? "保存中..." : "保存"}
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
