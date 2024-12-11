import { deg2Rad } from '@game/shared';
import { type FrameObject, type Spritesheet, Texture } from 'pixi.js';

export const hasAnimation = (spritesheet: Spritesheet, name: string) => {
  return !!spritesheet.animations[name];
};
// matches textures from an animation to its duration in the sprite sheet data
export const createSpritesheetFrameObject = (
  name: string,
  spritesheet: Spritesheet
): FrameObject[] => {
  const frames = spritesheet.data.animations?.[name];
  const textures = spritesheet.animations[name];
  if (!frames || !textures) {
    throw new Error(`unknown animation: ${name}`);
  }

  const defaultDuration = 100;
  return frames.map((frame, index) => {
    return {
      texture: textures[index],
      // @ts-expect-error type difference between ISpritesheetData and what we output in the aseprite parser
      time: spritesheet.data.frames[frame].duration ?? defaultDuration
    };
  });
};

export const SPRITE_ZINDEX_OFFSETS = {
  INTERACTABLE: 2,
  HOVERED_CELL: 1.5,
  ENTITY: 2.1,
  HALF_TILE: -1
} as const;

export function radialGradient(
  width: number,
  height: number,
  stops: [ratio: number, color: string][]
) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d')!;
  const grd = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    Math.max(height / 2, width / 2)
  );
  stops.forEach(([ratio, color]) => {
    grd.addColorStop(ratio, color);
  });

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);

  return Texture.from(c);
}

export function rectangleWithHoles({
  width,
  height,
  color,
  circles
}: {
  width: number;
  height: number;
  color: string;
  circles: Array<{
    x: number;
    y: number;
    radius: number;
  }>;
}) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'white';
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  });
  console.log(c.toDataURL());
  return Texture.from(c);
}
