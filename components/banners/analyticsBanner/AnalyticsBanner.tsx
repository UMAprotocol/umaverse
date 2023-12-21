import React from "react";
import * as UI from "./AnalyticsBanner.styled";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const AnalyticsBanner: React.FC = () => {
  return (
    <UI.Wrapper>
      <UI.AlertIcon />
      <UI.TextSmall>View Dune Dashboard</UI.TextSmall>
      <UI.TextLarge>
        Explore the latest UMA insights and data on our new Stats page
      </UI.TextLarge>

      <UI.Divider />
      <UI.Link target="_blank" href="https://stats.uma.xyz/">
        <UI.LargeScreenOnly>View Dune Dashboard</UI.LargeScreenOnly>
        <UI.Arrow icon={faArrowRight} />
      </UI.Link>
    </UI.Wrapper>
  );
};
