import { Card, Eyebrow, Skeleton } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/primitives";

export type Section = { title: string; note?: string; kind?: "list" | "form" | "stat" | "block" };

/**
 * Esqueleto estruturado de tela: cabeçalho real + seções planejadas
 * renderizadas como skeletons com a forma esperada do conteúdo.
 */
export function ScreenSkeleton({
  eyebrow,
  title,
  description,
  rules,
  stage,
  sections,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  rules?: string[];
  stage: number;
  sections: Section[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-[32px] font-semibold md:text-[40px]">{title}</h1>
          {description && <p className="prose-width text-fg-2">{description}</p>}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge>Etapa {stage}</Badge>
            {rules?.map((r) => <Badge key={r}>{r}</Badge>)}
          </div>
        </div>
        {actions}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.title} className={s.kind === "list" || s.kind === "form" ? "p-6 md:col-span-2" : "p-6"}>
            <h2 className="text-[17px] font-semibold">{s.title}</h2>
            {s.note && <p className="mt-1 text-sm text-fg-2">{s.note}</p>}
            <div className="mt-5 space-y-3">
              {s.kind === "stat" && <Skeleton className="h-10 w-32" />}
              {s.kind === "form" &&
                [0, 1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-12 w-full rounded-[10px]" />
                  </div>
                ))}
              {s.kind === "list" &&
                [0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-[12px] border border-line p-4">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              {(!s.kind || s.kind === "block") && (
                <>
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-4/5" />
                  <Skeleton className="h-3.5 w-2/3" />
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
