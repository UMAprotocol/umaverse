import React from "react";

import KPIOption from "../public/placeholders/kpi-option.svg";
import SyntheticAsset from "../public/placeholders/synthetic-asset.svg";
import YieldDollar from "../public/placeholders/yield-dollar.svg";
import Option from "../public/placeholders/option.svg";
import type { Category } from "../utils/constants";

type Props = {
  category: Category;
} & React.SVGAttributes<SVGElement>;

const placeholders: Record<
  Category,
  React.FunctionComponent<React.SVGAttributes<SVGElement>>
> = {
  "KPI Option": KPIOption,
  Option: Option,
  "Synthetic Asset": SyntheticAsset,
  "Yield Dollar": YieldDollar,
  "Range Token": SyntheticAsset,
  "Success Token": SyntheticAsset,
};

export const SynthPlaceholderIcon: React.FC<Props> = ({
  category,
  ...delegated
}) => {
  const Component = placeholders[category];
  if (!Component) {
    return null;
  }
  return <Component {...delegated} />;
};
