"use client";

import { useState } from "react";

import { InfoOverlay } from "@/components/InfoOverlay";
import { Rail } from "@/components/Rail";

const NAME = "cut house";

const FIXTURES = [
  { title: "curves at home", roles: "editor, colorist" },
  { title: "mandy's falloween", roles: "director, editor" },
  { title: "summer minute", roles: "director of photography, editor" },
  { title: "sony & daytimers", roles: "director of photography, editor" },
  { title: "curves, home/wear", roles: "director of photography, editor" },
  { title: "finn wolfhard, tad", roles: "behind the scenes" },
  { title: "turo landing", roles: "director, editor" },
  { title: "salomon winter", roles: "director of photography" },
  { title: "harry rosen", roles: "editor, colorist" },
  { title: "slushy noobz", roles: "director, editor" },
  { title: "new west 199x", roles: "director of photography, editor" },
  { title: "dine alone", roles: "editor" },
  { title: "tridel", roles: "colorist" },
  { title: "crave", roles: "director of photography" },
  { title: "sony recut", roles: "editor, colorist" },
  { title: "curves reprise", roles: "director, editor" },
];

const CLIENTS = [
  "Ben Key (New West 199X)", "Crave", "Curves by Sean Brown",
  "Dine Alone Records", "Finn Wolfhard", "Harry Rosen", "Salomon",
  "Slushy Noobz", "Sony Music Group", "Tridel", "Turo",
];

export function PreviewStage() {
  const [info, setInfo] = useState(false);

  return (
    <>
      <div className="fixed right-3 bottom-3 z-40 flex gap-2 text-(length:--text-meta)">
        <button
          type="button"
          onClick={() => setInfo((v) => !v)}
          className="rounded-[2px] bg-(--color-ink) px-2 py-1 text-(--color-page)"
        >
          {info ? "close info" : "open info"}
        </button>
      </div>

      <div className="md:flex md:min-h-screen">
        <Rail name={NAME} />

        <main className="relative min-w-0 flex-1 md:px-(--spacing-edge) md:py-5.5">
          <div className="grid grid-cols-1 gap-x-(--spacing-gutter) md:grid-cols-2">
            {FIXTURES.map((item, i) => (
              <div
                key={item.title}
                className="stagger-child group block"
                style={{ "--i": i } as React.CSSProperties}
              >
                {/* A flat tone, not a still. The real grid runs Mux loops through
                    ProjectMedia; standing in with imagery here invites notes on
                    photography that is not the thing being designed. */}
                <div className="aspect-video bg-(--color-rule)" />
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
              <div className="animate-info-content-in max-w-[68ch]">
                <section className="mb-8">
                  <h2 className="font-semibold">Contact</h2>
                  <span className="block text-(--color-ink-muted)">info@tylen.ca</span>
                  <p>Available globally.</p>
                </section>
                <section className="mb-8">
                  <h2 className="font-semibold">Application</h2>
                  <p>Full client list and commercial portfolio available upon request.</p>
                </section>
                <section className="mb-8">
                  <h2 className="font-semibold">Description</h2>
                  <p>
                    Tylen is a cinematographer &amp; editor who delivers creative
                    visuals rooted in purpose-driven storytelling. Combining his
                    academic background in advertising and cinematography, he
                    blends the intersection between thoughtful compositions with
                    a distinct visual language.
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
