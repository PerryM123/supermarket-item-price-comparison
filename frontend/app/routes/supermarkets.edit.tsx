import type { Route } from "./+types/supermarkets.edit";

export function meta({}: Route.MetaArgs) {
  return [{ title: "スーパー編集" }];
}

export default function SupermarketsEdit() {
  return (
    <main>
      <h1>スーパー編集</h1>
      <p>スーパーマーケット情報を編集します。</p>
    </main>
  );
}
