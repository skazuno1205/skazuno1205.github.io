import type { SkyColorSlot } from "./portfolioData";

export type SkyLotteryPeg = {
  x: number;
  y: number;
  radius: number;
};

export type SkyLotterySlotBound = {
  left: number;
  right: number;
  center: number;
};

export type SkyLotteryBoard = {
  width: number;
  height: number;
  leftWall: number;
  rightWall: number;
  floorY: number;
  slotTop: number;
  spawnY: number;
  ballRadius: number;
  pegRadius: number;
  dividerWidth: number;
  gravity: number;
  airDrag: number;
  centerPull: number;
  pegRestitution: number;
  wallRestitution: number;
  floorRestitution: number;
  slotLabelFontSize: number;
  slotLabelOffset: number;
  pegs: SkyLotteryPeg[];
  slotBounds: SkyLotterySlotBound[];
};

export type SkyLotteryBall = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  settled: boolean;
  slotIndex: number;
  stableFrames: number;
};

const SKY_ROWS = 11;
const DEFAULT_PEG_RESTITUTION = 0.58;
const DEFAULT_WALL_RESTITUTION = 0.5;
const DEFAULT_FLOOR_RESTITUTION = 0.16;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function createSkyLotteryBoard(
  width: number,
  height: number,
): SkyLotteryBoard {
  const safeWidth = Math.max(320, Math.floor(width));
  const safeHeight = Math.max(320, Math.floor(height));
  const marginX = clamp(safeWidth * 0.065, 18, 40);
  const topY = clamp(safeHeight * 0.17, 56, 78);
  const bottomY = safeHeight - clamp(safeHeight * 0.28, 104, 122);
  const rowSpacingY = (bottomY - topY) / SKY_ROWS;
  const spacingX = (safeWidth - marginX * 2) / (SKY_ROWS + 1);
  const scaleUnit = Math.min(spacingX, rowSpacingY);
  const ballRadius = clamp(scaleUnit * 0.28, 5.4, 8.4);
  const pegRadius = clamp(scaleUnit * 0.17, 3.2, 5.4);
  const slotTop =
    topY + SKY_ROWS * rowSpacingY + Math.max(ballRadius * 1.4, 12);
  const dividerWidth = clamp(ballRadius * 0.72, 3.5, 6);
  const boardScale = ballRadius / 8;
  const slotBounds: SkyLotterySlotBound[] = [];
  const pegs: SkyLotteryPeg[] = [];

  for (let row = 1; row < SKY_ROWS; row += 1) {
    const count = row + 1;
    const y = topY + row * rowSpacingY;
    const rowWidth = (count - 1) * spacingX;
    const startX = safeWidth / 2 - rowWidth / 2;

    for (let column = 0; column < count; column += 1) {
      pegs.push({
        x: startX + column * spacingX,
        y,
        radius: pegRadius,
      });
    }
  }

  const slotCount = SKY_ROWS + 1;
  const slotWidth = spacingX;
  const leftEdge = safeWidth / 2 - (slotCount * slotWidth) / 2;

  for (let index = 0; index < slotCount; index += 1) {
    const left = leftEdge + index * slotWidth;
    const right = left + slotWidth;
    slotBounds.push({
      left,
      right,
      center: (left + right) / 2,
    });
  }

  return {
    width: safeWidth,
    height: safeHeight,
    leftWall: 0,
    rightWall: safeWidth,
    floorY: safeHeight - clamp(ballRadius * 2.4, 18, 26),
    slotTop,
    spawnY: Math.max(ballRadius + 10, topY - rowSpacingY * 1.25),
    ballRadius,
    pegRadius,
    dividerWidth,
    gravity: clamp(0.26 * boardScale, 0.2, 0.26),
    airDrag: clamp(0.008 + (1 - boardScale) * 0.004, 0.008, 0.011),
    centerPull: clamp((spacingX / safeWidth) * 0.2, 0.011, 0.018),
    pegRestitution: clamp(
      DEFAULT_PEG_RESTITUTION - (1 - boardScale) * 0.04,
      0.54,
      DEFAULT_PEG_RESTITUTION,
    ),
    wallRestitution: clamp(
      DEFAULT_WALL_RESTITUTION - (1 - boardScale) * 0.05,
      0.44,
      DEFAULT_WALL_RESTITUTION,
    ),
    floorRestitution: clamp(
      DEFAULT_FLOOR_RESTITUTION - (1 - boardScale) * 0.03,
      0.13,
      DEFAULT_FLOOR_RESTITUTION,
    ),
    slotLabelFontSize: clamp(spacingX * 0.26, 7, 10),
    slotLabelOffset: clamp(ballRadius * 1.4, 8, 12),
    pegs,
    slotBounds,
  };
}

