import type { Route } from "./+types/supermarkets.add";

export function meta({}: Route.MetaArgs) {
  return [{ title: "スーパー追加" }];
}

export default function SupermarketsAdd() {
  return (
    <main>
      <h1>スーパー追加</h1>
      <p>新しいスーパーマーケットを追加します。</p>
    </main>
  );
}
