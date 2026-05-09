import { Outlet, createRootRoute } from "@tanstack/react-router";
import Header from "~/components/Header";
import "~/app.css";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <div className="pt-16 min-h-[calc(100vh-4rem)] flex flex-col">
        <Outlet />
      </div>
    </>
  ),
});
