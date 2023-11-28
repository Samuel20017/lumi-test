import KeywordsServices from "@domain/keywords/KeywordsServices";
import PersonEntity from "@domain/models/PersonEntity";
import PersonsRepository from "@domain/repository/PersonsRepository";
import { singleton } from "tsyringe";
import IPersonDbm from "@infrastructure/cosmosDbModels/IPersonDbm";
import { dummyPersons } from "./dummyPersons";
import PersonDbmMapper from "@infrastructure/cosmosDbmMappers/PersonDbmMapper";
import { delay } from "../dummyRepositoryUtils";

@singleton()
export default class PersonsRepositoryImplementation extends PersonsRepository {
  constructor(
    private keywordsServices: KeywordsServices,
    private personDbmMapper: PersonDbmMapper
  ) {
    super();
  }

  override async fetchById(id: string): Promise<PersonEntity | null> {
    await delay(200);
    const dbm = this.items().find((x) => x.id === id) ?? null;
    return dbm && this.personDbmMapper.dbmToEntity(dbm);
  }

  override async fetchByEmploymentInfoKeyWords(
    searchString: string
  ): Promise<PersonEntity[] | null> {
    await delay(1500);
    const searchKeyWords =
      this.keywordsServices.extractKeyWordsFromString(searchString);
    const searchKeyWordsSplit =
      this.keywordsServices.keyWordsToArray(searchKeyWords);

    if (searchKeyWordsSplit.length == 0) return null;

    let dbms = this.items().filter(
      (x) =>
        x.employmentInfo?.keyWords &&
        searchKeyWordsSplit.every(
          (keyword) =>
            x.employmentInfo?.keyWords &&
            x.employmentInfo?.keyWords.includes(keyword)
        )
    );

    return dbms.map((x) => this.personDbmMapper.dbmToEntity(x));
  }

  override async fetchAllWithEmploymentInfo(): Promise<PersonEntity[]> {
    await delay(500);
    return this.items()
      .filter((x) => !!x.employmentInfo)
      .map((x) => this.personDbmMapper.dbmToEntity(x));
  }

  // Private Methods

  private items() {
    return dummyPersons as IPersonDbm[];
  }
}
