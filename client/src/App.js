import React, { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend";
import { useQuery, useSubscription, useApolloClient } from "@apollo/client";
import {
  GET_AUTHORS,
  GET_BOOKS,
  CURRENT_USER,
  BOOK_ADDED,
  GET_GENRES,
} from "./queries";
import Toast from "./components/Toast";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState("books");

  const { data: authors, loading: loadingAuthors } = useQuery(GET_AUTHORS);
  const {
    data: books,
    loading: loadingBooks,
    refetch: refetchBooks,
  } = useQuery(GET_BOOKS);

  const { data: user, loading: loadingUser, refetch: refetchUser } = useQuery(
    CURRENT_USER
  );

  const { data: genres, loading: loadingGenres } = useQuery(GET_GENRES);

  // const { data: bookAdded } = useSubscription(BOOK_ADDED);

  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const title = subscriptionData.data.bookAdded.title;
      window.alert(`${title} added`);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    if (token) {
      setToken(token);
      refetchUser();
    }
  }, [token, refetchUser]);

  if (loadingAuthors || loadingBooks || loadingUser || loadingGenres) {
    return <p>Loading...</p>;
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("books");
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommend")}>recommend</button>
        )}
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Toast errorMessage={errorMessage} />
      <Authors
        show={page === "authors"}
        authors={authors?.allAuthors}
        setError={notify}
        token={token}
      />
      <Books
        show={page === "books"}
        initialBooks={books?.allBooks}
        refetchBooks={refetchBooks}
        initialGenres={genres.genres}
      />
      <NewBook show={page === "add"} setPage={setPage} />
      <Recommend
        show={page === "recommend"}
        books={books?.allBooks}
        user={user?.me}
      />
      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setError={notify}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
