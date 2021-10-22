import * as dotenv from "dotenv";
import * as cypress from "cypress";
import * as api from "@uma/api";
dotenv.config();

api.apps
  .lsp_api(process.env)
  .then(() => {
    return cypress.run({
      // the path is relative to the current working directory
      spec: "./cypress/integration/lsp-tokens/lsp-all-tests.js",
    });
  })
  .then(() => {
    console.log("test done");
    process.exit();
  })
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });
