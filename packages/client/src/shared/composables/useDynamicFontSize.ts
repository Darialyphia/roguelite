export const useDynamicFontSize = (
  text: MaybeRefOrGetter<string>,
  {
    minFontSize,
    maxFontSize,
    maxLineLength
  }: { minFontSize: number; maxFontSize: number; maxLineLength: number }
) => {
  return computed(() => {
    const _text = toValue(text);
    const minViewportWidth = 1;
    const maxViewportWidth = 1900;
    const textLength = _text.length;

    const relativeMaxFontSize =
      textLength > maxLineLength
        ? minFontSize
        : maxFontSize -
          ((maxFontSize - minFontSize) * textLength) / maxLineLength;

    const relativeMaxViewportWidth =
      maxViewportWidth * (minFontSize / relativeMaxFontSize);

    const relativeMinViewportWidth =
      minViewportWidth * (maxFontSize / relativeMaxFontSize);

    const viewportWidth =
      (100 * (maxFontSize - minFontSize)) /
      (relativeMaxViewportWidth - relativeMinViewportWidth);

    const relativeFontSize =
      (relativeMinViewportWidth * maxFontSize -
        relativeMaxViewportWidth * minFontSize) /
      (relativeMinViewportWidth - relativeMaxViewportWidth);

    return `clamp(${minFontSize / 16}rem, ${viewportWidth}vw + ${
      relativeFontSize / 16
    }rem, ${relativeMaxFontSize / 16}rem)`;
  });
};
