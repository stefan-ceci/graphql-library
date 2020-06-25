import React, { useState } from "react";
import { ADD_BOOK, GET_BOOKS, GET_AUTHORS, GET_GENRES } from "../queries";
import { useMutation } from "@apollo/client";

const NewBook = ({ show, setPage }) => {
  const [title, setTitle] = useState("");
  const [author, setAuhtor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: GET_BOOKS },
      { query: GET_AUTHORS },
      { query: GET_GENRES },
    ],
    onCompleted: () => {
      setPage("books");
    },
    // update: (store, response) => {
    //   const dataInStore = store.readQuery({ query: GET_BOOKS });
    //
    //   store.writeQuery({
    //     query: GET_BOOKS,
    //     data: {
    //       ...dataInStore
    //       allBooks: [...dataInStore.allBooks, response.data.addBook],
    //     },
    //   });
    // },
  });

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    await addBook({
      variables: { title, published: parseInt(published), author, genres },
    });

    setTitle("");
    setPublished("");
    setAuhtor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
