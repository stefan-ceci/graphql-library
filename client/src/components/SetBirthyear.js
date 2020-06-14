import React, { useState } from "react";
import Select from "react-select";

import { UPDATE_AUTHOR } from "../queries";
import { useMutation } from "@apollo/client";

const SetBirthyear = ({ authors, setError }) => {
  const [author, setAuthor] = useState(null);
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(UPDATE_AUTHOR, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    editAuthor({
      variables: { name: author.value, setBornTo: parseInt(born) },
    });

    setAuthor(null);
    setBorn("");
  };

  const options = authors?.map((author) => {
    return { value: author.name, label: author.name };
  });

  const handleChange = (author) => {
    setAuthor(author);
  };

  return (
    <form onSubmit={submit}>
      <Select options={options} value={author} onChange={handleChange} />
      <div>
        <label htmlFor="year">born</label>
        <input
          type="number"
          name="year"
          value={born}
          onChange={({ target }) => setBorn(target.value)}
        />
      </div>
      <button type="submit">update author</button>
    </form>
  );
};

export default SetBirthyear;
