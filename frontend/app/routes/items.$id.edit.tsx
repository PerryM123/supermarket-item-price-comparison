import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/items.$id.edit";
import { API_BASE } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [{ title: "商品編集" }];
}


export default function ItemEdit({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  // Tracks the existing remote URL (shown until user picks a new file or removes it)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  // Tracks a newly picked local file
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/items/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setName(data.name ?? "");
        setExistingImageUrl(data.image_url ?? null);
      })
      .catch(() => {});
  }, [params.id]);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", name);
      if (newImage) formData.append("image", newImage);
      const res = await fetch(`${API_BASE}/items/${params.id}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      navigate(`/items/${params.id}`);
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  const previewSrc = newPreview ?? existingImageUrl;

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-16">

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
                Add Photo
              </button>
            )}
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
              to={`/items/${params.id}`}
              className="block w-full py-3 border border-gray-300 rounded-full text-sm text-center text-gray-600 hover:border-gray-400 transition-colors"
            >
              キャンセル
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
