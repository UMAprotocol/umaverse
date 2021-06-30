import React, { FC, Dispatch, SetStateAction } from "react";
import { StyledInput, Label } from "./TextInput.styled";

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label?: string;
  placeholder?: string;
  labelPlacement?: LabelPlacement;
  width?: number;
}

export type LabelPlacement = "default | overlap";

const TextInput: FC<Props> = ({
  value,
  setValue,
  label,
  labelPlacement = "default" as LabelPlacement,
  width,
}) => {
  return (
    <StyledInput width={width}>
      <Label labelPlacement={labelPlacement}>{label}</Label>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </StyledInput>
  );
};

export default TextInput;
