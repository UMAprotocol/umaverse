import React from "react";
import styled from "@emotion/styled";

import { Card as UnstyledCard } from "./Card";
import { Value } from "./Value";

import { formatMillions, formatWeiString, QUERIES } from "../utils";
import type { Synth } from "../utils/umaApi";

type Props = {
  synth: Synth<{ type: "emp" }>;
  change24h: number;
};

export const EmpHero: React.FC<Props> = ({ synth, change24h }) => {
  return (
    <CardWrapper>
      <Card>
        <CardContent>
          <CardHeading>
            Total Value Locked <span>(TVL)</span>
          </CardHeading>
          <Value
            value={synth.tvl || "0"}
            format={(v) => {
              const formattedValue = formatWeiString(v);
              return (
                <>
                  ${formatMillions(Math.floor(formattedValue))}{" "}
                  <span style={{ fontWeight: 400 }}>
                    {formattedValue >= 10 ** 9
                      ? "B"
                      : formattedValue >= 10 ** 6
                      ? "M"
                      : ""}
                  </span>
                </>
              );
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <CardHeading>Token Price</CardHeading>
          <Value
            value={synth.tokenMarketPrice}
            format={(v) => `$${formatWeiString(v).toFixed(2)}`}
          ></Value>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <CardHeading>
            Change <span>(24h)</span>
          </CardHeading>
          <Value
            value={change24h}
            format={(v) => (
              <span
                style={{
                  color:
                    v > 0
                      ? "var(--green)"
                      : v < 0
                      ? "var(--primary)"
                      : "var(--gray-700)",
                }}
              >
                {v} %
              </span>
            )}
          />
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

const Card = styled(UnstyledCard)`
  position: relative;
`;
const CardContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  & > h3 {
    font-weight: 700;
  }
  & > div {
    color: var(--primary);
    font-size: clamp(1.375rem, 1.3vw + 1.1rem, 2.25rem);
    font-weight: 700;
  }
`;

const CardHeading = styled.h3`
  font-weight: 600;
  & > span {
    font-weight: 300;
  }
`;
const CardWrapper = styled.div`
  color: var(--gray-700);
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: auto;
  row-gap: 10px;
  margin-top: 30px;
  @media ${QUERIES.tabletAndUp} {
    column-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: fit-content 1fr;
  }
`;
