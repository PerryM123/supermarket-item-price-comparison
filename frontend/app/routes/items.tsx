import type { Route } from "./+types/items";

export function meta({}: Route.MetaArgs) {
  return [{ title: "商品一覧" }];
}

export default function Items() {
  return (
    <main>
      <h1>商品一覧</h1>
      <p>登録されている商品の一覧です。</p>
    </main>
  );
}
