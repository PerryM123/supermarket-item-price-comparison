import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useCreateSupermarket } from "~/features/supermarkets/hooks/useCreateSupermarket";

export const Route = createFileRoute("/supermarkets/add")({
  component: SupermarketsAdd,
});

export default function SupermarketsAdd() {
  document.title = "スーパー追加";
  const navigate = useNavigate();
  const router = useRouter();
  const [name, setName] = useState("");

  const { mutate, isPending, isError } = useCreateSupermarket();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    mutate({ name }, { onSuccess: () => navigate({ to: "/supermarkets" }) });
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
          <button
            type="button"
            onClick={() => router.history.back()}
            className="block w-full py-3 border border-gray-300 rounded-full text-sm text-center text-gray-600 hover:border-gray-400 transition-colors cursor-pointer"
          >
            キャンセル
          </button>
        </div>
      </form>
    </>
  );
}
