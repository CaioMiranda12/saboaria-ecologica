"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CmsPageSlug } from "@/constants/cms-pages";
import { CMS_EDITOR_FIELDS } from "@/constants/cms-editor-fields";
import { cmsPageUpdateSchema } from "@/schemas/cms.schema";
import type { z } from "zod";
import PublicImage from "@/components/PublicImage";

type Sections = z.infer<typeof cmsPageUpdateSchema>["sections"];
type Props = {
  slug: CmsPageSlug;
  versionId: string;
  createdAt?: string;
  actorName?: string | null;
  busy: boolean;
  dirty: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const labels: Record<string, string> = {
  title: "Título",
  description: "Descrição",
  primaryButton: "Botão principal",
  secondaryButton: "Botão secundário",
  mission: "Missão",
  vision: "Visão",
  values: "Valores",
  imageUrl: "Imagem",
};

function labelFor(slug: CmsPageSlug, section: string, field: string) {
  if (slug !== "inicio") {
    const definitions = Object.entries(CMS_EDITOR_FIELDS[slug].sections);
    const definition = definitions.find(([key]) => key === section)?.[1];
    const label = definition?.fields.find(
      (item: { key: string; label: string }) => item.key === field,
    )?.label;
    if (label) return label;
  }
  return labels[field] ?? field;
}

function imageSource(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

function PreviewValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "")
    return <p className="text-verde-muted italic">Não preenchido</p>;
  if (Array.isArray(value))
    return value.length ? (
      <ul className="list-disc space-y-1 pl-5">
        {value.map((item, index) => (
          <li key={index}>
            <PreviewValue value={item} />
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-verde-muted italic">Lista vazia</p>
    );
  if (typeof value === "object")
    return (
      <dl className="space-y-2 border-l border-verde-medio/20 pl-3">
        {Object.entries(value).map(([key, item]) => (
          <div key={key}>
            <dt className="font-medium">{key}</dt>
            <dd>
              <PreviewValue value={item} />
            </dd>
          </div>
        ))}
      </dl>
    );
  return (
    <p className="wrap-break-word whitespace-pre-wrap">
      {typeof value === "boolean" ? (value ? "Sim" : "Não") : String(value)}
    </p>
  );
}

export default function CmsVersionPreview({
  slug,
  versionId,
  createdAt,
  actorName,
  busy,
  dirty,
  onCancel,
  onConfirm,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [sections, setSections] = useState<Sections | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/cms/pages/${slug}/versions?versionId=${encodeURIComponent(versionId)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível carregar esta versão.");
        const data = await response.json();
        const parsed = cmsPageUpdateSchema.safeParse({ sections: data.version?.sections });
        if (data.version?.id !== versionId || !parsed.success)
          throw new Error("A versão está indisponível.");
        if (!controller.signal.aborted) setSections(parsed.data.sections);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Não foi possível carregar a prévia. Feche e tente novamente.");
      });
    return () => controller.abort();
  }, [slug, versionId]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl overflow-hidden rounded-2xl border border-verde-medio/20 bg-creme text-verde-escuro shadow-2xl backdrop:bg-verde-escuro/60"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <header className="shrink-0 border-b border-verde-medio/20 bg-white p-4 sm:p-6">
          <h2 id={titleId} className="font-serif text-xl text-verde-principal">
            Prévia do rascunho antigo
          </h2>
          <p className="mt-1 text-xs text-verde-muted">
            {createdAt
              ? new Date(createdAt).toLocaleString("pt-BR", { timeZone: "America/Fortaleza" })
              : "Versão selecionada"}{" "}
            · {actorName || "Responsável não registrado"}
          </p>
          <p id={descriptionId} className="mt-3 text-sm">
            Confira os conteúdos salvos nesta versão. A restauração substituirá apenas o rascunho
            atual; o site público permanecerá igual até uma nova publicação.
          </p>
        </header>
        <div
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6"
          tabIndex={0}
          aria-label="Conteúdo da versão"
        >
          {error ? (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          ) : sections === null ? (
            <p role="status" className="text-sm text-verde-muted">
              Carregando prévia...
            </p>
          ) : (
            <>
              {sections.length === 0 && (
                <p className="text-sm text-verde-muted">Esta versão não possui seções.</p>
              )}
              {[...sections]
                .sort((a, b) => a.position - b.position)
                .map((section) => (
                  <article
                    key={section.key}
                    className="rounded-xl border border-verde-medio/20 bg-white p-4"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-serif text-lg text-verde-principal">{section.title}</h3>
                      <span className="rounded-full bg-verde-claro px-3 py-1 text-xs">
                        {section.enabled ? "Seção habilitada" : "Seção desabilitada"}
                      </span>
                    </div>
                    <dl className="space-y-4 text-sm">
                      {Object.entries(section.content).map(([key, value]) => {
                        const image = key === "imageUrl" ? imageSource(value) : null;
                        return (
                          <div key={key}>
                            <dt className="mb-1 text-xs font-semibold text-verde-muted">
                              {labelFor(slug, section.key, key)}
                            </dt>
                            <dd>
                              {image && (
                                <PublicImage
                                  src={image}
                                  alt="Imagem salva nesta versão"
                                  maxWidth={640}
                                  className="mb-2 max-h-48 max-w-full rounded-lg object-contain"
                                />
                              )}
                              <PreviewValue value={value} />
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </article>
                ))}
            </>
          )}
        </div>
        <footer className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-verde-medio/20 bg-white p-4">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-full border border-verde-medio/30 px-4 py-2 text-sm disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={busy || dirty || sections === null || Boolean(error)}
            onClick={onConfirm}
            className="rounded-full bg-verde-principal px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {busy ? "Restaurando..." : "Confirmar restauração"}
          </button>
        </footer>
      </div>
    </dialog>
  );
}
