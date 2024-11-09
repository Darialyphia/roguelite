import {
  Assets,
  type AssetsManifest,
  Spritesheet,
  Texture,
  extensions
} from 'pixi.js';
import type { App, InjectionKey, Ref } from 'vue';
import { BaseTexture, SCALE_MODES } from 'pixi.js';
import type { Nullable } from '@game/shared';
import { useSafeInject } from './useSafeInject';
import {
  asepriteSpriteSheetParser,
  type ParsedAsepriteSheet
} from '@/utils/aseprite-parser';

BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

export type SpritesheetWithAnimations = Spritesheet & {
  animations: Record<string, Texture[]>;
};
export type AssetsContext = {
  manifest: Readonly<Nullable<AssetsManifest>>;
  loaded: Ref<boolean>;
  fullyLoaded: Ref<boolean>;
  loadSpritesheet(key: string): Promise<ParsedAsepriteSheet>;
  // unloadSpritesheet(key: string): Promise<void>;
  // loadTexture(key: string): Promise<Texture>;
  // loadNormalSpritesheet(
  //   key: string,
  //   diffuseSheet: SpritesheetWithAnimations
  // ): Promise<SpritesheetWithAnimations>;
  // getSpritesheet(key: string): SpritesheetWithAnimations;
  // getTexture(key: string): Texture;
  // getHitbox(key: string): any;
  load: () => Promise<void>;
};

export const ASSETS_INJECTION_KEY = Symbol(
  'assets'
) as InjectionKey<AssetsContext>;

// const splitBundle = (manifest: AssetsManifest, name: string) => {
//   const bundle = manifest.bundles.find(b => b.name === name)!;
//   manifest.bundles.splice(manifest.bundles.indexOf(bundle), 1);

//   const bundleIds: string[] = [];
//   (bundle.assets as UnresolvedAsset[]).forEach(asset => {
//     const newBundle = {
//       name: asset.alias?.[0] ?? '',
//       assets: [asset]
//     };
//     manifest.bundles.push(newBundle);
//     bundleIds.push(newBundle.name);
//   });
//   return bundleIds;
// };

// const getNormalAssetData = (
//   asset: ISpritesheetData,
//   imagePath: string
// ): ISpritesheetData => {
//   const animations = Object.fromEntries(
//     Object.entries(asset.animations!).map(([key, frames]) => [
//       key,
//       frames.map(frame => `n_${frame}`)
//     ])
//   );
//   const frames = Object.fromEntries(
//     Object.entries(asset.frames).map(([key, frame]) => [`n_${key}`, frame])
//   );
//   return {
//     animations,
//     frames,
//     meta: { ...asset.meta, image: imagePath }
//   };
// };

export const useAssetsProvider = (app: App) => {
  let manifest: AssetsManifest;
  // means the essentials are loaded and the app is ready to run
  const loaded = ref(false);
  // means that all bundles have been loaded, except units and icons that are lazy loaded. The game screen s ready to be displayed
  const fullyLoaded = ref(false);

  const init = async () => {
    extensions.add(asepriteSpriteSheetParser);
    Assets.cache.reset();
    manifest = await (await fetch('/assets/assets-manifest.json')).json();

    // createNormalSheetsBundle(manifest, 'units');
    // transform the manifest to add separate bundles for units and icons, as loading everything at once is way too expensive
    // splitBundle(manifest, 'units');
    // splitBundle(manifest, 'icons');
    // splitBundle(manifest, 'normals');
    // splitBundle(manifest, 'fx');
    // splitBundle(manifest, 'obstacles');
    Assets.init({ manifest });
  };

  const loadNonCriticalResources = async () => {
    await Promise.all(
      ['tiles' /*'obstacles', 'tilesets', 'hitboxes', 'modifiers'*/].map(
        bundle => {
          return new Promise(resolve => {
            window.requestIdleCallback(() => {
              Assets.loadBundle(bundle).then(resolve);
            });
          });
        }
      )
    );
    fullyLoaded.value = true;
  };

  const load = async () => {
    if (loaded.value) return;
    await init();
    // await Promise.all(['ui', 'pedestals'].map(id => Assets.loadBundle(id)));
    loaded.value = true;

    loadNonCriticalResources();
  };

  const bundlesPromises = new Map<string, Promise<any>>();

  const api: AssetsContext = {
    get manifest() {
      return manifest;
    },
    loaded,
    fullyLoaded,
    load,
    async loadSpritesheet(key: string) {
      if (!bundlesPromises.has(key)) {
        bundlesPromises.set(key, Assets.loadBundle(key));
      }
      await bundlesPromises.get(key);
      return Assets.get<ParsedAsepriteSheet>(key);
    }

    // async loadSpritesheet(key) {
    //   // avoids pixi warning messages when we try to load a bundle multiple times
    //   if (!bundlesPromises.has(key)) {
    //     bundlesPromises.set(key, Assets.loadBundle(key));
    //   }
    //   await bundlesPromises.get(key);
    //   return Assets.get<SpritesheetWithAnimations>(key);
    // },
    // async unloadSpritesheet(key) {
    //   if (!bundlesPromises.has(key)) return;
    //   bundlesPromises.delete(key);
    //   return Assets.unloadBundle(key);
    // },
    // async loadTexture(key) {
    //   // avoids pixi warning messages when we try to load a bundle multiple times
    //   if (!bundlesPromises.has(key)) {
    //     bundlesPromises.set(key, Assets.loadBundle(key));
    //   }
    //   await bundlesPromises.get(key);
    //   return Assets.get<Texture>(key);
    // },
    // getSpritesheet(key: string) {
    //   const sheet = Assets.get<SpritesheetWithAnimations>(key);
    //   if (!sheet) {
    //     throw new Error(`Spritesheet not found for ${key}`);
    //   }
    //   return sheet;
    // },
    // getTexture(key: string) {
    //   return Assets.get<Texture>(key);
    // },
    // getHitbox(key) {
    //   return Assets.get<any>(`hitbox-${key}`);
    // }
  };

  app.provide(ASSETS_INJECTION_KEY, api);
  return api;
};

export const useAssets = () => useSafeInject(ASSETS_INJECTION_KEY);
