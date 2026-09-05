export type ProjectEnterMode = "grid" | "adjacent";

export type ProjectEnterRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const MODE_KEY = "project-enter-mode";
const RECT_KEY = "project-enter-rect";

export function setProjectEnterAdjacent() {
  sessionStorage.setItem(MODE_KEY, "adjacent");
  sessionStorage.removeItem(RECT_KEY);
}

export function setProjectEnterFromGrid(rect: DOMRectReadOnly) {
  sessionStorage.setItem(MODE_KEY, "grid");
  sessionStorage.setItem(
    RECT_KEY,
    JSON.stringify({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    }),
  );
}

export function peekProjectEnter():
  | { mode: ProjectEnterMode; rect?: ProjectEnterRect }
  | null {
  if (typeof window === "undefined") return null;

  const mode = sessionStorage.getItem(MODE_KEY) as ProjectEnterMode | null;
  if (mode !== "grid" && mode !== "adjacent") return null;

  if (mode === "adjacent") return { mode };

  const raw = sessionStorage.getItem(RECT_KEY);
  if (!raw) return { mode };

  try {
    return { mode, rect: JSON.parse(raw) as ProjectEnterRect };
  } catch {
    return { mode };
  }
}

export function consumeProjectEnter():
  | { mode: ProjectEnterMode; rect?: ProjectEnterRect }
  | null {
  const data = peekProjectEnter();
  sessionStorage.removeItem(MODE_KEY);
  sessionStorage.removeItem(RECT_KEY);
  return data;
}
