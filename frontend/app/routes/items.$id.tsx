import type { Route } from "./+types/items.$id";

export function meta({}: Route.MetaArgs) {
  return [{ title: "商品詳細" }];
}

export default function ItemDetail({ params }: Route.ComponentProps) {
  return (
    <main>
      <h1>商品詳細</h1>
      <p>商品ID: {params.id}</p>
    </main>
  );
}
