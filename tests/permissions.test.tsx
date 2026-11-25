// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AdminPermissions, useCanDeleteRecords } from "@/components/admin/AdminPermissions";
function DeleteControl() {
  return useCanDeleteRecords() ? <button>Excluir</button> : null;
}
afterEach(cleanup);
it("não renderiza exclusão para editor", () => {
  render(
    <AdminPermissions role="EDITOR">
      <DeleteControl />
    </AdminPermissions>,
  );
  expect(screen.queryByRole("button", { name: "Excluir" })).toBeNull();
});
it("renderiza exclusão para administrador", () => {
  render(
    <AdminPermissions role="ADMIN">
      <DeleteControl />
    </AdminPermissions>,
  );
  expect(screen.getByRole("button", { name: "Excluir" })).toBeTruthy();
});