export function createSkyLotteryBall(
  board: SkyLotteryBoard,
  randomValue = Math.random,
): SkyLotteryBall {
  const launchBiasSeed = randomValue() - 0.5;
  const launchBias =
    Math.abs(launchBiasSeed) < 0.045
      ? launchBiasSeed <= 0
        ? -0.08
        : 0.08
      : launchBiasSeed;

  return {
    x: board.width / 2 + launchBias * board.ballRadius * 0.9,
    y: board.spawnY,
    vx: launchBias * board.ballRadius * 0.05,
    vy: 0,
    radius: board.ballRadius,
    color: "#fff6d1",
    settled: false,
    slotIndex: -1,
    stableFrames: 0,
  };
}

export function getSkyLotterySlotIndex(
  x: number,
  slotBounds: SkyLotterySlotBound[],
): number {
  const slotIndex = slotBounds.findIndex(
    (slot) => x >= slot.left && x < slot.right,
  );

  if (slotIndex >= 0) {
    return slotIndex;
  }

  const fallbackIndex = slotBounds.findIndex((slot) => x < slot.center);

  if (fallbackIndex >= 0) {
    return fallbackIndex;
  }

  return slotBounds.length - 1;
}

export function stepSkyLotteryBall(
  currentBall: SkyLotteryBall,
  board: SkyLotteryBoard,
  deltaMs: number,
): SkyLotteryBall {
  if (currentBall.settled) {
    return currentBall;
  }

  const nextBall = { ...currentBall };
  const steps = Math.max(1, Math.ceil(Math.min(deltaMs, 24) / 16));
  const frameFactor = deltaMs / 16.67 / steps;

  for (let step = 0; step < steps; step += 1) {
    if (nextBall.y < board.slotTop) {
      nextBall.vx +=
        ((board.width / 2 - nextBall.x) / board.width) * board.centerPull;
    }

    nextBall.vy += board.gravity * frameFactor;
    nextBall.vx *= 1 - board.airDrag * frameFactor;
    nextBall.vy *= 1 - board.airDrag * 0.35 * frameFactor;
    nextBall.x += nextBall.vx * frameFactor;
    nextBall.y += nextBall.vy * frameFactor;

    handleWallCollision(nextBall, board);
    handlePegCollisions(nextBall, board);
    handleSlotDividerCollisions(nextBall, board);
    handleFloorCollision(nextBall, board);
  }

  const isNearFloor = nextBall.y + nextBall.radius >= board.floorY - 1;
  const speed = Math.hypot(nextBall.vx, nextBall.vy);

  if (isNearFloor && speed < Math.max(nextBall.radius * 0.05, 0.28)) {
    nextBall.stableFrames += 1;
  } else {
    nextBall.stableFrames = 0;
  }

  if (nextBall.stableFrames > 10) {
    nextBall.settled = true;
    nextBall.slotIndex = getSkyLotterySlotIndex(nextBall.x, board.slotBounds);
    nextBall.vx = 0;
    nextBall.vy = 0;
  }

  return nextBall;
}

function handleWallCollision(ball: SkyLotteryBall, board: SkyLotteryBoard) {
  if (ball.x - ball.radius < board.leftWall) {
    ball.x = board.leftWall + ball.radius;
    ball.vx = Math.abs(ball.vx) * board.wallRestitution;
  }

  if (ball.x + ball.radius > board.rightWall) {
    ball.x = board.rightWall - ball.radius;
    ball.vx = -Math.abs(ball.vx) * board.wallRestitution;
  }
}

function handlePegCollisions(ball: SkyLotteryBall, board: SkyLotteryBoard) {
  for (const peg of board.pegs) {
    const dx = ball.x - peg.x;
    const dy = ball.y - peg.y;
    const distance = Math.hypot(dx, dy);
    const minDistance = ball.radius + peg.radius;

    if (distance === 0 || distance >= minDistance) {
      continue;
    }

    const nx = dx / distance;
    const ny = dy / distance;
    const overlap = minDistance - distance;
    const velocityAlongNormal = ball.vx * nx + ball.vy * ny;

    ball.x += nx * overlap;
    ball.y += ny * overlap;

    if (velocityAlongNormal < 0) {
      ball.vx -= (1 + board.pegRestitution) * velocityAlongNormal * nx;
      ball.vy -= (1 + board.pegRestitution) * velocityAlongNormal * ny;
    }
  }
}

