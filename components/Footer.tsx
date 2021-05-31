import React from "react";
import styled from "@emotion/styled";

import { QUERIES } from "../utils";

import { MaxWidthWrapper as UnstyledMaxWidthWrapper } from "./Wrapper";
import { Link } from "./Link";
import { BaseButton } from "./Button";

import Image from "next/image";

type TLink = {
  name: string;
  href: string;
};
const LINKS: TLink[] = [
  {
    href: "https://docs.umaproject.org/getting-started/overview",
    name: "How UMA Works",
  },
  {
    name: "Docs",
    href: "https://docs.umaproject.org",
  },
  { name: "FAQS", href: "https://umaproject.org/faq.html" },
  { name: "Contact", href: "mailto:hello@umaproject.org" },
  {
    name: "Getting Started",
    href: "https://docs.umaproject.org/build-walkthrough/build-process",
  },
  { name: "Vote", href: "https://vote.umaproject.org/" },
  { name: "Careers", href: "https://angel.co/company/uma-project/jobs" },
];

export const Footer: React.FC = () => (
  <Wrapper>
    <MaxWidthWrapper>
      <div>
        <Link href="/">
          <Image src="/logo.svg" width="100" height="25" />
        </Link>
        <Text>Risk Labs © 2020</Text>
      </div>
      <div>
        <nav>
          <List>
            <ol>
              {LINKS.slice(0, 4).map((link) => (
                <ListItem key={link.href}>
                  <Link href={link.href}>{link.name}</Link>
                </ListItem>
              ))}
            </ol>
            <ol>
              {LINKS.slice(4).map((link) => (
                <ListItem key={link.href}>
                  <Link href={link.href}>{link.name}</Link>
                </ListItem>
              ))}
            </ol>
          </List>
        </nav>
      </div>
      <div>
        <FooterHeading>Get UMA Updates</FooterHeading>
        <Text>
          Sign up for our newsletter to stay updated about the UMA project.
        </Text>
        <Form>
          <Input type="email" name="email" placeholder="satoshi@example.com" />
          <BaseButton type="submit">
            <Image src="/icons/arrow-right.svg" width="15" height="24" />
          </BaseButton>
        </Form>
      </div>
    </MaxWidthWrapper>
  </Wrapper>
);

const Wrapper = styled.footer`
  padding: 52px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  @media ${QUERIES.laptopAndUp} {
    padding: 72px 0;
  }
`;

const MaxWidthWrapper = styled(UnstyledMaxWidthWrapper)`
  display: flex;
  flex-direction: column;
  & > div:first-of-type {
    flex: 1 0 24%;
  }
  & > div:nth-of-type(2) {
    flex: 1 0 34%;
  }
  & > div:last-of-type {
    flex: 1 0 42%;
  }
  & > div:not(:first-of-type) {
    margin-top: 50px;
  }
  @media ${QUERIES.tabletAndUp} {
    flex-direction: row;
    & > div:not(:first-of-type) {
      margin-top: 0;
    }
  }
  @media ${QUERIES.laptopAndUp} {
    & > div:not(:first-of-type) {
      position: relative;
    }
  }
`;
const Text = styled.p`
  font-size: ${14 / 16}rem;
`;

const ListItem = styled.li`
  font-weight: bold;
  width: fit-content;
  transition: all ease-in 0.1s;

  &:hover {
    box-shadow: 0px 3px 0px 0px var(--primary);
  }
`;

const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  max-height: 160px;
  & > ol:first-of-type {
    padding-right: 90px;
  }
`;

const Form = styled.form`
  max-width: 320px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
`;

const Input = styled.input`
  width: 100%;
  font-size: ${14 / 16}rem;
  padding: 8px 24px 8px 0;
  background-color: transparent;
  border: none;
`;

const FooterHeading = styled.h6`
  color: var(--primary);
  font-weight: bold;
  margin-bottom: 8px;
`;
