import { useState } from "react";
import styles from "./SearchStudentsSection.module.css";

import IPersonDto from "@application/models/IPersonDto";
import AnimatedPanel from "@view/common/AnimatedPanel";
import EmploymentInfoDetail from "@view/admin/InfoDetails/EmploymentInfoDetail";

import Table, { ITableRow } from "@view/common/Table";
import { searchPersonByEmploymentInfoKeyWords } from "../Api/AdminPersonsApi";

const SearchStudentsSection = () => {
  const [selectedPerson, setSelectedPerson] = useState<
    undefined | IPersonDto
  >();
  const [searchValue, setSearchValue] = useState<string>("");
  const [openLeftPanel, setOpenLeftPanel] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await searchPersonByEmploymentInfoKeyWords(searchValue);
    console.log(result);
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1>Buscar estudiantes por perfil de empleabilidad: </h1>
        <div className={styles.headersButtons}></div>
      </header>
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
      <main>
        <div role="dummy-table" className={styles.table}>
          <Table
            values={[
              {
                id: "test",
                lastName: "test",
              },
            ]}
            columns={[
              {
                Header: "Nombre",
                accessor: "id",
                width: 100,
              },
              {
                Header: "Apellido",
                accessor: "lastName",
                width: 100,
              },
            ]}
            onCellClick={(row: ITableRow): void => {
              setSelectedPerson(row.original);
              setOpenLeftPanel(true);
            }}
            onColumnsChange={(columns) => null}
          />
        </div>
      </main>
      <AnimatedPanel
        open={openLeftPanel}
        onClose={() => {
          setOpenLeftPanel(false);
        }}
      >
        {selectedPerson ? (
          <div style={{ padding: "1rem 1rem" }}>
            <h1 style={{ color: "var(--color-primary)", textAlign: "center" }}>
              Perfil de empleabilidad
            </h1>
            {selectedPerson?.employmentInfo != null && (
              <EmploymentInfoDetail
                employmentInfo={selectedPerson.employmentInfo}
              />
            )}
          </div>
        ) : (
          <></>
        )}
      </AnimatedPanel>
    </div>
  );
};

export default SearchStudentsSection;
