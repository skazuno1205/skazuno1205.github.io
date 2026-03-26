import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PastProject } from "../../../../model/portfolioData";
import {
  TrollTowerBattleProjectCard,
  clamp,
  createArenaObserver,
  createTrollBody,
  createTrollBodyId,
  getPrefersReducedMotion,
  getTrollSpawnContext,
  simulateTrollBodies,
  trollImageSources,
} from "../TrollTowerBattleProjectCard";

const trollProject: PastProject = {
  ctaLabel: "PLAY GAME",
  description: "ブラウザで遊べる個人制作ゲーム。",
  eyebrow: "PLAYABLE PROJECT",
  href: "https://example.com/troll",
  imageAlt: "トロールタワーバトルのゲーム画面",
  imageSrc: "/images/projects/troll-tower-battle.png",
  subtitle: "ブラウザゲーム",
  title: "トロールタワーバトル",
};

let intersectionObserverCallback:
  | ((entries: IntersectionObserverEntry[]) => void)
  | undefined;
let disconnectMock = vi.fn();
let requestAnimationFrameCallback: ((timestamp: number) => void) | undefined;

class IntersectionObserverMock {
  constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
    intersectionObserverCallback = callback;
  }

  observe = vi.fn();
  disconnect = disconnectMock;
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
}

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  });
}

beforeEach(() => {
  disconnectMock = vi.fn();
  intersectionObserverCallback = undefined;
  requestAnimationFrameCallback = undefined;
  vi.useFakeTimers();

  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    value: IntersectionObserverMock,
  });
  Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
    configurable: true,
    value: vi.fn(function getBoundingClientRect(this: HTMLElement) {
      if (this.dataset.testid === "troll-stack-arena") {
        return {
          bottom: 180,
          height: 180,
          left: 0,
          right: 420,
          top: 0,
          width: 420,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        };
      }

      return {
        bottom: 170,
        height: 54,
        left: 0,
        right: 320,
        top: 116,
        width: 320,
        x: 0,
        y: 116,
        toJSON: () => ({}),
      };
    }),
  });
  window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    requestAnimationFrameCallback = callback;
    return 99;
  });
  window.cancelAnimationFrame = vi.fn();
  mockMatchMedia(false);
});

