import React, { useState } from "react";

import "./App.css";
import MiniSearch from "minisearch";
import {
  Typography,
  Container,
  TextField,
  Card,
  Button,
  makeStyles,
} from "@mui/material";

function App() {
  //getting list of issues from json file
  let issues = require("./issues.json");

  //what state will we need?
  const [searchTerm, setSearchTerm] = useState("");
  const [autoSuggestOn, setAutoSuggestOn] = useState(false);
  const [results, setResults] = useState();

  let miniSearch = new MiniSearch({
    fields: ["name"], // fields to index for full-text search
    storeFields: ["name"], // fields to return with search results
  });
  // Index all documents
  miniSearch.addAll(issues);

  const onChange = (e) => {
    setSearchTerm(e.target.value);

    let outcome = null;
    if (!autoSuggestOn) {
      // Search with default options
      outcome = miniSearch.search(e.target.value);
      setResults(outcome);
    } else {
      // Search with autoSuggest
      outcome = miniSearch.autoSuggest(e.target.value, { fuzzy: 0.2 });
      setResults(outcome);
    }
  };

  const onClick = (e) => {
    setAutoSuggestOn(!autoSuggestOn);
  };

  const onClickSuggestion = (e) => {
    console.log(e.target.innerText);
    setAutoSuggestOn(!autoSuggestOn);
    setResults([]);
    let outcome = miniSearch.search(e.target.innerText);
    console.log("Outcome", outcome);
    setResults(outcome);
  };
  // display list of suggestions
  // onSuggestionClick set the state for the search field and rerun query
  //display new results
  return (
    <Container align="center">
      <Typography variant="h3">Demo MiniSearch</Typography>
      <TextField
        id="outlined-search"
        label="Search issues..."
        placeholder="Search by name"
        type="search"
        variant="outlined"
        size="small"
        color="secondary"
        value={searchTerm}
        onChange={(e) => onChange(e)}
      />
      <div>
        autoSuggestOn
        <Button onClick={(e) => onClick(e)}>
          {autoSuggestOn ? "ON" : "OFF"}
        </Button>
      </div>

      {results
        ? results.map((result, index) => {
            console.log(result);
            return (
              <Card key={result.name}>
                {result.suggestion && (
                  <Typography onClick={(e) => onClickSuggestion(e)}>
                    {result.suggestion}
                  </Typography>
                )}
                {result.name && <Typography>{result.name}</Typography>}
              </Card>
            );
          })
        : console.log("no results")}
    </Container>
  );
}

export default App;
