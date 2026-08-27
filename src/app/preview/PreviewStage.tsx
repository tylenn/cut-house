"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { InfoOverlay } from "@/components/InfoOverlay";
import { Intro } from "@/components/Intro";
import { Rail } from "@/components/Rail";

const NAME = "cut house";
const TAGLINE = "a global production services company";

const FIXTURES = [
  { src: "/preview/a.jpg", title: "curves at home", roles: "editor, colorist" },
  { src: "/preview/b.jpg", title: "mandy's falloween", roles: "director, editor" },
  { src: "/preview/c.jpg", title: "summer minute", roles: "director of photography, editor" },
  { src: "/preview/d.jpg", title: "sony & daytimers", roles: "director of photography, editor" },
  { src: "/preview/e.jpg", title: "curves, home/wear", roles: "director of photography, editor" },
  { src: "/preview/f.jpg", title: "finn wolfhard, tad", roles: "behind the scenes" },
];

const CLIENTS = [
  "Ben Key (New West 199X)", "Crave", "Curves by Sean Brown",
  "Dine Alone Records", "Finn Wolfhard", "Harry Rosen", "Salomon",
  "Slushy Noobz", "Sony Music Group", "Tridel", "Turo",
];

export function PreviewStage() {
  const params = useSearchParams();
  // ?slow=4 stretches the intro 4x so each beat can be watched.
  const speed = 1 / Math.max(1, Number(params.get("slow") ?? 1));
  const [info, setInfo] = useState(false);
  const [run, setRun] = useState(0);

  return (
    <>
      {/* Remounting on a new key replays the intro without a page reload. */}
      <Intro key={run} name={NAME} tagline={TAGLINE} speed={speed} />

      <div className="fixed right-3 bottom-3 z-40 flex gap-2 text-(length:--text-meta)">
        <button
          type="button"
          onClick={() => {
            document.cookie = "ch_intro=; path=/; max-age=0";
            setRun((n) => n + 1);
          }}
          className="rounded-[2px] bg-(--color-ink) px-2 py-1 text-(--color-page)"
        >
          replay intro
        </button>
        <button
          type="button"
          onClick={() => setInfo((v) => !v)}
          className="rounded-[2px] bg-(--color-ink) px-2 py-1 text-(--color-page)"
        >
          {info ? "close info" : "open info"}
        </button>
      </div>

      <div className="md:flex md:min-h-screen">
        <Rail name={NAME} tagline="cinematographer, editor" />

        <main className="relative min-w-0 flex-1 md:py-4">
          <div className="grid grid-cols-1 gap-x-(--spacing-gutter) md:grid-cols-2">
            {FIXTURES.map((item, i) => (
              <div
                key={item.src}
                className="stagger-child group block"
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="relative aspect-video overflow-hidden bg-(--color-rule)">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover:scale-[1.02]"
                  />
                </div>
                <div className="px-(--spacing-edge) pt-1.5 pb-5 md:px-0">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-(--color-ink-muted) transition-colors duration-(--duration-fast) group-hover:text-(--color-ink)">
                    {item.roles}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {info ? (
            <InfoOverlay>
              <div className="max-w-[68ch]">
                <section className="mb-8">
                  <h2 className="font-semibold">Contact</h2>
                  <span className="block text-(--color-ink-muted)">info@cuthouse.ca</span>
                  <span className="block">Available globally.</span>
                </section>
                <section className="mb-8">
                  <h2 className="font-semibold">Application</h2>
                  <p>Full client list and commercial portfolio available upon request.</p>
                </section>
                <section className="mb-8">
                  <h2 className="mb-1 font-semibold">Description</h2>
                  <p className="mb-4">
                    Tylen is a cinematographer &amp; editor who delivers creative
                    visuals rooted in purpose-driven storytelling. Combining his
                    academic background in advertising and cinematography, he blends
                    the intersection between thoughtful compositions with a distinct
                    visual language.
                  </p>
                </section>
                <section>
                  <h2 className="mb-1 font-semibold">Clients</h2>
                  <ul>
                    {CLIENTS.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </InfoOverlay>
          ) : null}
        </main>
      </div>
    </>
  );
}
