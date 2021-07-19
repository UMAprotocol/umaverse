import { useQuery } from "react-query";
import { ethers } from "ethers";
import assert from "assert";

export default function useTokensCreatedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { data, error, refetch } = useQuery<TokensCreated[] | undefined | void>(
    "rewardsRetrievedEvents",
    () => {
      return queryTokensCreatedEvents(contract, address)
        .then((res) => res)
        .catch((err) => console.log(err));
    },
    { enabled: contract !== null && address !== null }
  );

  return { data, error, refetch };
}

/*
  event TokensCreated (
    address indexed sponsor,
    uint256 indexed collateralUsed,
    uint256 indexed tokensMinted,
  );
*/

export interface TokensCreated {
  address: string;
  collateralUsed: string;
  tokensMinted: string;
}

const queryTokensCreatedEvents = async (
  contract: ethers.Contract | null,
  address: string | null
) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // RewardsRetrieved(address,uint256,bytes32,uint256,bytes,uint256)
  const filter = contract.filters.TokensCreated(address, null, null);

  try {
    const events = await contract.queryFilter(filter, 0);
    const rewards = events.map((el) => {
      const { args } = el;
      const datum = {} as TokensCreated;
      if (args) {
        datum.address = args[0];
        datum.collateralUsed = args[1];
        datum.tokensMinted = args[2];
      }

      return datum;
    });

    return rewards;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};
