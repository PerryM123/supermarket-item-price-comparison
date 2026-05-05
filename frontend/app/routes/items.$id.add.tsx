import type { Route } from "./+types/items.$id.add";

export function meta({}: Route.MetaArgs) {
  return [{ title: "商品追加" }];
}

export default function ItemAdd({ params }: Route.ComponentProps) {
  return (
    <main>
      <h1>商品追加</h1>
      <p>商品ID: {params.id} に価格情報を追加します。</p>
    </main>
  );
}
