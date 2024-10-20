const brandSymbol: unique symbol = Symbol('brand');

type Brand<B> = { [brandSymbol]: B };
export type Branded<T, B> = T & Brand<B>;

export function createBrand<T>() {
  return function <B>(name: B) {
    return [
      (value: T): Branded<T, B> => {
        // @ts-expect-error
        value[brandSymbol] = name;

        return value as Branded<T, B>;
      },
      (value: T): value is Branded<T, B> => {
        // @ts-expect-error
        return !!brandSymbol[value];
      }
    ] as const;
  };
}

export function createStringBrand<B>(name: B) {
  return createBrand<string>()(name);
}
