<script setup lang="ts">
import UiButton from '@/ui/components/UiButton.vue';

const { text, canNext } = defineProps<{ text: string; canNext: boolean }>();
const emit = defineEmits<{ next: [] }>();

let nextId = 0;
const splitText = computed(() =>
  text.split('').map(char => ({ char, id: ++nextId }))
);
</script>

<template>
  <div class="text-box pointer-events-auto">
    <p>
      <span
        v-for="(letter, index) in splitText"
        :key="letter.id"
        :style="{ '--index': index }"
      >
        {{ letter.char }}
      </span>
    </p>
    <footer class="flex justify-end mt-3">
      <UiButton
        :disabled="!canNext"
        class="primary-button"
        @click="emit('next')"
      >
        Next
      </UiButton>
    </footer>
  </div>
</template>

<style scoped lang="postcss">
@keyframes textbox-char {
  from {
    opacity: 0%;
  }
  to {
    opacity: 100%;
  }
}
.text-box {
  position: fixed;
  right: var(--size-10);
  bottom: 20%;
  z-index: 10;
  color: #efef9f;
  background-color: #32021b;
  padding: var(--size-5);
  border: solid 6px #efef9f;
  border-right-color: #d7ad42;
  border-bottom-color: #d7ad42;
  box-shadow: 3px 3px 0 black;
  width: 45ch;

  > p {
    font-size: var(--font-size-2);
    text-wrap: balance;
    > span {
      opacity: 0;
      animation: textbox-char 0.025s forwards;
      animation-delay: calc(0.01s * var(--index));
    }
  }
}

button:disabled {
  opacity: 0;
  cursor: inherit;
  transform: translateY(var(--size-2));
  transition: all 0.2s var(--ease-1);
}
</style>
