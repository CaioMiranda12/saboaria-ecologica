import { describe, expect, it } from "vitest";
import { containsMedia } from "@/lib/media-references";
const asset = {
  url: "https://res.cloudinary.com/demo/image/upload/v1/saboaria/midia/abc.png",
  publicId: "saboaria/midia/abc",
};
describe("referências de mídia", () => {
  it("encontra URL original", () => expect(containsMedia(asset.url, asset)).toBe(true));
  it("encontra URL transformada", () =>
    expect(
      containsMedia(
        "https://res.cloudinary.com/demo/image/upload/w_200/v2/saboaria/midia/abc.webp",
        asset,
      ),
    ).toBe(true));
  it("encontra referência aninhada no histórico", () =>
    expect(containsMedia([{ content: { images: [asset.url] } }], asset)).toBe(true));
  it("encontra publicId codificado", () =>
    expect(containsMedia("saboaria%2Fmidia%2Fabc", asset)).toBe(true));
  it("ignora valores vazios e outras imagens", () =>
    expect(containsMedia([null, false, "outra.png"], asset)).toBe(false));
});
