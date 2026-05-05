import type { Route } from "./+types/items.$id.edit";

export function meta({}: Route.MetaArgs) {
  return [{ title: "商品編集" }];
}

export default function ItemEdit({ params }: Route.ComponentProps) {
  return (
    <main>
      <h1>商品編集</h1>
      <p>商品ID: {params.id} を編集します。</p>
    </main>
  );
}
