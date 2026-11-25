import { describe, expect, it } from "vitest";
import { z } from "zod";
import { productFormInputSchema, productFormSchema } from "@/schemas/product.schema";
import { partnershipFormSchema } from "@/schemas/partnership.schema";
import { teamMemberFormSchema } from "@/schemas/team-member.schema";
import { cmsPageUpdateSchema } from "@/schemas/cms.schema";
import { userCreateSchema } from "@/schemas/admin-user.schema";

const product = {
  mainName: "Sabão",
  shortDescription: "Descrição curta válida",
  fullDescription: "Descrição completa válida",
  type: "BAR",
};

const member = {
  name: "Maria",
  role: "Gestora",
  bio: "Biografia válida",
  initials: "ms",
};

describe("Compatibilidade dos schemas após migração do Zod", () => {
  it("mantém os padrões dos campos de texto do formulário de produtos", () => {
    expect(productFormInputSchema.parse(product)).toMatchObject({
      ingredientsText: "",
      variantsText: "",
    });
  });

  it("converte ordens numéricas em texto sem perder as validações", () => {
    expect(productFormSchema.parse({ ...product, displayOrder: "3" }).displayOrder).toBe(3);
    expect(productFormSchema.safeParse({ ...product, displayOrder: "abc" }).success).toBe(false);
    expect(teamMemberFormSchema.parse({ ...member, order: "2" }).order).toBe(2);
    expect(partnershipFormSchema.parse({ name: "Parceira", order: "4" }).order).toBe(4);
  });

  it("preserva URLs locais de produtos e imagens opcionais", () => {
    expect(productFormSchema.parse({ ...product, imageUrl: "/hero.jpg" }).imageUrl).toBe(
      "/hero.jpg",
    );
    expect(teamMemberFormSchema.parse({ ...member, imageUrl: "" }).imageUrl).toBe("");
    expect(partnershipFormSchema.parse({ name: "Parceira" }).logoUrl).toBeUndefined();
  });

  it("normaliza e-mail com espaços e letras maiúsculas", () => {
    expect(
      userCreateSchema.parse({
        name: "Maria Silva",
        email: " MARIA@example.com ",
        password: "senha-de-teste-123",
        role: "EDITOR",
      }).email,
    ).toBe("maria@example.com");
  });

  it("preserva o formato de erros de validação do CMS", () => {
    const result = cmsPageUpdateSchema.safeParse({ sections: [null] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(z.flattenError(result.error)).toEqual({
        formErrors: [],
        fieldErrors: { sections: expect.arrayContaining([expect.any(String)]) },
      });
    }
  });
});
