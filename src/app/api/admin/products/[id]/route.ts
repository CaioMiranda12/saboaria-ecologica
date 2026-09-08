import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { productFormSchema } from "@/schemas/product.schema";
import {
  getProductOrThrow,
  updateProductFromForm,
  removeProduct,
  ProductNotFoundError,
  DuplicateProductSlugError,
} from "@/services/product.service";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const product = await getProductOrThrow(id);
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ message: "Erro ao buscar produto" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parseResult = productFormSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  try {
    const product = await updateProductFromForm(id, parseResult.data);
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
    }
    if (error instanceof DuplicateProductSlugError) {
      return NextResponse.json({ message: "Já existe um produto com esse nome" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ message: "Erro ao atualizar produto" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await removeProduct(id);
    return NextResponse.json({ message: "Produto removido" });
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ message: "Erro ao remover produto" }, { status: 500 });
  }
}