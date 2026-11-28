// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MapaBrasil } from "@/components/MapaBrasil";
import type { LocationView } from "@/lib/location-map";

const sede: LocationView = {
  id: "a",
  name: "Sede de teste",
  city: "Fortaleza",
  state: "CE",
  address: "Endereço de teste",
  description: "Descrição de teste",
  latitude: -3.73,
  longitude: -38.52,
};

afterEach(cleanup);

it("mostra os dados ao passar o mouse e oculta ao sair", () => {
  render(<MapaBrasil localizacoes={[sede]} onSelect={vi.fn()} />);
  const marker = screen.getByRole("button", { name: sede.name });
  expect(screen.queryByRole("tooltip")).toBeNull();
  fireEvent.mouseEnter(marker);
  const card = screen.getByRole("tooltip");
  expect(card.textContent).toContain(sede.name);
  expect(card.textContent).toContain("Fortaleza – CE");
  expect(card.textContent).toContain(sede.address);
  expect(card.textContent).toContain(sede.description);
  fireEvent.mouseLeave(marker);
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("permite consultar pelo teclado e fechar a prévia com Escape", () => {
  render(<MapaBrasil localizacoes={[sede]} onSelect={vi.fn()} expanded />);
  const marker = screen.getByRole("button", { name: sede.name });
  fireEvent.focus(marker);
  expect(screen.getByRole("tooltip")).toBeTruthy();
  fireEvent.keyDown(marker, { key: "Escape" });
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("agrupa sedes sobrepostas e abre todos os registros ao selecionar", () => {
  const second = { ...sede, id: "b", name: "Outra sede" };
  const onSelect = vi.fn();
  render(<MapaBrasil localizacoes={[sede, second]} onSelect={onSelect} />);
  const marker = screen.getByRole("button", { name: "2 sedes" });
  fireEvent.mouseEnter(marker);
  expect(screen.getByRole("tooltip").textContent).toContain(second.name);
  fireEvent.click(marker);
  expect(onSelect).toHaveBeenCalledWith([sede, second]);
  expect(screen.queryByRole("tooltip")).toBeNull();
});
