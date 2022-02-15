import React, { useState, FC } from "react";

import { Link } from "../Link";
import Logo from "../../public/logo.svg";
import NavLinks from "./NavLinks";
import MenuToggle from "./MenuToggle";
import MobileMenu from "./MobileMenu";
import {
  Wrapper,
  MaxWidth,
  Navigation,
  MobileNavigation,
} from "./Header.styled";

export const Header: FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <Wrapper>
      <MaxWidth>
        <Link href="https://umaproject.org">
          <Logo />
        </Link>
        <Navigation>
          <NavLinks />
        </Navigation>
        <MobileNavigation animate={showMobileMenu ? "open" : "closed"}>
          <MobileMenu isOpen={showMobileMenu} />
          <MenuToggle toggle={() => setShowMobileMenu(!showMobileMenu)} />
        </MobileNavigation>
      </MaxWidth>
    </Wrapper>
  );
};

export default Header;
