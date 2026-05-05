import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("items", "routes/items.tsx"),
  route("items/:id", "routes/items.$id.tsx"),
  route("items/:id/add", "routes/items.$id.add.tsx"),
  route("items/:id/edit", "routes/items.$id.edit.tsx"),
  route("supermarkets", "routes/supermarkets.tsx"),
  route("supermarkets/add", "routes/supermarkets.add.tsx"),
  route("supermarkets/edit", "routes/supermarkets.edit.tsx"),
] satisfies RouteConfig;
