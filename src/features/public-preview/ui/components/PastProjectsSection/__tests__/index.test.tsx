import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  PastProjectsSection,
  catImageSources,
  createSpaceCatSprite,
  createSpaceCatSprites,
  readTrollTowerBattleBest,
} from "..";

describe("PastProjectsSection", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders archive cards and toggles the more button label", () => {
    render(
      <PastProjectsSection
        onPreviewImage={vi.fn()}
        onToggleShowAll={vi.fn()}
        showAll={false}
      />,
    );

    expect(
      screen.getByRole("button", { name: "SCROLL TO CONTINUE" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "CLOSE ARCHIVE" }),
    ).not.toBeInTheDocument();
  });

  it("shows the close archive label when all projects are visible", () => {
    render(
      <PastProjectsSection
        onPreviewImage={vi.fn()}
        onToggleShowAll={vi.fn()}
        showAll
      />,
    );

    expect(
      screen.getByRole("button", { name: "CLOSE ARCHIVE" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "思い出再生フォトフレーム" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "月面ビデオディスプレイ" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "VFcom" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "推し活ディスプレイキーホルダー" }),
    ).toBeInTheDocument();
  });

  it("reads best score, opens image previews, and removes summoned cats after animation", async () => {
    window.localStorage.setItem("trollTowerBattleBest", "1450.8");
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation(() => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
    const onPreviewImage = vi.fn();

    render(
      <PastProjectsSection
        onPreviewImage={onPreviewImage}
        onToggleShowAll={vi.fn()}
        showAll={false}
      />,
    );

    expect(screen.getByText("BEST 1450")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "VIEW WORK" })[0]);

    expect(onPreviewImage).toHaveBeenCalledWith({
      alt: "メモリアルタイムスリップの表示イメージ",
      src: "/images/projects/memorial-time-slip.png",
    });

    fireEvent.click(screen.getByRole("button", { name: "宇宙猫召喚装置" }));

    const summonedCat = document.querySelector(
      'img[src^="/images/cat/cat_"]',
    ) as HTMLImageElement | null;

    expect(summonedCat).not.toBeNull();

    if (summonedCat) {
      fireEvent.animationEnd(summonedCat);
    }

    await waitFor(() => {
      expect(
        document.querySelector('img[src^="/images/cat/cat_"]'),
      ).not.toBeInTheDocument();
    });
  });

  it("falls back to BEST -- for invalid scores", () => {
    window.localStorage.setItem("trollTowerBattleBest", "-10");

    render(
      <PastProjectsSection
        onPreviewImage={vi.fn()}
        onToggleShowAll={vi.fn()}
        showAll={false}
      />,
    );

    expect(screen.getAllByText("BEST --")[0]).toBeInTheDocument();
  });

  it("builds a cat sprite even when random image selection falls back", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(Number.NaN)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const sprite = createSpaceCatSprite(2);

    expect(catImageSources).toContain(sprite.src);
    expect(sprite.id).toContain("space-cat-");
  });

  it("returns safe fallbacks for missing browser globals", () => {
    expect(readTrollTowerBattleBest(undefined)).toBe("BEST --");
    expect(createSpaceCatSprites(undefined)).toEqual([]);
  });

  it("covers all cat flight paths and summon count branches", () => {
    const animationClasses = new Set<string>();

    for (let directionIndex = 0; directionIndex < 6; directionIndex += 1) {
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(directionIndex / 6)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0);

      animationClasses.add(
        createSpaceCatSprite(directionIndex).animationClassName,
      );
      vi.restoreAllMocks();
    }

    const reducedMotionWindow = {
      innerWidth: 390,
      matchMedia: vi.fn(() => ({ matches: true })),
    } as unknown as Window;
    const defaultWindow = {
      innerWidth: 1280,
      matchMedia: vi.fn(() => ({ matches: false })),
    } as unknown as Window;

    vi.spyOn(Math, "random").mockReturnValue(0.6);

    expect(animationClasses.size).toBe(6);
    expect(createSpaceCatSprites(reducedMotionWindow)).toHaveLength(1);
    expect(createSpaceCatSprites(defaultWindow)).toHaveLength(2);
  });
});
