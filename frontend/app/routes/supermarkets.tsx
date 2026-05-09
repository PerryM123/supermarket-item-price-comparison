import { Outlet, createFileRoute } from "@tanstack/react-router";
import PageContainer from "~/components/PageContainer";

export const Route = createFileRoute("/supermarkets")({
  component: () => (
    <PageContainer>
      <Outlet />
    </PageContainer>
  ),
});