afterEach(() => {
  cleanup();
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("TrollTowerBattleProjectCard", () => {
  it("renders the card content and best score", () => {
    render(
      <TrollTowerBattleProjectCard
        project={trollProject}
        trollTowerBattleBest="BEST 3200"
      />,
    );

    expect(
      screen.getByRole("button", { name: "トロールタワーバトル" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "PLAY GAME" })).toHaveAttribute(
      "href",
      trollProject.href,
    );
    expect(screen.getByText("BEST 3200")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "トロールタワーバトルのゲーム画面" }),
    ).toBeInTheDocument();
  });

  it("spawns a reduced-motion troll without starting the animation loop", () => {
    mockMatchMedia(true);

    render(
      <TrollTowerBattleProjectCard
        project={trollProject}
        trollTowerBattleBest="BEST --"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "トロールタワーバトル" }),
    );

    const arena = screen.getByTestId("troll-stack-arena");

    expect(arena.querySelectorAll("img")).toHaveLength(1);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("starts and cleans up the animation loop for a visible card", () => {
    const { unmount } = render(
      <TrollTowerBattleProjectCard
        project={trollProject}
        trollTowerBattleBest="BEST --"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "トロールタワーバトル" }),
    );

    expect(window.requestAnimationFrame).toHaveBeenCalled();
    requestAnimationFrameCallback?.(16.67);

    expect(
      screen.getByTestId("troll-stack-arena").querySelectorAll("img").length,
    ).toBeGreaterThan(0);

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(99);
  });

  it("does not start the animation loop when the card is out of view", () => {
    render(
      <TrollTowerBattleProjectCard
        project={trollProject}
        trollTowerBattleBest="BEST --"
      />,
    );

    intersectionObserverCallback?.([
      { isIntersecting: false } as IntersectionObserverEntry,
    ]);

    fireEvent.click(
      screen.getByRole("button", { name: "トロールタワーバトル" }),
    );

    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(
      screen.getByTestId("troll-stack-arena").querySelectorAll("img"),
    ).toHaveLength(1);
  });

  it("removes each spawned troll automatically after a short delay", () => {
    render(
      <TrollTowerBattleProjectCard
        project={trollProject}
        trollTowerBattleBest="BEST --"
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "トロールタワーバトル",
    });
    const arena = screen.getByTestId("troll-stack-arena");

    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(arena.querySelectorAll("img")).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(3200);
    });

    expect(arena.querySelectorAll("img")).toHaveLength(0);
  });

  it("gracefully skips observer and spawn work when browser globals are unavailable", () => {
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: undefined,
    });

    const currentWindow = globalThis.window;
    render(
      <TrollTowerBattleProjectCard
        project={trollProject}
        trollTowerBattleBest="BEST --"
      />,
    );

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: undefined,
    });

    fireEvent.click(
      screen.getByRole("button", { name: "トロールタワーバトル" }),
    );

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: currentWindow,
    });

    expect(
      screen.getByTestId("troll-stack-arena").querySelectorAll("img"),
    ).toHaveLength(0);
  });

  it("stops simulation when animation runs after unmount", () => {
    const { unmount } = render(
      <TrollTowerBattleProjectCard
        project={trollProject}
        trollTowerBattleBest="BEST --"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "トロールタワーバトル" }),
    );

    unmount();
    requestAnimationFrameCallback?.(16.67);

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(99);
  });

  it("covers the helper utilities and physics branches", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.75)
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.3);

    const reducedBody = createTrollBody(420, 120, true, 5);
    const movingBody = createTrollBody(420, 120, false, 0);

    expect(reducedBody.settled).toBe(true);
    expect(reducedBody.src).toBe(trollImageSources[0]);
    expect(movingBody.settled).toBe(false);
    expect(movingBody.y).toBeLessThan(0);

    const simulatedBodies = simulateTrollBodies(
      [
        {
          ...movingBody,
          size: 60,
          vx: -2,
          vy: 1,
          x: 10,
          y: 110,
        },
        {
          ...movingBody,
          angularVelocity: 0.2,
          id: "other-body",
          size: 60,
          vx: 0,
          vy: 0,
          x: 35,
          y: 110,
        },
        {
          ...movingBody,
          id: "filtered-body",
          x: 100,
          y: 999,
        },
      ],
      120,
      160,
      120,
      1,
    );

    expect(simulatedBodies).toHaveLength(2);
    expect(simulatedBodies[0]?.x).toBeGreaterThanOrEqual(0);
    expect(simulatedBodies[0]?.y).toBeLessThanOrEqual(90);
    expect(clamp(12, 20, 30)).toBe(20);
    expect(clamp(28, 20, 30)).toBe(28);
    expect(clamp(32, 20, 30)).toBe(30);
    expect(createTrollBodyId("drop", "/images/troll/troll_01.png")).toContain(
      "drop-/images/troll/troll_01.png-",
    );
  });

  it("handles observer and spawn helpers without browser dependencies", () => {
    const onVisibleChange = vi.fn();
    const observe = vi.fn();
    const disconnect = vi.fn();
    const cleanupObserver = createArenaObserver(
      null,
      onVisibleChange,
      undefined,
    );
    const createdObserverCleanup = createArenaObserver(
      document.createElement("div"),
      onVisibleChange,
      class {
        constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
          callback([{ isIntersecting: false } as IntersectionObserverEntry]);
        }

        disconnect = disconnect;
        observe = observe;
      } as unknown as typeof IntersectionObserver,
    );

    expect(cleanupObserver).toBeUndefined();
    expect(onVisibleChange).toHaveBeenCalledWith(false);
    expect(observe).toHaveBeenCalled();

    createdObserverCleanup?.();

    expect(disconnect).toHaveBeenCalled();
    expect(getTrollSpawnContext(null, null, undefined)).toBeUndefined();
  });

  it("covers the remaining physics branches for right-wall and no-overlap cases", () => {
    const body = createTrollBody(420, 120, false, 0);
    const simulatedBodies = simulateTrollBodies(
      [
        {
          ...body,
          size: 60,
          vx: 2,
          x: 118,
          y: 40,
        },
        {
          ...body,
          id: "far-away-body",
          size: 42,
          vx: 0,
          x: 10,
          y: 10,
        },
      ],
      120,
      160,
      120,
      1,
    );

    expect(simulatedBodies[0]?.x).toBeLessThanOrEqual(90);
    expect(simulatedBodies[1]?.id).toBe("far-away-body");
  });

  it("covers settled animation cleanup, image-less cards, and troll image fallback", () => {
    const requestAnimationFrameMock = vi.fn(
      (callback: FrameRequestCallback) => {
        requestAnimationFrameCallback = callback;
        return 42;
      },
    );
    window.requestAnimationFrame = requestAnimationFrameMock;

    const projectWithoutImage: PastProject = {
      ...trollProject,
      imageSrc: undefined,
    };
    const { rerender } = render(
      <TrollTowerBattleProjectCard
        project={projectWithoutImage}
        trollTowerBattleBest="BEST --"
      />,
    );

    expect(
      screen.queryByRole("img", { name: "トロールタワーバトルのゲーム画面" }),
    ).not.toBeInTheDocument();

    rerender(
      <TrollTowerBattleProjectCard
        project={trollProject}
        trollTowerBattleBest="BEST --"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "トロールタワーバトル" }),
    );

    for (let step = 1; step <= 60; step += 1) {
      requestAnimationFrameCallback?.(step * 16.67);
    }

    expect(requestAnimationFrameMock).toHaveBeenCalled();

    vi.spyOn(Math, "random").mockReturnValue(Number.NaN);

    expect(createTrollBody(420, 120, false, 0).src).toBe(trollImageSources[0]);
  });

  it("reads reduced motion preference safely", () => {
    mockMatchMedia(true);
    expect(getPrefersReducedMotion()).toBe(true);

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: undefined,
    });
    expect(getPrefersReducedMotion()).toBe(false);
  });
});
