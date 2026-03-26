import { describe, expect, it, vi } from "vitest";

import { skyColorSlots } from "../portfolioData";
import {
  createSkyLotteryBall,
  createSkyLotteryBoard,
  drawSkyLotteryScene,
  getSkyLotterySlotIndex,
  stepSkyLotteryBall,
} from "../skyLottery";

describe("skyLottery", () => {
  it("clamps the board to the minimum playable size", () => {
    const board = createSkyLotteryBoard(200, 200);

    expect(board.width).toBe(320);
    expect(board.height).toBe(320);
    expect(board.slotLabelFontSize).toBeGreaterThan(0);
  });

  it("builds a board with 12 slots and peg rows without the top single peg", () => {
    const board = createSkyLotteryBoard(640, 420);

    expect(board.slotBounds).toHaveLength(12);
    expect(board.pegs).toHaveLength(65);
    expect(board.pegs[0].x).toBeLessThan(board.width / 2);
    expect(board.pegs[1].x).toBeGreaterThan(board.width / 2);
    expect(board.pegs[0].y).toBe(board.pegs[1].y);
  });

  it("maps x positions into slot indexes", () => {
    const board = createSkyLotteryBoard(640, 420);

    expect(
      getSkyLotterySlotIndex(board.slotBounds[0].center, board.slotBounds),
    ).toBe(0);
    expect(
      getSkyLotterySlotIndex(board.slotBounds[11].center, board.slotBounds),
    ).toBe(11);
    expect(getSkyLotterySlotIndex(-10, board.slotBounds)).toBe(0);
    expect(getSkyLotterySlotIndex(9999, board.slotBounds)).toBe(11);
  });

  it("keeps a passable gap between pegs on narrow boards", () => {
    const board = createSkyLotteryBoard(320, 360);
    const slotWidth = board.slotBounds[0].right - board.slotBounds[0].left;
    const pegGap = slotWidth - board.pegRadius * 2;

    expect(board.ballRadius * 2).toBeLessThan(pegGap);
    expect(board.ballRadius).toBeLessThan(board.pegRadius * 2);
  });

  it("builds ball launch bias for centered and offset drops", () => {
    const board = createSkyLotteryBoard(640, 420);

    const leftBiasedBall = createSkyLotteryBall(board, () => 0.5);
    const rightBiasedBall = createSkyLotteryBall(board, () => 0.54);
    const wideBiasedBall = createSkyLotteryBall(board, () => 0.9);

    expect(leftBiasedBall.x).toBeLessThan(board.width / 2);
    expect(rightBiasedBall.x).toBeGreaterThan(board.width / 2);
    expect(wideBiasedBall.vx).toBeGreaterThan(0);
  });

  it("returns the same object for an already settled ball", () => {
    const board = createSkyLotteryBoard(640, 420);
    const ball = {
      ...createSkyLotteryBall(board, () => 0.5),
      settled: true,
    };

    expect(stepSkyLotteryBall(ball, board, 16.67)).toBe(ball);
  });

  it("handles wall, divider, floor, and peg collisions during a step", () => {
    const board = createSkyLotteryBoard(640, 420);

    const leftWallBall = stepSkyLotteryBall(
      {
        ...createSkyLotteryBall(board, () => 0.5),
        x: 1,
        y: board.slotTop - 20,
        vx: -3,
      },
      board,
      0,
    );
    const rightWallBall = stepSkyLotteryBall(
      {
        ...createSkyLotteryBall(board, () => 0.5),
        x: board.width - 1,
        y: board.slotTop - 20,
        vx: 3,
      },
      board,
      0,
    );
    const dividerLeftBall = stepSkyLotteryBall(
      {
        ...createSkyLotteryBall(board, () => 0.5),
        x: board.slotBounds[1].left - 1,
        y: board.slotTop,
        vx: 1,
      },
      board,
      0,
    );
    const dividerRightBall = stepSkyLotteryBall(
      {
        ...createSkyLotteryBall(board, () => 0.5),
        x: board.slotBounds[1].left + 1,
        y: board.slotTop,
        vx: -1,
      },
      board,
      0,
    );
    const floorBall = stepSkyLotteryBall(
      {
        ...createSkyLotteryBall(board, () => 0.5),
        x: board.slotBounds[5].center,
        y: board.floorY,
        vy: 2,
      },
      board,
      0,
    );
    const pegCollisionBall = stepSkyLotteryBall(
      {
        ...createSkyLotteryBall(board, () => 0.5),
        x: board.pegs[0].x + 0.5,
        y: board.pegs[0].y + 0.5,
        vy: -1,
      },
      board,
      0,
    );
    const distanceZeroBall = stepSkyLotteryBall(
      {
        ...createSkyLotteryBall(board, () => 0.5),
        x: board.pegs[0].x,
        y: board.pegs[0].y,
      },
      board,
      0,
    );

    expect(leftWallBall.x).toBeGreaterThanOrEqual(leftWallBall.radius);
    expect(rightWallBall.x).toBeLessThanOrEqual(
      board.width - rightWallBall.radius,
    );
    expect(dividerLeftBall.x).toBeLessThan(board.slotBounds[1].left);
    expect(dividerRightBall.x).toBeGreaterThan(board.slotBounds[1].left);
    expect(floorBall.y).toBe(board.floorY - floorBall.radius);
    expect(pegCollisionBall.y).not.toBe(board.pegs[0].y + 0.5);
    expect(distanceZeroBall.x).toBe(board.pegs[0].x);
  });

  it("settles a dropped ball into one of the colored slots", () => {
    const board = createSkyLotteryBoard(640, 420);
    let ball = {
      ...createSkyLotteryBall(board, () => 0.5),
      x: board.slotBounds[5].center,
      y: board.floorY - 26,
      vy: 0.18,
    };

    for (let frame = 0; frame < 180; frame += 1) {
      ball = stepSkyLotteryBall(ball, board, 16.67);

      if (ball.settled) {
        break;
      }
    }

    expect(ball.settled).toBe(true);
    expect(ball.slotIndex).toBeGreaterThanOrEqual(0);
    expect(ball.slotIndex).toBeLessThan(12);
  });

  it("still settles on a narrow mobile-sized board", () => {
    const board = createSkyLotteryBoard(320, 360);
    let ball = createSkyLotteryBall(board, () => 0.5);

    for (let frame = 0; frame < 420; frame += 1) {
      ball = stepSkyLotteryBall(ball, board, 16.67);

      if (ball.settled) {
        break;
      }
    }

    expect(ball.settled).toBe(true);
    expect(ball.slotIndex).toBeGreaterThanOrEqual(0);
    expect(ball.slotIndex).toBeLessThan(12);
  });

  it("draws the scene with and without a ball", () => {
    const board = createSkyLotteryBoard(640, 420);
    const context = {
      arc: vi.fn(),
      beginPath: vi.fn(),
      clearRect: vi.fn(),
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      fill: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      stroke: vi.fn(),
      strokeRect: vi.fn(),
      textAlign: "left",
      lineWidth: 0,
      fillStyle: "",
      font: "",
      strokeStyle: "",
    } as unknown as CanvasRenderingContext2D;
    const ball = createSkyLotteryBall(board, () => 0.5);

    drawSkyLotteryScene(
      context,
      board,
      skyColorSlots,
      skyColorSlots[0].id,
      null,
    );
    drawSkyLotteryScene(
      context,
      board,
      skyColorSlots,
      skyColorSlots[1].id,
      ball,
    );

    expect(context.clearRect).toHaveBeenCalled();
    expect(context.fillRect).toHaveBeenCalled();
    expect(context.strokeRect).toHaveBeenCalled();
    expect(context.fillText).toHaveBeenCalled();
    expect(context.arc).toHaveBeenCalled();
  });
});
