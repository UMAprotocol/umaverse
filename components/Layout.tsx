import React from "react";
import Head from "next/head";
import Header from "./header";
import styled from "@emotion/styled";
import { Footer } from "./Footer";

type Props = {
  title?: string;
};

export const Layout: React.FC<Props> = ({
  children,
  title = "This is the default title",
}) => (
  <StyledLayout
    style={{
      width: "100%",
      // Do not change these properties. Required for dropdown in the navbar to overlay the input in this section
      position: "relative",
      zIndex: -1,
    }}
  >
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      {/* Favicon links made with  https://realfavicongenerator.net/ */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
    <Header />
    {children}
    <Footer />
  </StyledLayout>
);

const StyledLayout = styled.div``;
