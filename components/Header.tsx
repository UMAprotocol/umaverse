import React, { useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { motion } from "framer-motion";
import { DialogOverlay, DialogContent } from "@reach/dialog";

import { MaxWidthWrapper } from "./Wrapper";
import { Link } from "./Link";
import { BaseButton } from "./Button";
import { QUERIES } from "../utils";
import Logo from "../public/logo.svg";

type MobileMenuProps = {
  isOpen: boolean;
};
const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
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

const CloseButton = styled(BaseButton)`
  width: 32px;
  height: 32px;
  position: relative;
`;

type MenuToggleProps = {
  toggle: () => void;
};
const MenuToggle: React.FC<MenuToggleProps> = ({ toggle }) => {
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

const Slice = styled(motion.div)`
  min-height: 2px;
  background-color: var(--black);
  position: absolute;
  left: 0;
  right: 0;
`;
const Overlay = styled(motion(DialogOverlay))`
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-transparent-dark);
`;
const Content = styled(motion(DialogContent))`
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  padding: 40px 12px 12px;
`;

const HEADER_LINKS = [
  {
    href: "https://docs.umaproject.org/build-walkthrough/build-process",
    name: "Getting Started",
  },
  {
    href: "/",
    name: "Products",
  },
  {
    href: "https://projects.umaproject.org/",
    name: "Projects",
  },
  {
    href: "https://docs.umaproject.org/",
    name: "Docs",
  },
  {
    href: "https://vote.umaproject.org/",
    name: "Vote",
  },
  {
    href: "https://claim.umaproject.org/",
    name: "Rewards",
  },
];
const SOCIAL_LINKS = [
  {
    href: "https://medium.com/uma-project",
    iconSrc: "/icons/medium.svg",
    alt: "medium",
  },
  {
    href: "https://github.com/umaprotocol",
    iconSrc: "/icons/github.svg",
    alt: "github",
  },
  {
    href: "https://twitter.com/umaprotocol",
    iconSrc: "/icons/twitter.svg",
    alt: "twitter",
  },
  {
    href: "https://discord.com/invite/jsb9XQJ",
    iconSrc: "/icons/discord.svg",
    alt: "discord",
  },
];
const NavLinks = () => {
  return (
    <>
      <LinkList>
        {HEADER_LINKS.map((link) => (
          <ListItem key={link.name}>
            <Link href={link.href}>{link.name}</Link>
          </ListItem>
        ))}
      </LinkList>
      <SocialsList>
        {SOCIAL_LINKS.map((socialLink) => (
          <ImageItem key={socialLink.alt}>
            <Link href={socialLink.href}>
              <Image
                src={socialLink.iconSrc}
                alt={socialLink.alt}
                width={30}
                height={30}
              />
            </Link>
          </ImageItem>
        ))}
      </SocialsList>
    </>
  );
};

export const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <Wrapper>
      <MaxWidth>
        <Link href="/">
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

const Wrapper = styled.header`
  position: sticky;
  height: 100px;
  padding: 40px 0 30px;
  @media ${QUERIES.laptopAndUp} {
    padding: 50px 0 55px;
    height: 140px;
  }
`;

const MaxWidth = styled(MaxWidthWrapper)`
  display: flex;
  align-items: center;
`;

const Navigation = styled.nav`
  display: none;
  margin-left: auto;
  @media ${QUERIES.laptopAndUp} {
    display: revert;
  }
`;

const MobileNavigation = motion(styled(Navigation)`
  display: revert;
  @media ${QUERIES.laptopAndUp} {
    display: none;
  }
`);

const LinkList = styled.ol`
  display: inline-flex;
  flex-direction: column;
  font-weight: 600;
  @media ${QUERIES.laptopAndUp} {
    flex-direction: revert;
    & > *:not(:last-of-type) {
      margin-right: 32px;
    }
  }
`;
const ListItem = styled.li`
  width: fit-content;
  transition: all ease-in 0.1s;

  &:hover {
    box-shadow: 0px 3px 0px 0px var(--primary);
  }
`;
const ImageItem = styled.li`
  opacity: 1;
  transition: all ease-in 0.1s;
  &:hover {
    opacity: 0.5;
  }
`;
const SocialsList = styled(LinkList)`
  flex-direction: row;
  & > *:not(:last-of-type) {
    margin-right: 32px;
  }
  margin-top: 16px;
  @media ${QUERIES.laptopAndUp} {
    margin-left: 85px;
    margin-top: 0;
  }
`;
