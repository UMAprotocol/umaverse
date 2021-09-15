/* eslint-disable */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Eip1193Bridge } from "@ethersproject/experimental/lib/eip1193-bridge";
import { ethers } from "@ethersproject/experimental/node_modules/ethers";

// const TEST_PRIVATE_KEY = Cypress.env('INTEGRATION_TEST_PRIVATE_KEY')
const PRIVATE_KEY_TEST_NEVER_USE =
  // "0xad20c82497421e9784f18460ad2fe84f73569068e98e270b3e63743268af5763";
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// address of the above key
export const TEST_ADDRESS_NEVER_USE = new Wallet(PRIVATE_KEY_TEST_NEVER_USE)
  .address;

export const TEST_ADDRESS_NEVER_USE_SHORTENED = `${TEST_ADDRESS_NEVER_USE.substr(
  0,
  6
)}...${TEST_ADDRESS_NEVER_USE.substr(-4, 4)}`;

class CustomizedBridge extends Eip1193Bridge {
  // chainId = 4;

  async sendAsync(...args) {
    console.debug("sendAsync called", ...args);
    return this.send(...args);
  }
  async send(...args) {
    console.debug("send called", ...args);
    const isCallbackForm =
      typeof args[0] === "object" && typeof args[1] === "function";
    let callback;
    let method;
    let params;
    if (isCallbackForm) {
      callback = args[1];
      method = args[0].method;
      params = args[0].params;
    } else {
      method = args[0];
      params = args[1];
    }
    if (method === "eth_requestAccounts" || method === "eth_accounts") {
      if (isCallbackForm) {
        callback({ result: [TEST_ADDRESS_NEVER_USE] });
      } else {
        return Promise.resolve([TEST_ADDRESS_NEVER_USE]);
      }
    }
    if (method === "eth_chainId") {
      if (isCallbackForm) {
        callback(null, { result: "0x4" });
      } else {
        return Promise.resolve("0x4");
      }
    }
    try {
      const result = await super.send(method, params);
      console.debug("result received", method, params, result);
      if (isCallbackForm) {
        callback(null, { result });
      } else {
        return result;
      }
    } catch (error) {
      if (isCallbackForm) {
        callback(error, null);
      } else {
        throw error;
      }
    }
  }
}

// sets up the injected provider to be a mock ethereum provider with the given mnemonic/index
Cypress.Commands.overwrite("visit", (original, url, options) => {
  return original(
    url.startsWith("/") && url.length > 2 && !url.startsWith("/#")
      ? `/#${url}`
      : url,
    {
      ...options,
      onBeforeLoad(win) {
        options && options.onBeforeLoad && options.onBeforeLoad(win);
        win.localStorage.clear();
        win.localStorage.setItem("cypress-testing", true);
        // const provider = new JsonRpcProvider(
        //   `https://kovan.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`,
        //   4
        // );
        // const provider = new ethers.providers.WebSocketProvider(
        //   "http://127.0.0.1:9545"
        // );
        const provider = new ethers.getDefaultProvider("http://127.0.0.1:8545");

        const signer = new Wallet(PRIVATE_KEY_TEST_NEVER_USE, provider);
        win.ethereum = new CustomizedBridge(signer, provider);
      },
    }
  );
});
