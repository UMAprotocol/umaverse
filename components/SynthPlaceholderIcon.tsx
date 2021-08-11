import React from "react";
import Image, { ImageProps } from "next/image";

import { CATEGORIES_PLACEHOLDERS } from "../utils";
import type { Category } from "../utils/constants";

type Props = {
  category: Category;
} & Omit<ImageProps, "src">;

export const SynthPlaceholderIcon: React.FC<Props> = ({
  category,
  ...delegated
}) => {
  const src = CATEGORIES_PLACEHOLDERS[category];
  if (!src) {
    return null;
  }
  return (
    // @ts-expect-error TS complains about src being of type string instead of StaticImport, but can't typecast because StaticImport is not exported
    <Image
      width={52}
      height={52}
      alt={category}
      layout="fixed"
      {...delegated}
      src={src}
    />
  );
};