function handleSlotDividerCollisions(
  ball: SkyLotteryBall,
  board: SkyLotteryBoard,
) {
  if (ball.y + ball.radius < board.slotTop) {
    return;
  }

  for (let index = 1; index < board.slotBounds.length; index += 1) {
    const dividerX = board.slotBounds[index].left;
    const minX = dividerX - board.dividerWidth / 2 - ball.radius;
    const maxX = dividerX + board.dividerWidth / 2 + ball.radius;

    if (ball.x <= minX || ball.x >= maxX) {
      continue;
    }

    if (ball.x < dividerX) {
      ball.x = minX;
      ball.vx = -Math.abs(ball.vx) * 0.56;
      continue;
    }

    ball.x = maxX;
    ball.vx = Math.abs(ball.vx) * 0.56;
  }
}

function handleFloorCollision(ball: SkyLotteryBall, board: SkyLotteryBoard) {
  if (ball.y + ball.radius < board.floorY) {
    return;
  }

  ball.y = board.floorY - ball.radius;
  ball.vy = -Math.abs(ball.vy) * board.floorRestitution;
  ball.vx *= 0.74;
}

export function drawSkyLotteryScene(
  context: CanvasRenderingContext2D,
  board: SkyLotteryBoard,
  slots: SkyColorSlot[],
  selectedSlotId: number,
  ball: SkyLotteryBall | null,
) {
  context.clearRect(0, 0, board.width, board.height);

  const skyGradient = context.createLinearGradient(0, 0, 0, board.height);
  skyGradient.addColorStop(0, "rgba(18, 9, 31, 0.94)");
  skyGradient.addColorStop(1, "rgba(8, 4, 18, 0.98)");
  context.fillStyle = skyGradient;
  context.fillRect(0, 0, board.width, board.height);

  drawGlow(context, board);
  drawSlots(context, board, slots, selectedSlotId);
  drawPegs(context, board);

  if (ball) {
    drawBall(context, ball);
  }
}

function drawGlow(context: CanvasRenderingContext2D, board: SkyLotteryBoard) {
  const glow = context.createRadialGradient(
    board.width / 2,
    board.height * 0.08,
    12,
    board.width / 2,
    board.height * 0.08,
    board.width * 0.42,
  );
  glow.addColorStop(0, "rgba(140, 243, 255, 0.2)");
  glow.addColorStop(1, "rgba(140, 243, 255, 0)");

  context.fillStyle = glow;
  context.fillRect(0, 0, board.width, board.height);
}

function drawSlots(
  context: CanvasRenderingContext2D,
  board: SkyLotteryBoard,
  slots: SkyColorSlot[],
  selectedSlotId: number,
) {
  const slotHeight = board.floorY - board.slotTop;

  slots.forEach((slot, index) => {
    const bounds = board.slotBounds[index];
    const isSelected = slot.id === selectedSlotId;
    const slotGradient = context.createLinearGradient(
      bounds.left,
      board.slotTop,
      bounds.left,
      board.floorY,
    );

    slotGradient.addColorStop(0, "rgba(255, 255, 255, 0.18)");
    slotGradient.addColorStop(0.2, slot.topHex);
    slotGradient.addColorStop(1, slot.bottomHex);

    context.fillStyle = slotGradient;
    context.fillRect(
      bounds.left,
      board.slotTop,
      bounds.right - bounds.left,
      slotHeight,
    );

    context.lineWidth = isSelected ? 3 : 2;
    context.strokeStyle = isSelected ? "#fff1b5" : "rgba(255, 255, 255, 0.16)";
    context.strokeRect(
      bounds.left,
      board.slotTop,
      bounds.right - bounds.left,
      slotHeight,
    );

    context.fillStyle = "rgba(255, 249, 220, 0.92)";
    context.font = `${board.slotLabelFontSize}px "Press Start 2P", monospace`;
    context.textAlign = "center";
    context.fillText(
      String(slot.id),
      bounds.center,
      board.floorY - board.slotLabelOffset,
    );
  });
}

function drawPegs(context: CanvasRenderingContext2D, board: SkyLotteryBoard) {
  context.fillStyle = "rgba(225, 236, 255, 0.94)";
  context.strokeStyle = "rgba(105, 226, 255, 0.5)";
  context.lineWidth = clamp(board.pegRadius * 0.28, 1, 1.5);

  for (const peg of board.pegs) {
    context.beginPath();
    context.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
}

function drawBall(context: CanvasRenderingContext2D, ball: SkyLotteryBall) {
  const glow = context.createRadialGradient(
    ball.x - ball.radius * 0.3,
    ball.y - ball.radius * 0.3,
    2,
    ball.x,
    ball.y,
    ball.radius * 1.8,
  );

  glow.addColorStop(0, "#fffef5");
  glow.addColorStop(0.55, "#ffe58d");
  glow.addColorStop(1, "#ff9f1a");

  context.fillStyle = glow;
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fill();
}
