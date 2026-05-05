import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ホーム" }];
}

export default function Home() {
  return (
    <main>
      <h1>ホーム</h1>
      <p>スーパーマーケット商品価格比較アプリへようこそ。</p>
    </main>
  );
}
