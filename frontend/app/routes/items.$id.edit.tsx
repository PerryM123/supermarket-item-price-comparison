import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { API_BASE } from "~/lib/api";

export const Route = createFileRoute("/items/$id/edit")({
  component: ItemEdit,
});

export default function ItemEdit() {
  document.title = "商品編集";
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: itemData } = useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      const r = await fetch(`${API_BASE}/items/${id}`);
      if (!r.ok) throw new Error("Network error");
      return r.json();
    },
  });

  useEffect(() => {
    if (itemData) {
      setName(itemData.name ?? "");
      setExistingImageUrl(itemData.image_url ?? null);
    }
  }, [itemData]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", name);
      if (newImage) formData.append("image", newImage);
      const res = await fetch(`${API_BASE}/items/${id}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", id] });
      navigate({ to: "/items/$id", params: { id } });
    },
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImage(file);
    setNewPreview(URL.createObjectURL(file));
    setExistingImageUrl(null);
  }

  function removeImage() {
    setNewImage(null);
    setNewPreview(null);
    setExistingImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate();
  }

  const previewSrc = newPreview ?? existingImageUrl;

  return (
    <>
      <h1 className="text-xl font-semibold text-center text-gray-900 mb-8">
        商品編集
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-semibold text-gray-800">
            商品名
          </label>
          <input
            id="name"
            type="text"
            placeholder="バナナ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-1 py-2 border-b border-gray-300 text-sm text-gray-800 bg-transparent focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-800">Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {previewSrc ? (
            <div className="relative">
              <img
                src={previewSrc}
                alt="プレビュー"
                className="w-full rounded-2xl object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-gray-900 hover:bg-gray-700 rounded-full flex items-center justify-center text-white text-sm transition-colors"
              >
                &#x2715;
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 px-4 py-3 border border-gray-300 hover:border-gray-400 rounded-xl text-sm text-gray-600 transition-colors w-fit"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              画像追加
            </button>
          )}
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
