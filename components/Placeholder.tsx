import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

type Props = {
  width: number;
  height: number;
};
interface PlaceholderStyles extends React.CSSProperties {
  "--width": number;
  "--height": number;
}
export const Placeholder: React.FC<Props> = ({ width, height }) => {
  return (
    <Wrapper
      style={{ "--width": width, "--height": height } as PlaceholderStyles}
      animate={{ opacity: [0.2, 1] }}
    />
  );
};

const Wrapper = motion(styled.div`
  width: var(--width);
  min-height: var(--height);
  background-color: var(--gray-300);
`);
