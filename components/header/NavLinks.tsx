import React from "react";
import Image from "next/image";
import { Link } from "../Link";
import { LinkList, ListItem, SocialsList, ImageItem } from "./Header.styled";

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
