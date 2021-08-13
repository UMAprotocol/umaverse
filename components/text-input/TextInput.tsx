import React, { FC, Dispatch, SetStateAction } from "react";
import { StyledInput, Label } from "./TextInput.styled";

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label?: string;
  placeholder?: string;
  labelPlacement?: LabelPlacement;
  width?: string;
  // Optional arg: If there is some side effect of the change to the input
  // Pass in this function and it will run when the value changes
  additionalEffects?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // Optional arg: If you want to completely control what happens when this input changes
  // Define this function. Note: value is not set here unless specified in the custom function.
  customOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
}

export type LabelPlacement = "default | overlap";

const TextInput: FC<Props> = ({
  value,
  setValue,
  label,
  labelPlacement = "default" as LabelPlacement,
  width,
  additionalEffects,
  customOnChange,
  onKeyDown,
}) => {
  return (
    <StyledInput inputWidth={width}>
      <Label labelPlacement={labelPlacement}>{label}</Label>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (customOnChange) {
              return customOnChange(e);
            }

            setValue(e.target.value);
            if (additionalEffects) {
              return additionalEffects(e);
            }
          }}
          onKeyDown={onKeyDown}
        />
      </div>
    </StyledInput>
  );
};

export default TextInput;
