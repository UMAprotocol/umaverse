import React from "react";
import Head from "next/head";
import { Header } from "./Header";
import { MaxWidthWrapper } from "./Wrapper";
import { Footer } from "./Footer";

type Props = {
  title?: string;
};

export const Layout: React.FC<Props> = ({
  children,
  title = "This is the default title",
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    <MaxWidthWrapper>{children}</MaxWidthWrapper>
    <Footer />
  </div>
);
