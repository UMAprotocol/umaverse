import React from "react";
import styled from "@emotion/styled";
import ReactMarkdown from "react-markdown";

type Props = {
  description: string;
};
export const About: React.FC<Props> = ({ description, ...delegated }) => {
  return (
    <Wrapper {...delegated}>
      <ReactMarkdown
        components={{ h1: Heading, p: Paragraph, ul: List, ol: List }}
      >
        {description}
      </ReactMarkdown>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: var(--sectionsVerticalDistance) 0;
`;
const Heading = styled.h1`
  font-size: ${26 / 16}rem;
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
