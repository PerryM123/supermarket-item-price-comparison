import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "スーパー比較" }];
}

export default function Home() {
  return (
    <div className="flex-1 bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-sm w-full flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            スーパー比較
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            近くのスーパーマーケットの商品価格を
            <br />
            かんたんに比較できます。
          </p>
        </div>

        <div className="flex flex-col w-full gap-3">
          <Link
            to="/items"
            className="w-full py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg text-center transition-colors"
          >
            商品一覧 →
          </Link>
          <Link
            to="/supermarkets"
            className="w-full py-3 px-6 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg text-center transition-colors"
          >
            スーパー一覧
          </Link>
        </div>
      </div>
    </div>
  );
}
