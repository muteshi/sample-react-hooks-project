import React, { useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/http";

import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";
const URL =
  "https://react-hooks-ceef0-default-rtdb.firebaseio.com/ingredients.json";

const Search = React.memo(({ onLoadIngs }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef();
  const { loading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    if (!loading && !error && data) {
      const loadedData = [];
      for (const key in data) {
        loadedData.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadIngs(loadedData);
    }
  }, [data, loading, error, onLoadIngs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === inputRef.current.value) {
        const searchQuery =
          query.length === 0 ? "" : `?orderBy="title"&equalTo="${query}"`;

        sendRequest(URL + searchQuery, "GET");
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [query, sendRequest, inputRef]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <span>Loading...</span>}
          <input
            type="text"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
