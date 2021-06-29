import React, { FC, Dispatch, SetStateAction } from "react";
import { StyledInput } from "./TextInput.styled";

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label?: string;
  placeholder?: string;
}

const TextInput: FC<Props> = ({ value, setValue, label }) => {
  return (
    <StyledInput>
      <label className="label">{label}</label>
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
