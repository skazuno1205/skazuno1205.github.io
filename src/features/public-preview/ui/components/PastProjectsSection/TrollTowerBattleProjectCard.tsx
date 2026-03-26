import { useEffect, useRef, useState } from "react";

import type { PastProject } from "../../../model/portfolioData";
import { cn } from "../../utils/cn";
import baseStyles from "../PortfolioBase.module.css";
import styles from "./PastProjectsSection.module.css";

type TrollBody = {
  angularVelocity: number;
  id: string;
  rotation: number;
  settled: boolean;
  size: number;
  src: string;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

type TrollTowerBattleProjectCardProps = {
  project: PastProject;
  trollTowerBattleBest: string;
};

const TROLL_LIFETIME_MS = 3200;

export const trollImageSources = [
  "/images/troll/troll_01.png",
  "/images/troll/troll_02.png",
  "/images/troll/troll_03.png",
  "/images/troll/troll_04.png",
  "/images/troll/troll_05.png",
  "/images/troll/troll_06.png",
  "/images/troll/troll_07.png",
  "/images/troll/troll_08.png",
  "/images/troll/troll_09.png",
  "/images/troll/troll_10.png",
  "/images/troll/troll_11.png",
  "/images/troll/troll_12.png",
  "/images/troll/troll_13.png",
  "/images/troll/troll_14.png",
  "/images/troll/troll_15.png",
  "/images/troll/troll_16.png",
  "/images/troll/troll_17.png",
  "/images/troll/troll_18.png",
  "/images/troll/troll_19.png",
  "/images/troll/troll_20.png",
  "/images/troll/troll_21.png",
  "/images/troll/troll_22.png",
  "/images/troll/troll_23.png",
  "/images/troll/troll_24.png",
  "/images/troll/troll_25.png",
] as const;

export function createArenaObserver(
  arenaElement: HTMLDivElement | null,
  onVisibleChange: (visible: boolean) => void,
  ObserverClass:
    | typeof IntersectionObserver
    | undefined = typeof IntersectionObserver === "undefined"
    ? undefined
    : IntersectionObserver,
) {
  if (!arenaElement || !ObserverClass) {
    return;
  }

  const observer = new ObserverClass(([entry]) => {
    onVisibleChange(entry?.isIntersecting ?? true);
  });

  observer.observe(arenaElement);

  return () => observer.disconnect();
}

export function getTrollSpawnContext(
  arenaElement: HTMLDivElement | null,
  actionFloorElement: HTMLDivElement | null,
  currentWindow: Window | undefined,
) {
  if (!arenaElement || !actionFloorElement || !currentWindow) {
    return;
  }

  const arenaBounds = arenaElement.getBoundingClientRect();
  const floorBounds = actionFloorElement.getBoundingClientRect();

  return {
    arenaBounds,
    floorY: floorBounds.top - arenaBounds.top - 8,
    maxBodies: arenaBounds.width < 520 ? 8 : 12,
  };
}

export function TrollTowerBattleProjectCard({
  project,
  trollTowerBattleBest,
}: TrollTowerBattleProjectCardProps) {
  const [trollBodies, setTrollBodies] = useState<TrollBody[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const actionFloorRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const trollBodiesRef = useRef<TrollBody[]>([]);
  const removalTimeoutsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    trollBodiesRef.current = trollBodies;
  }, [trollBodies]);

  useEffect(() => {
    return createArenaObserver(arenaRef.current, setIsVisible);
  }, []);

  useEffect(() => {
    if (!isVisible || !isSimulating || getPrefersReducedMotion()) {
      return;
    }

    const step = (timestamp: number) => {
      const arenaElement = arenaRef.current;
      const actionFloorElement = actionFloorRef.current;

      if (!arenaElement || !actionFloorElement) {
        setIsSimulating(false);
        return;
      }

      const arenaBounds = arenaElement.getBoundingClientRect();
      const floorBounds = actionFloorElement.getBoundingClientRect();
      const deltaMs = Math.min(
        timestamp - (lastTimestampRef.current ?? timestamp),
        24,
      );
      const frameFactor = Math.max(deltaMs, 16.67) / 16.67;
      const floorY = floorBounds.top - arenaBounds.top - 8;
      const nextBodies = simulateTrollBodies(
        trollBodiesRef.current,
        arenaBounds.width,
        arenaBounds.height,
        floorY,
        frameFactor,
      );

      trollBodiesRef.current = nextBodies;
      setTrollBodies(nextBodies);
      lastTimestampRef.current = timestamp;

      if (nextBodies.some((body) => !body.settled)) {
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      setIsSimulating(false);
      lastTimestampRef.current = null;
    };

    animationFrameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSimulating, isVisible]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      for (const timeoutId of removalTimeoutsRef.current.values()) {
        window.clearTimeout(timeoutId);
      }

      removalTimeoutsRef.current.clear();
    };
  }, []);

  const removeTrollBody = (bodyId: string) => {
    const timeoutId = removalTimeoutsRef.current.get(bodyId);

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      removalTimeoutsRef.current.delete(bodyId);
    }

    const nextBodies = trollBodiesRef.current.filter(
      (body) => body.id !== bodyId,
    );

    trollBodiesRef.current = nextBodies;
    setTrollBodies(nextBodies);

    if (nextBodies.every((body) => body.settled)) {
      setIsSimulating(false);
      lastTimestampRef.current = null;
    }
  };

  const spawnTroll = () => {
    const spawnContext = getTrollSpawnContext(
      arenaRef.current,
      actionFloorRef.current,
      typeof window === "undefined" ? undefined : window,
    );

    if (!spawnContext) {
      return;
    }

    const nextBody = createTrollBody(
      spawnContext.arenaBounds.width,
      spawnContext.floorY,
      getPrefersReducedMotion(),
      trollBodiesRef.current.length,
    );
    const previousBodies = trollBodiesRef.current;
    const nextBodies = [...previousBodies, nextBody].slice(
      -spawnContext.maxBodies,
    );

    trollBodiesRef.current = nextBodies;
    setTrollBodies(nextBodies);

    const overflowBodyIds = previousBodies
      .filter((body) => !nextBodies.some((nextBody) => nextBody.id === body.id))
      .map((body) => body.id);

    for (const bodyId of overflowBodyIds) {
      const timeoutId = removalTimeoutsRef.current.get(bodyId);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
        removalTimeoutsRef.current.delete(bodyId);
      }
    }

    removalTimeoutsRef.current.set(
      nextBody.id,
      window.setTimeout(() => {
        removeTrollBody(nextBody.id);
      }, TROLL_LIFETIME_MS),
    );

    if (getPrefersReducedMotion()) {
      return;
    }

    setIsSimulating(true);
    lastTimestampRef.current = null;
  };

  return (
    <article
      className={cn(styles.projectCard, baseStyles.panel, baseStyles.reveal)}
    >
      {project.imageSrc ? (
        <div className={styles.projectCardMedia}>
          <img
            alt={project.imageAlt ?? project.title}
            className={styles.projectCardImage}
            loading="lazy"
            src={project.imageSrc}
          />
        </div>
      ) : null}
      <div className={styles.projectCardContent}>
        <div className={styles.projectCardBody}>
          <p className={baseStyles.sectionHeadingEyebrow}>{project.eyebrow}</p>
          <h3>
            <button
              className={styles.projectTitleTrigger}
              onClick={spawnTroll}
              type="button"
            >
              {project.title}
            </button>
          </h3>
          <p className={styles.projectCardSubtitle}>{project.subtitle}</p>
          <p className={styles.projectCardDescription}>{project.description}</p>
        </div>

        <div className={styles.projectActionsWrap} ref={arenaRef}>
          <div
            className={styles.trollDropArena}
            data-testid="troll-stack-arena"
          >
            {trollBodies.map((body) => (
              <img
                key={body.id}
                alt=""
                aria-hidden="true"
                className={styles.trollDropSprite}
                src={body.src}
                style={{
                  height: `${body.size}px`,
                  transform: `translate(${body.x - body.size / 2}px, ${
                    body.y - body.size / 2
                  }px) rotate(${body.rotation}deg)`,
                  width: `${body.size}px`,
                }}
              />
            ))}
          </div>

          <div className={styles.projectActionsFloor} ref={actionFloorRef}>
            <div className={styles.projectActions}>
              <a
                className={cn(baseStyles.pixelBtn, styles.projectAction)}
                href={project.href}
                rel="noreferrer"
                target="_blank"
              >
                {project.ctaLabel}
              </a>
              <span className={styles.projectBestScore}>
                {trollTowerBattleBest}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function createTrollBody(
  arenaWidth: number,
  floorY: number,
  prefersReducedMotion: boolean,
  stackIndex: number,
): TrollBody {
  const trollImageSrc =
    trollImageSources[Math.floor(Math.random() * trollImageSources.length)] ??
    trollImageSources[0];
  const size = clamp(arenaWidth * 0.12, 42, 70);

  if (prefersReducedMotion) {
    const column = stackIndex % 4;
    const layer = Math.floor(stackIndex / 4);

    return {
      angularVelocity: 0,
      id: createTrollBodyId("static", trollImageSrc),
      rotation: -8 + column * 5,
      settled: true,
      size,
      src: trollImageSrc,
      vx: 0,
      vy: 0,
      x: clamp(
        size * 0.7 + column * (size * 0.82),
        size / 2,
        arenaWidth - size / 2,
      ),
      y: floorY - size / 2 - layer * (size * 0.72),
    };
  }

  return {
    angularVelocity: (Math.random() - 0.5) * 1.6,
    id: createTrollBodyId("drop", trollImageSrc),
    rotation: -12 + Math.random() * 24,
    settled: false,
    size,
    src: trollImageSrc,
    vx: (Math.random() - 0.5) * 1.8,
    vy: 0,
    x: clamp(
      size / 2 + 12 + Math.random() * (arenaWidth - size - 24),
      size / 2,
      arenaWidth - size / 2,
    ),
    y: -size,
  };
}

export function simulateTrollBodies(
  currentBodies: TrollBody[],
  arenaWidth: number,
  arenaHeight: number,
  floorY: number,
  frameFactor: number,
) {
  const nextBodies = currentBodies
    .map((body) => ({ ...body, settled: false }))
    .filter((body) => body.y - body.size / 2 < arenaHeight + 120);

  for (const body of nextBodies) {
    body.vy += 0.28 * frameFactor;
    body.x += body.vx * frameFactor;
    body.y += body.vy * frameFactor;
    body.rotation += body.angularVelocity * frameFactor;
    body.vx *= 0.992;
    body.angularVelocity *= 0.992;

    const radius = body.size / 2;

    if (body.x - radius < 0) {
      body.x = radius;
      body.vx = Math.abs(body.vx) * 0.42;
    }

    if (body.x + radius > arenaWidth) {
      body.x = arenaWidth - radius;
      body.vx = -Math.abs(body.vx) * 0.42;
    }

    if (body.y + radius > floorY) {
      body.y = floorY - radius;
      body.vy = -Math.abs(body.vy) * 0.16;
      body.vx *= 0.92;
      body.angularVelocity *= 0.9;
    }
  }

  for (let index = 0; index < nextBodies.length; index += 1) {
    const currentBody = nextBodies[index];

    for (
      let comparisonIndex = index + 1;
      comparisonIndex < nextBodies.length;
      comparisonIndex += 1
    ) {
      const comparisonBody = nextBodies[comparisonIndex];
      const dx = comparisonBody.x - currentBody.x;
      const dy = comparisonBody.y - currentBody.y;
      const distance = Math.hypot(dx, dy) || 0.001;
      const minDistance = (currentBody.size + comparisonBody.size) * 0.42;

      if (distance >= minDistance) {
        continue;
      }

      const overlap = minDistance - distance;
      const nx = dx / distance;
      const ny = dy / distance;

      currentBody.x -= nx * overlap * 0.5;
      currentBody.y -= ny * overlap * 0.5;
      comparisonBody.x += nx * overlap * 0.5;
      comparisonBody.y += ny * overlap * 0.5;

      const relativeVelocityX = comparisonBody.vx - currentBody.vx;
      const relativeVelocityY = comparisonBody.vy - currentBody.vy;
      const velocityAlongNormal =
        relativeVelocityX * nx + relativeVelocityY * ny;

      if (velocityAlongNormal < 0) {
        const impulse = velocityAlongNormal * -0.18;

        currentBody.vx -= impulse * nx;
        currentBody.vy -= impulse * ny;
        comparisonBody.vx += impulse * nx;
        comparisonBody.vy += impulse * ny;
      }
    }
  }

  return nextBodies.map((body) => {
    const resting =
      Math.abs(body.vx) < 0.18 &&
      Math.abs(body.vy) < 0.22 &&
      body.y + body.size / 2 >= floorY - 12;

    return {
      ...body,
      angularVelocity: resting
        ? body.angularVelocity * 0.8
        : body.angularVelocity,
      settled: resting,
      vx: resting ? body.vx * 0.8 : body.vx,
      vy: resting ? 0 : body.vy,
    };
  });
}

export function getPrefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function createTrollBodyId(prefix: string, trollImageSrc: string) {
  return `${prefix}-${trollImageSrc}-${Math.round(Date.now() + Math.random() * 10000)}`;
}
