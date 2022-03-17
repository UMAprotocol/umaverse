import React from "react";
import Image from "next/image";
import { Link } from "../Link";
import DropdownMenu, { IDropdownMenuLinks } from "./DropdownMenu";
import { LinkList, ListItem, SocialsList, ImageItem } from "./Header.styled";

const NavLinks: React.FC = () => {
  return (
    <>
      <LinkList>
        {HEADER_LINKS.map(({ key, component }) => (
          <ListItem key={key}>{component}</ListItem>
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

const productsDropdownLinks: IDropdownMenuLinks[] = [
  {
    href: "https://umaproject.org/products",
    name: "Optimistic Oracle",
  },
  {
    href: "https://docs.umaproject.org/synthetic-tokens/long-short-pair",
    name: "Long Short Pair (LSP)",
  },
  {
    href: "https://docs.umaproject.org/products/calloption",
    name: "Call/Put Options",
  },
  {
    href: "https://docs.umaproject.org/range-tokens/summary",
    name: "Range Tokens",
  },
  {
    href: "https://docs.umaproject.org/kpi-options/summary",
    name: "KPI Options",
  },
];

const HEADER_LINKS = [
  {
    key: "Getting Started",
    component: (
      <Link href="https://docs.umaproject.org/build-walkthrough/build-process">
        Getting Started
      </Link>
    ),
  },
  {
    key: "Products",
    component: <DropdownMenu links={productsDropdownLinks} />,
  },
  {
    key: "Projects",
    component: <Link href="https://projects.umaproject.org/">Projects</Link>,
  },
  {
    key: "Docs",
    component: <Link href="https://docs.umaproject.org/">Docs</Link>,
  },
  {
    key: "Vote",
    component: <Link href="https://vote.umaproject.org/">Vote</Link>,
  },
  {
    key: "Rewards",
    component: <Link href="https://claim.umaproject.org/">Rewards</Link>,
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
    href: "https://discourse.umaproject.org/",
    iconSrc: "/icons/discourse.svg",
    alt: "discourse",
  },
  {
    href: "https://discord.com/invite/jsb9XQJ",
    iconSrc: "/icons/discord.svg",
    alt: "discord",
  },
];

export default NavLinks;
