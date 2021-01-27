import { useCallback, useReducer } from "react";

const initialObject = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (initialState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...initialState,
        loading: false,
        data: action.resData,
        extra: action.extra,
      };
    case "ERROR":
      return {
        loading: false,
        error: action.errorMsg,
      };

    case "CLEAR_ERROR":
      return initialObject;
    default:
      throw new Error("Something went wrong!");
  }
};
const useHttp = () => {
  const [currentState, dispatchHttp] = useReducer(httpReducer, initialObject);

  const clear = useCallback(() => dispatchHttp({ type: "CLEAR_ERROR" }), []);

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: "SEND", identifier });
    fetch(url, {
      method,
      body,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        dispatchHttp({
          type: "RESPONSE",
          resData,
          extra,
        });
      })
      .catch((err) => {
        dispatchHttp({
          type: "ERROR",
          errorMsg: "Something went wrong",
        });
      });
  }, []);
  return {
    loading: currentState.loading,
    clear,
    data: currentState.data,
    error: currentState.error,
    sendRequest,
    extraData: currentState.extra,
    identifier: currentState.identifier,
  };
};

export default useHttp;
