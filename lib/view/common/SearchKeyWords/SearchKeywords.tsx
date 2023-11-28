import { useState } from "react";
import styles from "./SearchKeywords.module.css";

export interface ISearchKeywordsProps {
  searchFunction: (searchValue: string) => void;
}

function SearchKeywords({ searchFunction }: ISearchKeywordsProps) {
  const [searchValue, setSearchValue] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    searchFunction(searchValue);
  };

  return (
    <form className={styles.searchBox} onSubmit={onSubmit}>
      <div className={styles.containerSearch}>
        <input
          className={styles.inputSearch}
          type="text"
          placeholder="Palabras clave"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className={styles.searchButton} type="submit">
          Buscar
        </button>
      </div>
    </form>
  );
}

export default SearchKeywords;
