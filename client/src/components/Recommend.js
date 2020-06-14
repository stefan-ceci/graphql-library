import React from "react";

const Recommend = ({ books, show, user }) => {
  if (!show) {
    return null;
  }

  const booksToShow = books.filter((book) =>
    book.genres.includes(user?.favoriteGenre)
  );

  return (
    <div>
      <h2>books</h2>
      <p>
        books in your favorite genre <strong>{user?.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow?.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
