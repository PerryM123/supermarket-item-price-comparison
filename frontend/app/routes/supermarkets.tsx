import type { Route } from "./+types/supermarkets";

export function meta({}: Route.MetaArgs) {
  return [{ title: "スーパー一覧" }];
}

export default function Supermarkets() {
  return (
    <main>
      <h1>スーパー一覧</h1>
      <p>登録されているスーパーマーケットの一覧です。</p>
    </main>
  );
}
