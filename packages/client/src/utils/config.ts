import { BLEND_MODES } from 'pixi.js';

const PIXEL_ART_ASSETS_SCALING = 3;

export const config = {
  TILE_SIZE: {
    x: 96,
    y: 48,
    z: 16
  },

  UNIT_SPRITE_SIZE: {
    width: 128,
    height: 128
  },

  TILE_SPRITE_SIZE: {
    width: 96,
    height: 80
  },

  MOVEMENT_BOUNCE_HEIGHT: 1.5,
  MOVEMENT_SPEED_PER_TILE: 0.4,

  CARD_WIDTH: 102 * PIXEL_ART_ASSETS_SCALING,
  CARD_HEIGHT: 166 * PIXEL_ART_ASSETS_SCALING,
  STAT_CIRCLE_SIZE: 22 * PIXEL_ART_ASSETS_SCALING,
  CARD_NAME_TEXTBOX_WIDTH: 84 * PIXEL_ART_ASSETS_SCALING,
  CARD_DESCRIPTION_TEXTBOX_WIDTH: 84 * PIXEL_ART_ASSETS_SCALING,
  CARD_DESCRIPTION_TEXTBOX_HEIGHT: 55 * PIXEL_ART_ASSETS_SCALING,
  CARD_DESCRIPTION_TEXTBOX_PADDING: 4 * PIXEL_ART_ASSETS_SCALING,

  ACTION_WHEEL_WIDTH: 78 * PIXEL_ART_ASSETS_SCALING,
  ACTION_WHEEL_HEIGHT: 81 * PIXEL_ART_ASSETS_SCALING,
  ACTION_WHEEL_BUTTON_SIZE: 24 * PIXEL_ART_ASSETS_SCALING,

  PLAYER_BATTLE_INFOS_WIDTH: 82 * PIXEL_ART_ASSETS_SCALING,
  PLAYER_BATTLE_INFOS_HEIGHT: 70 * PIXEL_ART_ASSETS_SCALING,

  RUNE_SMALL_SIZE: 13 * PIXEL_ART_ASSETS_SCALING,

  AMBIENT_LIGHT_COLOR: '#01015f',
  AMBIENT_LIGHT_UNIT_SIZE: 256,
  AMBIENT_LIGHT_ALPHA: 0.4,
  AMBIENT_LIGHT_BLEND_MODE: BLEND_MODES.MULTIPLY
};
