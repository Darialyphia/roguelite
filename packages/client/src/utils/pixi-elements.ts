import { Viewport, type IViewportOptions } from 'pixi-viewport';
import { patchProp, renderer } from 'vue3-pixi';
import { Layer } from '@pixi/layers';

renderer.use({
  name: 'Viewport',
  createElement: props => new Viewport(props as IViewportOptions),
  patchProp(el, key, prevValue, nextValue) {
    return patchProp(el, key, prevValue, nextValue);
  }
});

renderer.use({
  name: 'Layer',
  createElement: props => new Layer(props.group),
  patchProp(el, key, prevValue, nextValue) {
    return patchProp(el, key, prevValue, nextValue);
  }
});

// renderer.use({
//   name: 'PointLight',
//   createElement: props => {
//     return new PointLight(props.color, props.brightness, props.radius);
//   },
//   patchProp(el, key, prevValue, nextValue) {
//     patchProp(el, key, prevValue, nextValue);
//   }
// });

// renderer.use({
//   name: 'AmbientLight',
//   createElement: props => new AmbientLight(props.color, props.brightness),
//   patchProp(el, key, prevValue, nextValue) {
//     patchProp(el, key, prevValue, nextValue);
//   }
// });
