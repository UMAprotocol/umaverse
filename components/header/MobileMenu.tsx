import React, { FC } from "react";
import { Overlay, Content } from "./Header.styled";
import NavLinks from "./NavLinks";

type MobileMenuProps = {
  isOpen: boolean;
};

const MobileMenu: FC<MobileMenuProps> = ({ isOpen }) => {
  return (
    <Overlay isOpen={isOpen}>
      <Content
        aria-label="Menu"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: -5, opacity: 1 }}
      >
        <NavLinks />
      </Content>
    </Overlay>
  );
};

export default MobileMenu;
