import { describe, expect, it } from "vitest";
import { loginSchema } from "@/schemas/auth.schema";
import { userCreateSchema, userUpdateSchema } from "@/schemas/admin-user.schema";
import { productFormSchema } from "@/schemas/product.schema";
import { partnershipFormSchema } from "@/schemas/partnership.schema";
import { teamMemberFormSchema } from "@/schemas/team-member.schema";
import { cmsPageUpdateSchema } from "@/schemas/cms.schema";
import { createSlug } from "@/utils/slug";

const product = {
  mainName: "Sabão",
  shortDescription: "Descrição curta válida",
  fullDescription: "Descrição completa válida",
  type: "BAR",
};
const user = {
  name: "Maria Silva",
  email: "MARIA@example.com",
  password: "senha-de-teste-123",
  role: "EDITOR",
};
const section = {
  key: "hero",
  title: "Início",
  position: 0,
  enabled: true,
  content: { title: "Olá" },
};

describe("Validações de negócio", () => {
  it("normaliza slugs com acentos", () =>
    expect(createSlug(" Sabão & Limpeza! ")).toBe("sabao-limpeza"));
  it("rejeita credenciais inválidas", () =>
    expect(loginSchema.safeParse({ email: "invalido", password: "123" }).success).toBe(false));
  it("normaliza e-mail de cadastro", () =>
    expect(userCreateSchema.parse(user).email).toBe("maria@example.com"));
  it("rejeita senha curta e perfil desconhecido", () => {
    expect(userCreateSchema.safeParse({ ...user, password: "12345678" }).success).toBe(false);
    expect(userCreateSchema.safeParse({ ...user, role: "ROOT" }).success).toBe(false);
  });
  it("permite manter a senha durante edição", () =>
    expect(
      userUpdateSchema.safeParse({ name: user.name, role: user.role, password: "" }).success,
    ).toBe(true));
  it("aplica padrões do produto", () =>
    expect(productFormSchema.parse(product)).toMatchObject({
      isPublished: true,
      isFeatured: false,
      displayOrder: 0,
      ingredients: [],
      variants: [],
    }));
  it("rejeita ordem negativa e tipo inválido", () => {
    expect(productFormSchema.safeParse({ ...product, displayOrder: -1 }).success).toBe(false);
    expect(productFormSchema.safeParse({ ...product, type: "OTHER" }).success).toBe(false);
  });
  it("normaliza iniciais da equipe", () =>
    expect(
      teamMemberFormSchema.parse({
        name: "Maria",
        role: "Gestora",
        bio: "Biografia válida",
        initials: "ms",
      }),
    ).toMatchObject({ initials: "MS", order: 0 }));
  it("valida parceria sem logo e rejeita URL inválida", () => {
    expect(partnershipFormSchema.parse({ name: "Parceira", logoUrl: "" }).order).toBe(0);
    expect(partnershipFormSchema.safeParse({ name: "Parceira", logoUrl: "invalido" }).success).toBe(
      false,
    );
  });
  it("aceita seções válidas e rejeita chaves duplicadas", () => {
    expect(cmsPageUpdateSchema.safeParse({ sections: [section] }).success).toBe(true);
    expect(cmsPageUpdateSchema.safeParse({ sections: [section, section] }).success).toBe(false);
  });
});
