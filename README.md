/* eslint no-use-before-define: 0 */  // --> OFF
# TypeScript Next.js example

This is a really simple project that shows the usage of Next.js with TypeScript.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-typescript&project-name=with-typescript&repository-name=with-typescript)

## How to use it?

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-typescript with-typescript-app
# or
yarn create next-app --example with-typescript with-typescript-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Notes

This example shows how to integrate the TypeScript type system into Next.js. Since TypeScript is supported out of the box with Next.js, all we have to do is to install TypeScript.

```
npm install --save-dev typescript
```

To enable TypeScript's features, we install the type declarations for React and Node.

```
npm install --save-dev @types/react @types/react-dom @types/node
```

When we run `next dev` the next time, Next.js will start looking for any `.ts` or `.tsx` files in our project and builds it. It even automatically creates a `tsconfig.json` file for our project with the recommended settings.

Next.js has built-in TypeScript declarations, so we'll get autocompletion for Next.js' modules straight away.

A `type-check` script is also added to `package.json`, which runs TypeScript's `tsc` CLI in `noEmit` mode to run type-checking separately. You can then include this, for example, in your `test` scripts.

## Testing LSP
See our [Hardhat repo](https://github.com/UMAprotocol/hardhat-test) for how to add UMA to a dev account and fork mainnet.

Send UMA to this contract to test Mint / Redeem feature: 0x372802d8A2D69bB43872a1AABe2bd403a0FafA1F

## Enviroment Variables

This section is meant to serve as a complete description of all the env variables used in Umaverse

| Name                        	| Status   	| Description                                                                                                                 	|
|-----------------------------	|----------	|-----------------------------------------------------------------------------------------------------------------------------	|
| SENTRY_PROJECT              	| Required 	| Sentry specific variable, check https://docs.sentry.io/platforms/javascript/guides/nextjs/ for more info                    	|
| SENTRY_ORG                  	| Required 	| Sentry specific variable, check https://docs.sentry.io/platforms/javascript/guides/nextjs/ for more info                    	|
| SENTRY_URL                  	| Required 	| Sentry specific variable, check https://docs.sentry.io/platforms/javascript/guides/nextjs/ for more info                    	|
| SENTRY_DNS                  	| Required 	| Sentry specific variable, check https://docs.sentry.io/platforms/javascript/guides/nextjs/ for more info                    	|
| NEXT_PUBLIC_SENTRY_DSN      	| Required 	| Sentry specific variable, check https://docs.sentry.io/platforms/javascript/guides/nextjs/ for more info                    	|
| SENTRY_SERVER_INIT_PATH     	| Required 	| Sentry specific variable, check https://docs.sentry.io/platforms/javascript/guides/nextjs/ for more info                    	|
| SENTRY_AUTH_TOKEN           	| Required 	| Sentry specific variable, check https://docs.sentry.io/platforms/javascript/guides/nextjs/ for more info                    	|
| CONTENTFUL_SPACE_ID         	| Required 	| Contentful Space ID, needed to fetch from the CMS.                                                                          	|
| CONTENTFUL_ACCESS_TOKEN     	| Required 	| Contentful Access token, needed to fetch from the CMS.                                                                      	|
| NEXT_PUBLIC_UMA_API_URL     	| Required 	| The url of the UMA api, used to query synths data.                                                                          	|
| NEXT_PUBLIC_INFURA_ID       	| Required 	| InfuraID of the Infura project node used to query onchain data.                                                             	|
| NEXT_PUBLIC_ONBOARD_API_KEY 	| Required 	| Onboard API key, needed for using bnc-onboard. Check https://docs.blocknative.com/onboard for more info.                    	|
| NEXT_PUBLIC_PORTIS_API_KEY  	| Optional 	| Portis API key, needed to support log in with portis and onboard. Check https://docs.blocknative.com/onboard for more info. 	|
