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
