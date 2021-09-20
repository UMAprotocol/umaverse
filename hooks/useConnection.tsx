import React from "react";
import { ethers } from "ethers";

enum ActionType {
  CONNECT,
  DISCONNECT,
  UPDATE,
  UPDATE_FROM_ERROR,
  ERROR,
}
type ConnectionManagerState = {
  provider?: any;
  account?: string;
  connector?: any;
  chainId?: number;
  error?: Error;
};
type Action =
  | {
      type: ActionType.CONNECT;
      payload: ConnectionManagerState;
    }
  | {
      type: ActionType.DISCONNECT;
    }
  | {
      type: ActionType.UPDATE | ActionType.UPDATE_FROM_ERROR;
      payload: ConnectionManagerState;
    }
  | {
      type: ActionType.ERROR;
      payload: Pick<ConnectionManagerState, "error">;
    };

function reducer(
  state: ConnectionManagerState,
  action: Action
): ConnectionManagerState {
  switch (action.type) {
    case ActionType.CONNECT: {
      return { ...state, ...action.payload };
    }
    case ActionType.DISCONNECT: {
      return {};
    }
    case ActionType.ERROR: {
      const { error } = action.payload;
      return {
        ...state,
        error,
      };
    }
    case ActionType.UPDATE: {
      const { provider, account, chainId, connector } = action.payload;
      return {
        ...state,
        ...(provider ? { provider } : {}),
        ...(account ? { account } : {}),
        ...(chainId ? { chainId } : {}),
        ...(connector ? { connector } : {}),
      };
    }
    case ActionType.UPDATE_FROM_ERROR: {
      const { provider, account, chainId, connector } = action.payload;
      return {
        ...state,
        ...(provider ? { provider } : {}),
        ...(account ? { account } : {}),
        ...(chainId ? { chainId } : {}),
        ...(connector ? { connector } : {}),
        error: undefined,
      };
    }
  }
}

function useConnectionManager() {
  const [state, dispatch] = React.useReducer(reducer, {});

  const { provider, account, chainId, connector, error } = state;

  const connect = React.useCallback((payload: ConnectionManagerState) => {
    dispatch({
      type: ActionType.CONNECT,
      payload,
    });
  }, []);
  const disconnect = React.useCallback(() => {
    dispatch({ type: ActionType.DISCONNECT });
  }, []);
  const setError = React.useCallback((error: Error) => {
    dispatch({ type: ActionType.ERROR, payload: { error } });
  }, []);
  const update = React.useCallback(
    (update: ConnectionManagerState) => {
      if (error) {
        dispatch({
          type: ActionType.UPDATE_FROM_ERROR,
          payload: { ...update },
        });
        return;
      }

      dispatch({ type: ActionType.UPDATE, payload: { ...update } });
    },
    [error]
  );

  return {
    provider,
    account,
    connector,
    chainId,
    error,

    connect,
    disconnect,
    update,
    setError,
  };
}

type ConnectionState = {
  provider?: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  connect: (payload: ConnectionManagerState) => void;
  disconnect: () => void;
  update: (update: ConnectionManagerState) => void;
  setError: (error: Error) => void;
  isConnected: boolean;
} & Omit<ConnectionManagerState, "provider">;

export const ConnectionContext = React.createContext<
  undefined | ConnectionState
>(undefined);
ConnectionContext.displayName = "ConnectionContext";

export const ConnectionProvider: React.FC = ({ children }) => {
  const {
    provider,
    account,
    chainId,
    connector,
    error,
    connect,
    disconnect,
    update,
    setError,
  } = useConnectionManager();

  const isConnected = provider != null && chainId != null && account != null;
  const wrappedProvider = provider
    ? new ethers.providers.Web3Provider(provider)
    : undefined;
  const signer = wrappedProvider ? wrappedProvider.getSigner() : undefined;

  const value: ConnectionState = {
    provider: wrappedProvider,
    signer,
    account,
    chainId,
    connector,
    error,

    connect,
    disconnect,
    update,
    setError,

    isConnected,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};
export function useConnection() {
  const context = React.useContext(ConnectionContext);
  if (!context) {
    throw new Error("UseConnection must be used within a <ConnectionProvider>");
  }
  return context;
}
