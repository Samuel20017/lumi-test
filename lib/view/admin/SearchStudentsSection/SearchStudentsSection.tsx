import { useState } from "react";
import styles from "./SearchStudentsSection.module.css";

import IPersonDto from "@application/models/IPersonDto";
import AnimatedPanel from "@view/common/AnimatedPanel";
import EmploymentInfoDetail from "@view/admin/InfoDetails/EmploymentInfoDetail";

import Table, { ITableCellIndex, ITableRow } from "@view/common/Table";
import { searchPersonByEmploymentInfoKeyWords } from "../Api/AdminPersonsApi";
import SearchKeywords from "@view/common/SearchKeyWords";

const SearchStudentsSection = () => {
  const [selectedPerson, setSelectedPerson] = useState<
    undefined | IPersonDto
  >();
  const [openLeftPanel, setOpenLeftPanel] = useState(false);
  const [resultQuery, setResultQuery] = useState<IPersonDto[] | null>([]);

  const onSearch = async (value: string) => {
    const result = await searchPersonByEmploymentInfoKeyWords(value);
    setResultQuery(result);
  };

  console.log(selectedPerson);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1>Buscar estudiantes por perfil de empleabilidad: </h1>
        <div className={styles.headersButtons}></div>
      </header>
      <SearchKeywords searchFunction={onSearch} />
      <main>
        <div role="dummy-table" className={styles.table}>
          <Table
            values={resultQuery || []}
            columns={[
              {
                Header: "#",
                accessor: "number",
                width: 50,
              },
              {
                Header: "Fecha de registro",
                accessor: "createdAt",
                width: 250,
              },
              {
                Header: "Nombres y Apellidos",
                accessor: "fullName",
                width: 250,
              },
            ]}
            onCellClick={(row): void => {
              setSelectedPerson(row.rowOriginal as IPersonDto);
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
