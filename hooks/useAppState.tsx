import React, { createContext, FC, useReducer, Dispatch } from "react";
import { EmpState, LspState } from "../utils/umaApi";

const UPDATE_CONTRACTS = "UPDATE_CONTRACTS";
const SET_ERROR = "SET_ERROR";
const RESET_STATE = "RESET_STATE";

interface Contracts {
  [address: string]: LspState | EmpState;
}
export interface ContextState {
  contracts: Contracts;
  error: Error | null;
}

export const actions = {
  UPDATE_CONTEXT: UPDATE_CONTRACTS as typeof UPDATE_CONTRACTS,
  SET_ERROR: SET_ERROR as typeof SET_ERROR,
  RESET_STATE: RESET_STATE as typeof RESET_STATE,
};

type Action =
  | {
      type: `${typeof UPDATE_CONTRACTS}`;
      payload: Contracts;
    }
  | {
      type: typeof SET_ERROR;
      payload: Error | null;
    }
  | { type: typeof RESET_STATE };

const INITIAL_STATE = {
  contracts: {},
  error: null,
};

function reducer(state: ContextState, action: Action) {
  switch (action.type) {
    case UPDATE_CONTRACTS: {
      return {
        ...state,
        contracts: action.payload,
      };
    }

    case SET_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }
    case RESET_STATE: {
      return INITIAL_STATE;
    }
    default: {
      throw new Error(`Unsupported action type ${(action as any).type}`);
    }
  }
}

export type AppDispatch = Dispatch<Action>;

export interface TAppContext {
  state: ContextState;
  dispatch: AppDispatch;
}

export const AppContext = createContext<TAppContext>({} as TAppContext);

AppContext.displayName = "AppContext";

type WithDelegatedProps = {
  [k: string]: unknown;
};

const AppProvider: FC<WithDelegatedProps> = ({ children, ...delegated }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <AppContext.Provider value={{ state, dispatch }} {...delegated}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
