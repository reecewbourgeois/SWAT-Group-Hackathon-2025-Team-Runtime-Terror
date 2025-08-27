import { useEffect, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { RouletteType } from "../types/RouletteType";
import { Sample_Roulette_Listings } from "../api/sample-roulette-listings";
import "./rouletteListings.css";
import { useNavigate } from "react-router-dom";

export const RouletteListings = () => {
  const navigate = useNavigate();

  const [rouletteGames, setRouletteGames] = useState<RouletteType[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  const searchedGames = useMemo(() => {
    return rouletteGames.filter((game) =>
      game.name.toLowerCase().startsWith(searchInput.toLowerCase())
    );
  }, [rouletteGames, searchInput]);

  const navigateToGame = (game: RouletteType) => {
    navigate(`/roulette?id=${game.id}&name=${game.name}`);
  };

  useEffect(() => {
    setRouletteGames(Sample_Roulette_Listings);
  }, []);

  return (
    <div className="roulette-listings-page">
      <div className="search-input">
        <BiSearch />
        <input
          onChange={(event) => setSearchInput(event.currentTarget.value)}
          placeholder="Search"
          value={searchInput}
        />
      </div>

      <div className="listing-container">
        {searchedGames.map((game) => {
          return (
            <div className="list-option-container" key={game.id}>
              <label>{game.id}. </label>

              <button
                className="link-button"
                onClick={() => navigateToGame(game)}
              >
                <label className="label">{game.name}</label>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
