import React, { FC } from "react";
import { CloseButton, Slice } from "./Header.styled";
type MenuToggleProps = {
  toggle: () => void;
};

const MenuToggle: FC<MenuToggleProps> = ({ toggle }) => {
  return (
    <CloseButton onClick={() => toggle()}>
      <Slice
        variants={{
          open: {
            y: [0, 0],
            rotate: [0, 45],
            backgroundColor: "#aaa",
          },
          closed: {
            y: 10,
            rotate: 0,
          },
        }}
      />
      <Slice
        variants={{
          open: {
            opacity: 0,
          },
          closed: {
            opacity: 1,
          },
        }}
      />
      <Slice
        variants={{
          open: {
            y: [0, 0],
            rotate: [0, -45],
            backgroundColor: "#aaa",
          },
          closed: {
            y: -10,
            rotate: 0,
          },
        }}
      />
    </CloseButton>
  );
};

export default MenuToggle;
