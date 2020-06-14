import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { BOOKS_BY_GENRE } from "../queries";
import Loader from "./Loader";

const Books = ({ show, initialBooks, initialGenres }) => {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [books, setBooks] = useState(null);
  const [genres, setGenres] = useState(null);

  const [allBooks, { data, loading }] = useLazyQuery(BOOKS_BY_GENRE);

  useEffect(() => {
    if (selectedGenre !== "all") {
      allBooks({
        variables: {
          genre: selectedGenre,
        },
      });
      setBooks(data?.allBooks);
    } else {
      setBooks(initialBooks);
    }
    // setGenres([
    //   ...new Set(["all", ...initialBooks?.flatMap((book) => book.genres)]),
    // ]);
    setGenres(["all", ...initialGenres]);
  }, [data, allBooks, initialBooks, initialGenres, selectedGenre]);

  if (!show) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <strong>{selectedGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books?.map((a) => (
            <tr key={a?.title}>
              <td>{a?.title}</td>
              <td>{a?.author?.name}</td>
              <td>{a?.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres?.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
