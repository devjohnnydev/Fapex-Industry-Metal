const BASE = "/api";

export async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts?.headers },
    ...opts,
  });
  return res;
}

export async function apiJson<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await apiFetch(path, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erro desconhecido" }));
    throw new Error((err as any).error ?? "Erro na requisição");
  }
  return res.json() as Promise<T>;
}
