import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = () => {
  const [SearchTerm, setSearchTerm] = useState("");
  const [SearchResults, setSearchResults] = useState([]);

  // Det andra argumenet säger åt useEffect när det ska köras.
  // Med [SearchTerm] där så körs den varje gång värdet ändras i input.
  // Här lägger jag de APIer jag ska använda

  useEffect(() => {
    const wikiSearch = async () => {
      const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
        // Allt inom params läggs till på URLn över.

        params: {
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          srsearch: SearchTerm,
        },
      });

      // Använder data för att uppdatera SearchResults State.

      setSearchResults(data.query.search);
    };

    // För att inte ett sök ska gå av på första "render". if-satsen besämmer att om inget värde
    // finns i inputen så gör appen inget sök förens användaren
    // lägger in ett värde att söka efter.
    // Med en setTimeout så läggs det på tid innan resultaten dyker upp.
    const timeout = setTimeout(() => {
      if (SearchTerm) {
        wikiSearch();
      }
    }, 700);

    return () => {
      clearTimeout(timeout);
    };
  }, [SearchTerm]);

  // Tar sökresultaten och går över dom med Map och skriver ut dom.

  const wikiResults = SearchResults.map((result) => {
    return (
      <div className="component" key={result.pageid}>
        <div className="content">
          <div className="title">{result.title}</div>
          <div dangerouslySetInnerHTML={{ __html: result.snippet }}></div>
        </div>
        <a
          className="button"
          // Tog koden under från https://code.support/code/search-component-that-avoids-multiple-api-request-in-react/
          href={`https://en.wikipedia.org?curid=${result.pageid}`}
        >
          Read more
        </a>
      </div>
    );
  });

  // Lägger till en Valueprop och en onChange i input. Varje gång värdet ändras uppdaterar vi
  // våran "State" som håller koll värdet av input. Appen "rerender" och vi ser det nya värdet.

  return (
    <div>
      <div className="searchfield">
        <label className="label">The Search for Wiki knowledge</label>
        <input
          value={SearchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
          placeholder="Search here.."
        />
      </div>
      <div className="container">
        <div className="list">{wikiResults}</div>
      </div>
    </div>
  );
};

export default Search;
