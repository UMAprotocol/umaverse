/* eslint-disable react/display-name */
import React from "react";
import { useRouter } from "next/router";
import { DownIcon } from "../Icons";
import * as UI from "./Header.styled";
import Image from "next/image";
import { useState } from "react";
import { COMMUNITY_LINKS } from "utils";

const NavLinks = () => {
  const router = useRouter();

  return (
    <UI.LinkList>
      {HEADER_LINKS.map((link) => (
        <UI.LinkListItem key={link.key}>
          {link.component({ path: router.pathname })}
        </UI.LinkListItem>
      ))}
    </UI.LinkList>
  );
};

export const Header: React.FunctionComponent = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const onToggle = () => {
    setShowMobileMenu((prevShowMobileMenu) => !prevShowMobileMenu);
  };

  return (
    <UI.Container>
      <UI.Content>
        <UI.LogoLink href="/">
          <UI.LogoLinkIcon src="/logo.svg" alt="UMA logo" />
        </UI.LogoLink>
        <UI.NavContainer>
          <NavLinks />
        </UI.NavContainer>
        <MenuToggle toggled={showMobileMenu} onToggle={onToggle} />
        <MobileMenuComponent show={showMobileMenu} onClickLink={onToggle} />
      </UI.Content>
    </UI.Container>
  );
};

const MobileMenuComponent: React.FC<{
  show: boolean;
  onClickLink: () => void;
}> = ({ show, onClickLink }) => {
  const router = useRouter();

  return (
    <UI.MobileMenuContainer show={show}>
      {MOBILE_HEADER_LINKS.map((link) =>
        link.component({ path: router.pathname, onClick: onClickLink })
      )}
      <UI.MobileCommunityLinks>
        {COMMUNITY_LINKS.map((link, idx) => (
          <UI.MobileCommunityLink key={idx} href={link.href} target="_blank">
            <Image src={link.iconSrc} alt={link.alt} width={25} height={25} />
          </UI.MobileCommunityLink>
        ))}
      </UI.MobileCommunityLinks>
    </UI.MobileMenuContainer>
  );
};

const MenuToggle: React.FC<{ toggled: boolean; onToggle: () => void }> = ({
  toggled,
  onToggle,
}) => {
  return (
    <UI.MenuToggleButton onClick={onToggle} toggled={toggled}>
      <span></span>
      <span></span>
      <span></span>
    </UI.MenuToggleButton>
  );
};

const CommunityDropdown: React.FunctionComponent = () => {
  return (
    <UI.CommunityDropdownContainer>
      <UI.DropdownButton>
        Community
        <DownIcon />
      </UI.DropdownButton>
      <UI.DropdownValuesContainer>
        <UI.CommunityLinks>
          {COMMUNITY_LINKS.map((link, idx) => (
            <UI.CommunityLink key={idx} href={link.href} target="_blank">
              <Image src={link.iconSrc} alt={link.alt} width={25} height={25} />
              <span>{link.name}</span>
            </UI.CommunityLink>
          ))}
        </UI.CommunityLinks>
      </UI.DropdownValuesContainer>
    </UI.CommunityDropdownContainer>
  );
};

const HEADER_LINKS = [
  {
    key: "Projects",
    component: ({ path }: { path: string }) => (
      <UI.NavLink href="/" active={path === "/"}>
        Projects
      </UI.NavLink>
    ),
  },
  {
    key: "Products",
    component: () => (
      <UI.NavLink href="https://uma.xyz">Homepage</UI.NavLink>
    ),
  },
  {
    key: "Docs",
    component: () => (
      <UI.NavLink href="https://docs.umaproject.org/" target="_blank">
        Docs
      </UI.NavLink>
    ),
  },
  {
    key: "Community",
    component: () => <CommunityDropdown />,
  },
  {
    key: "Vote",
    component: () => (
      <UI.NavLink href="https://vote.umaproject.org/">Vote</UI.NavLink>
    ),
  },
];

interface IHeaderLink {
  key: string;
  component: (args: { path: string; onClick?: () => void }) => JSX.Element;
}
const MOBILE_HEADER_LINKS: IHeaderLink[] = [
  {
    key: "Projects",
    component: ({ path, onClick }) => (
      <UI.MobileNavLink href="/" active={path === "/"} onClick={onClick}>
        Projects
      </UI.MobileNavLink>
    ),
  },
  {
    key: "Products",
    component: () => (
      <UI.MobileNavLink href="https://umaproject.org/products">
        Products
      </UI.MobileNavLink>
    ),
  },
  {
    key: "Docs",
    component: () => (
      <UI.MobileNavLink href="https://docs.umaproject.org/" target="_blank">
        Docs
      </UI.MobileNavLink>
    ),
  },
  {
    key: "Vote",
    component: () => (
      <UI.MobileNavLink href="https://vote.umaproject.org/">
        Vote
      </UI.MobileNavLink>
    ),
  },
];
