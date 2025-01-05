<script setup lang="ts">
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  type TooltipContentProps
} from 'radix-vue';

export type UITooltipProps = {
  sideOffset?: number;
  delay?: number;
  side?: TooltipContentProps['side'];
  align?: TooltipContentProps['align'];
  usePortal?: boolean;
};

const {
  sideOffset = 15,
  side = 'top',
  align = 'center',
  usePortal = true
} = defineProps<UITooltipProps>();
</script>

<template>
  <TooltipRoot>
    <TooltipTrigger v-slot="triggerProps" as-child>
      <slot name="trigger" v-bind="triggerProps" />
    </TooltipTrigger>
    <TooltipPortal :disabled="!usePortal">
      <TooltipContent
        v-slot="contentProps"
        class="select-none"
        :side-offset="sideOffset"
        :side="side"
        :align="align"
      >
        <div class="tooltip-content">
          <slot v-bind="contentProps" />
        </div>
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>

<style lang="postcss" scoped>
.tooltip-content {
  background-color: black;
  color: white;
  padding: var(--size-3);
  font-family: 'Press Start 2P';
  font-size: 10px;
  border: solid 1px #bb8225;
  max-width: 40ch;
}
</style>
