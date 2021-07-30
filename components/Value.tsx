import React from "react";

type Props =
  | {
      value: number | string;
      defaultValue?: string;
      format?: (v: number | string) => React.ReactNode;
    }
  | {
      value?: number | string;
      defaultValue: string;
      format?: (v: number | string) => React.ReactNode;
    };

export const Value: React.FC<Props> = ({
  value,
  format = (v) => v,
  defaultValue: _defaultValue,
}) => {
  const defaultValue = _defaultValue ?? "-";
  return <div>{value != undefined ? format(value) : defaultValue}</div>;
};
