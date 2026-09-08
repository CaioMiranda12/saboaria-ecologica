import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { productFormSchema } from "@/schemas/product.schema";
import { createProductFromForm, listProducts, DuplicateProductSlugError } from "@/services/product.service";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const products = await listProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = productFormSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  try {
    const product = await createProductFromForm(parseResult.data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateProductSlugError) {
      return NextResponse.json({ message: "Já existe um produto com esse nome" }, { status: 409 });
    }

    console.error(error);
    return NextResponse.json({ message: "Erro ao criar produto" }, { status: 500 });
  }
}