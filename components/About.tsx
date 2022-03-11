import React, { useEffect, useRef } from "react";

import styled from "@emotion/styled";
import ReactMarkdown from "react-markdown";

type Props = {
  description: string;
};

export const About: React.FC<Props> = ({ description, ...delegated }) => {
  // for some reason eslint wont pass when importing the type from remark-breaks, so this is left as any
  // eslint-disable-next-line
  const plugins = useRef<any[]>([]);
  useEffect(() => {
    async function loadPlugins() {
      const remarkBreaks = (await import("remark-breaks")).default;
      plugins.current = [remarkBreaks];
    }
    loadPlugins();
  }, []);

  return (
    <Wrapper {...delegated}>
      <ReactMarkdown
        remarkPlugins={plugins.current}
        components={{
          h1: Heading,
          h2: Subheading,
          h3: Subheading,
          h4: Subheading,
          h5: Subheading,
          h6: Subheading,
          p: Paragraph,
          ul: List,
          ol: List,
        }}
      >
        {description}
      </ReactMarkdown>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: var(--sectionsVerticalDistance) 0;

  & a {
    color: var(--primary);
  }
`;
const Heading = styled.h1`
  font-size: ${26 / 16}rem;
  font-weight: 700;
`;

const Subheading = styled.h3`
  font-size: ${22 / 16}rem;
  font-weight: 700;
`;

const Paragraph = styled.p`
  max-width: 60ch;
  margin-block-start: 1em;
`;

const List = styled.ul`
  list-style: revert;
  padding-left: 15px;
`;
