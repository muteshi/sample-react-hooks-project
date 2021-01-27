import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import useHttp from "../../hooks/http";
import ErrorModal from "../UI/ErrorModal";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const URL =
  "https://react-hooks-ceef0-default-rtdb.firebaseio.com/ingredients.json";

const ingReducer = (currentIngs, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngs, action.ingredient];
    case "DELETE":
      return currentIngs.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Something went wrong!");
  }
};

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingReducer, []);

  const {
    loading,
    error,
    clear,
    data,
    sendRequest,
    extraData,
    identifier,
  } = useHttp();

  useEffect(() => {
    if (!loading && !error && identifier === "REMOVE_INGREDIENT") {
      dispatch({
        type: "DELETE",
        id: extraData,
      });
    } else if (!loading && !error && identifier === "ADD_INGREDIENT") {
      dispatch({
        type: "ADD",
        ingredient: { id: data.name, ...extraData },
      });
    }
  }, [data, extraData, identifier, loading, error]);

  const searchedIngsHandler = useCallback((res) => {
    dispatch({
      type: "SET",
      ingredients: res,
    });
  }, []);

  const addIngHandler = useCallback(
    (ing) => {
      sendRequest(URL, "POST", JSON.stringify(ing), ing, "ADD_INGREDIENT");

      // dispatchHttp({
      //   type: "SEND",
      // });
      // fetch(URL, {
      //   method: "POST",
      //   body: JSON.stringify(ing),
      //   Headers: { "Content-Type": "application/json" },
      // }).then((res) => {
      //   dispatchHttp({
      //     type: "RESPONSE",
      //   });
      //   return res.json().then((data) => {
      //     //get latest state and add to existing one
      //     dispatch({
      //       type: "ADD",
      //       ingredient: { id: data.name, ...ing },
      //     });
      //   });
      // });
    },
    [sendRequest]
  );

  const removeIngHandler = useCallback(
    (ingId) => {
      sendRequest(
        `https://react-hooks-ceef0-default-rtdb.firebaseio.com/ingredients/${ingId}.json`,
        "DELETE",
        null,
        ingId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const ingList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngHandler}
      />
    );
  }, [ingredients, removeIngHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIng={addIngHandler} loading={loading} />

      <section>
        <Search onLoadIngs={searchedIngsHandler} />
        {ingList}
      </section>
    </div>
  );
};

export default Ingredients;
