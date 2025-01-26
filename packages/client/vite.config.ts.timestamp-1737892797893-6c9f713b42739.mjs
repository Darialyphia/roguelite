// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/web/roguelite/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/web/roguelite/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///C:/web/roguelite/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import autoImport from "file:///C:/web/roguelite/node_modules/unplugin-auto-import/dist/vite.js";
import vueRouter from "file:///C:/web/roguelite/node_modules/unplugin-vue-router/dist/vite.js";
import { VueRouterAutoImports } from "file:///C:/web/roguelite/node_modules/unplugin-vue-router/dist/index.js";
import unoCSS from "file:///C:/web/roguelite/node_modules/unocss/dist/vite.mjs";
import icons from "file:///C:/web/roguelite/node_modules/unplugin-icons/dist/vite.js";
import { isCustomElement, transformAssetUrls } from "file:///C:/web/roguelite/node_modules/vue3-pixi/dist/compiler.js";
import assetpackConfig from "file:///C:/web/roguelite/configs/assetpack/assetpack.config.js";
import { AssetPack } from "file:///C:/web/roguelite/node_modules/@assetpack/core/dist/es/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/web/roguelite/packages/client/vite.config.ts";
var customElements = ["viewport", "layer"];
var prefix = "pixi-";
function assetpackPlugin() {
  const apConfig = assetpackConfig("./src/assets/", "./public/assets/");
  let mode;
  let ap;
  return {
    name: "vite-plugin-assetpack",
    configResolved(resolvedConfig) {
      mode = resolvedConfig.command;
    },
    buildStart: async () => {
      if (mode === "serve") {
        if (ap) return;
        ap = new AssetPack(apConfig);
        void ap.watch();
      } else {
        await new AssetPack(apConfig).run();
      }
    },
    buildEnd: async () => {
      if (ap) {
        await ap.stop();
        ap = void 0;
      }
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [
    vueRouter({
      extensions: [".page.vue"]
    }),
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      },
      template: {
        compilerOptions: {
          isCustomElement(name) {
            let normalizedName = name.replace(
              /[A-Z]/g,
              (m) => `-${m.toLowerCase()}`
            );
            if (normalizedName.startsWith("-"))
              normalizedName = normalizedName.slice(1);
            const isPixiElement = customElements.includes(normalizedName);
            const isPrefixElement = normalizedName.startsWith(prefix) && customElements.includes(normalizedName.slice(prefix.length));
            return isCustomElement(name) || isPixiElement || isPrefixElement;
          }
        },
        transformAssetUrls
      }
    }),
    vueDevTools(),
    autoImport({
      imports: ["vue", VueRouterAutoImports],
      dts: true,
      eslintrc: {
        enabled: true
      }
    }),
    unoCSS(),
    icons({}),
    assetpackPlugin()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx3ZWJcXFxccm9ndWVsaXRlXFxcXHBhY2thZ2VzXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcd2ViXFxcXHJvZ3VlbGl0ZVxcXFxwYWNrYWdlc1xcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3dlYi9yb2d1ZWxpdGUvcGFja2FnZXMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIFBsdWdpbiwgUmVzb2x2ZWRDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcblxuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scyc7XG5pbXBvcnQgYXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJztcbmltcG9ydCB2dWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJztcbmltcG9ydCB7IFZ1ZVJvdXRlckF1dG9JbXBvcnRzIH0gZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlcic7XG5pbXBvcnQgdW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJztcbmltcG9ydCBpY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJztcblxuaW1wb3J0IHsgaXNDdXN0b21FbGVtZW50LCB0cmFuc2Zvcm1Bc3NldFVybHMgfSBmcm9tICd2dWUzLXBpeGkvY29tcGlsZXInO1xuLy9AdHMtZXhwZWN0LWVycm9yIG5vIHR5cGVzIGZvciB0aGlzIHBhY2thZ2VcbmltcG9ydCBhc3NldHBhY2tDb25maWcgZnJvbSAnQGdhbWUvYXNzZXRwYWNrJztcblxuY29uc3QgY3VzdG9tRWxlbWVudHMgPSBbJ3ZpZXdwb3J0JywgJ2xheWVyJ107XG5jb25zdCBwcmVmaXggPSAncGl4aS0nO1xuXG5pbXBvcnQgeyBBc3NldFBhY2sgfSBmcm9tICdAYXNzZXRwYWNrL2NvcmUnO1xuXG5mdW5jdGlvbiBhc3NldHBhY2tQbHVnaW4oKTogUGx1Z2luIHtcbiAgY29uc3QgYXBDb25maWcgPSBhc3NldHBhY2tDb25maWcoJy4vc3JjL2Fzc2V0cy8nLCAnLi9wdWJsaWMvYXNzZXRzLycpO1xuXG4gIGxldCBtb2RlOiBSZXNvbHZlZENvbmZpZ1snY29tbWFuZCddO1xuICBsZXQgYXA6IEFzc2V0UGFjayB8IHVuZGVmaW5lZDtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLXBsdWdpbi1hc3NldHBhY2snLFxuICAgIGNvbmZpZ1Jlc29sdmVkKHJlc29sdmVkQ29uZmlnKSB7XG4gICAgICBtb2RlID0gcmVzb2x2ZWRDb25maWcuY29tbWFuZDtcbiAgICB9LFxuICAgIGJ1aWxkU3RhcnQ6IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChtb2RlID09PSAnc2VydmUnKSB7XG4gICAgICAgIGlmIChhcCkgcmV0dXJuO1xuICAgICAgICBhcCA9IG5ldyBBc3NldFBhY2soYXBDb25maWcpO1xuICAgICAgICB2b2lkIGFwLndhdGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBuZXcgQXNzZXRQYWNrKGFwQ29uZmlnKS5ydW4oKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkRW5kOiBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoYXApIHtcbiAgICAgICAgYXdhaXQgYXAuc3RvcCgpO1xuICAgICAgICBhcCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWVSb3V0ZXIoe1xuICAgICAgZXh0ZW5zaW9uczogWycucGFnZS52dWUnXVxuICAgIH0pLFxuICAgIHZ1ZSh7XG4gICAgICBzY3JpcHQ6IHtcbiAgICAgICAgZGVmaW5lTW9kZWw6IHRydWUsXG4gICAgICAgIHByb3BzRGVzdHJ1Y3R1cmU6IHRydWVcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZToge1xuICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgICBpc0N1c3RvbUVsZW1lbnQobmFtZSkge1xuICAgICAgICAgICAgbGV0IG5vcm1hbGl6ZWROYW1lID0gbmFtZS5yZXBsYWNlKFxuICAgICAgICAgICAgICAvW0EtWl0vZyxcbiAgICAgICAgICAgICAgbSA9PiBgLSR7bS50b0xvd2VyQ2FzZSgpfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAobm9ybWFsaXplZE5hbWUuc3RhcnRzV2l0aCgnLScpKVxuICAgICAgICAgICAgICBub3JtYWxpemVkTmFtZSA9IG5vcm1hbGl6ZWROYW1lLnNsaWNlKDEpO1xuXG4gICAgICAgICAgICBjb25zdCBpc1BpeGlFbGVtZW50ID0gY3VzdG9tRWxlbWVudHMuaW5jbHVkZXMobm9ybWFsaXplZE5hbWUpO1xuICAgICAgICAgICAgY29uc3QgaXNQcmVmaXhFbGVtZW50ID1cbiAgICAgICAgICAgICAgbm9ybWFsaXplZE5hbWUuc3RhcnRzV2l0aChwcmVmaXgpICYmXG4gICAgICAgICAgICAgIGN1c3RvbUVsZW1lbnRzLmluY2x1ZGVzKG5vcm1hbGl6ZWROYW1lLnNsaWNlKHByZWZpeC5sZW5ndGgpKTtcblxuICAgICAgICAgICAgcmV0dXJuIGlzQ3VzdG9tRWxlbWVudChuYW1lKSB8fCBpc1BpeGlFbGVtZW50IHx8IGlzUHJlZml4RWxlbWVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zZm9ybUFzc2V0VXJsc1xuICAgICAgfVxuICAgIH0pLFxuICAgIHZ1ZURldlRvb2xzKCksXG4gICAgYXV0b0ltcG9ydCh7XG4gICAgICBpbXBvcnRzOiBbJ3Z1ZScsIFZ1ZVJvdXRlckF1dG9JbXBvcnRzXSxcbiAgICAgIGR0czogdHJ1ZSxcbiAgICAgIGVzbGludHJjOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgIH1cbiAgICB9KSxcbiAgICB1bm9DU1MoKSxcbiAgICBpY29ucyh7fSksXG4gICAgYXNzZXRwYWNrUGx1Z2luKClcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgIH1cbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRSLFNBQVMsZUFBZSxXQUFXO0FBRS9ULFNBQVMsb0JBQTRDO0FBQ3JELE9BQU8sU0FBUztBQUVoQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGVBQWU7QUFDdEIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxZQUFZO0FBQ25CLE9BQU8sV0FBVztBQUVsQixTQUFTLGlCQUFpQiwwQkFBMEI7QUFFcEQsT0FBTyxxQkFBcUI7QUFLNUIsU0FBUyxpQkFBaUI7QUFuQnVKLElBQU0sMkNBQTJDO0FBZ0JsTyxJQUFNLGlCQUFpQixDQUFDLFlBQVksT0FBTztBQUMzQyxJQUFNLFNBQVM7QUFJZixTQUFTLGtCQUEwQjtBQUNqQyxRQUFNLFdBQVcsZ0JBQWdCLGlCQUFpQixrQkFBa0I7QUFFcEUsTUFBSTtBQUNKLE1BQUk7QUFFSixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixlQUFlLGdCQUFnQjtBQUM3QixhQUFPLGVBQWU7QUFBQSxJQUN4QjtBQUFBLElBQ0EsWUFBWSxZQUFZO0FBQ3RCLFVBQUksU0FBUyxTQUFTO0FBQ3BCLFlBQUksR0FBSTtBQUNSLGFBQUssSUFBSSxVQUFVLFFBQVE7QUFDM0IsYUFBSyxHQUFHLE1BQU07QUFBQSxNQUNoQixPQUFPO0FBQ0wsY0FBTSxJQUFJLFVBQVUsUUFBUSxFQUFFLElBQUk7QUFBQSxNQUNwQztBQUFBLElBQ0Y7QUFBQSxJQUNBLFVBQVUsWUFBWTtBQUNwQixVQUFJLElBQUk7QUFDTixjQUFNLEdBQUcsS0FBSztBQUNkLGFBQUs7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFVBQVU7QUFBQSxNQUNSLFlBQVksQ0FBQyxXQUFXO0FBQUEsSUFDMUIsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLE1BQ0YsUUFBUTtBQUFBLFFBQ04sYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsTUFDcEI7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLGlCQUFpQjtBQUFBLFVBQ2YsZ0JBQWdCLE1BQU07QUFDcEIsZ0JBQUksaUJBQWlCLEtBQUs7QUFBQSxjQUN4QjtBQUFBLGNBQ0EsT0FBSyxJQUFJLEVBQUUsWUFBWSxDQUFDO0FBQUEsWUFDMUI7QUFDQSxnQkFBSSxlQUFlLFdBQVcsR0FBRztBQUMvQiwrQkFBaUIsZUFBZSxNQUFNLENBQUM7QUFFekMsa0JBQU0sZ0JBQWdCLGVBQWUsU0FBUyxjQUFjO0FBQzVELGtCQUFNLGtCQUNKLGVBQWUsV0FBVyxNQUFNLEtBQ2hDLGVBQWUsU0FBUyxlQUFlLE1BQU0sT0FBTyxNQUFNLENBQUM7QUFFN0QsbUJBQU8sZ0JBQWdCLElBQUksS0FBSyxpQkFBaUI7QUFBQSxVQUNuRDtBQUFBLFFBQ0Y7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsWUFBWTtBQUFBLElBQ1osV0FBVztBQUFBLE1BQ1QsU0FBUyxDQUFDLE9BQU8sb0JBQW9CO0FBQUEsTUFDckMsS0FBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLFFBQ1IsU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxJQUNQLE1BQU0sQ0FBQyxDQUFDO0FBQUEsSUFDUixnQkFBZ0I7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
