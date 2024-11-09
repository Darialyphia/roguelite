import { isDefined } from '@game/shared';
import {
  ExtensionType,
  type Loader,
  LoaderParserPriority,
  Spritesheet,
  Texture,
  // type LoaderParserAdvanced,
  type ISpritesheetData
} from 'pixi.js';
import { z } from 'zod';

export const trimExtension = (str: string) => str.replace(/\.[^/.]+$/, '');

const asepriteSizeSchema = z.object({
  w: z.number(),
  h: z.number()
});
const asepriteRectSchema = asepriteSizeSchema.extend({
  x: z.number(),
  y: z.number()
});

export const asepriteJsonMetaSchema = z.object({
  image: z.string(),
  size: asepriteSizeSchema,
  scale: z.string(),
  frameTags: z
    .object({
      name: z.string(),
      from: z.number(),
      to: z.number(),
      direction: z.string()
    })
    .array(),
  slices: z
    .object({
      color: z.string().default(''),
      name: z.string(),
      keys: z
        .object({
          frame: z.number(),
          bounds: z.object({
            x: z.number(),
            y: z.number(),
            w: z.number(),
            h: z.number()
          })
        })
        .array()
    })
    .array()
    .optional(),
  layers: z
    .object({
      name: z.string(),
      opacity: z.number(),
      blendMode: z.string()
    })
    .array()
});
export type AsepriteMeta = z.infer<typeof asepriteJsonMetaSchema>;

const asepriteJsonSchema = z.object({
  frames: z.record(
    z.string(),
    z.object({
      frame: asepriteRectSchema,
      spriteSourceSize: asepriteRectSchema,
      sourceSize: asepriteSizeSchema,
      duration: z.number().optional()
    })
  ),
  meta: asepriteJsonMetaSchema
});
type AsepriteJson = z.infer<typeof asepriteJsonSchema>;

type Name = string;
type Group = string;
type Layer = 'helm' | 'weapon' | 'armor' | 'vfx' | 'body';
type Tag = 'idle';
type FrameIndex = string;

type FrameKey = `${Name}_${Group}_${Layer}_${Tag}_${FrameIndex}`;
type ParsedFramedKey = {
  name: Name;
  group: Group;
  layer: Layer;
  tag: Tag;
  index: number;
};
function assertFrameKey(key: string): asserts key is FrameKey {
  const [name, group, layer, tag, index] = key.split('_');
  if (![name, group, layer, tag, index].every(isDefined)) {
    throw new Error(
      `Invalid Aseprite framekey. Expected <name>_<group>_<layer>_<tag>_<frame>, received ${key}`
    );
  }
}

const parseFrameKey = (key: FrameKey) => {
  const [name, group, layer, tag, index] = key.split('_');

  return {
    name,
    group: group || 'base',
    layer,
    tag,
    index: parseInt(index)
  } as ParsedFramedKey;
};

type LayerGroup = Record<string, ISpritesheetData>;
type LoadedAsepriteSheet = {
  imagePath: string;
  groups: Record<string, LayerGroup>;
};

export type ParsedAsepriteSheet<
  TGroups extends string = string,
  TBaseLayers extends string = string,
  TGroupLayers extends string = string
> = {
  groups: TGroups[];
  sheets: {
    [key in TGroups | 'base']: key extends 'base'
      ? Record<TBaseLayers, Spritesheet>
      : Record<TGroupLayers, Spritesheet>;
  };
};

const initSpritesheetData = (meta: AsepriteMeta) => ({
  frames: {},
  animations: {},
  meta: {
    ...meta,
    scale: '1'
  }
});

const loadAsepritesheet = ({ frames, meta }: AsepriteJson) => {
  const groups: LoadedAsepriteSheet['groups'] = {};
  Object.entries(frames).forEach(([frameName, frame]) => {
    assertFrameKey(frameName);
    const { tag, index, layer, group } = parseFrameKey(frameName as FrameKey);
    groups[group] ??= Object.fromEntries(
      meta.layers
        .map(l => l.name)
        .map(name => [name, initSpritesheetData(meta)])
    );
    groups[group][layer].animations![tag] ??= [];
    groups[group][layer].animations![tag][index] = frameName;
    groups[group][layer].frames[frameName] = frame;
  });

  return { groups, imagePath: meta.image };
};

const parseAsepriteSheet = async (
  asset: LoadedAsepriteSheet,
  src: string,
  loader: Loader
): Promise<ParsedAsepriteSheet> => {
  const result: ParsedAsepriteSheet = {
    groups: [],
    sheets: {}
  };

  const basePath = src.split('/').slice(0, -1).join('/');
  const imagePath = `${basePath}/${asset.imagePath}`;

  const assets = await loader.load<Texture>([imagePath]);

  const texture = assets[imagePath];
  // texture.source.scaleMode = 'nearest';

  const loadAndParse = async (data: ISpritesheetData) => {
    const sheet = new Spritesheet(texture, data);
    await sheet.parse();
    return sheet;
  };
  for (const [groupName, group] of Object.entries(asset.groups)) {
    if (groupName !== 'base') {
      result.groups.unshift(groupName);
    }
    const resources = await Promise.all(
      Object.keys(group).map(
        async k => [k, await loadAndParse(group[k])] as const
      )
    );
    result.sheets[groupName] = Object.fromEntries(resources);
  }
  return result;
};

// const parseTileset = ({ frames, meta }: AsepriteJson) => ({
//   frames: Object.fromEntries(
//     frames.map((frame, index) => {
//       const frameName = `${trimExtension(meta.image)}-${index}`;
//       // avoids console warnings with HMR
//       if (import.meta.env.DEV) {
//         Texture.removeFromCache(frameName);
//       }

//       return [frameName, frame];
//     }),
//   ),
//   meta,
// });

export const ASEPRITE_SPRITESHEET_LOADER = 'aseprite_loader';
// export const ASEPRITE_TILESET_PARSER = "Aseprite_tileset_Parser";

export const asepriteSpriteSheetParser = {
  extension: {
    name: ASEPRITE_SPRITESHEET_LOADER,
    priority: LoaderParserPriority.High,
    type: ExtensionType.LoadParser
  },

  name: ASEPRITE_SPRITESHEET_LOADER,

  async load(url: string) {
    const response = await fetch(url);
    const json = await response.json();

    const parsed = asepriteJsonSchema.parse(json);
    return loadAsepritesheet(parsed);
  },

  testParse(asset: any, resolvedAsset: any) {
    return Promise.resolve(
      resolvedAsset?.loadParser === ASEPRITE_SPRITESHEET_LOADER
    );
  },

  async parse(asset: any, resolvedAsset: any, loader: any) {
    try {
      const result = await parseAsepriteSheet(
        asset,
        resolvedAsset!.src!,
        loader!
      );
      return result;
    } catch (e) {
      console.log('PARSE ERROR', e);
      throw e;
    }
  }
};

// export const asepriteTilesetParser = {
//   extension: {
//     name: ASEPRITE_TILESET_PARSER,
//     priority: LoaderParserPriority.Normal,
//     type: ExtensionType.LoadParser,
//   },

//   name: ASEPRITE_TILESET_PARSER,

//   async load(url: string) {
//     const response = await fetch(url);
//     const json = await response.json();

//     const parsed = asepriteJsonSchema.parse(json);

//     return parseTileset(parsed);
//   },
// };
