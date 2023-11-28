import { resolveClass } from "@container";
import type IAuthorizationDataDto from "@application/models/IAuthorizationDataDto";
import {
  BadRequestException,
  Catch,
  createHandler,
  Get,
  Query,
} from "@storyofams/next-api-decorators";
import { AuthInfo, JwtAuthGuard } from "../nextApiMiddlewares/JwtAuth";
import {
  logExceptions,
  LogRequests,
} from "@presentation/nextApiMiddlewares/AppInsights";
import AdminGetPersonData from "@application/AdminGetPersonData";

@Catch(logExceptions)
class StudentPersonKeyWordsController {
  private readonly searchServices = resolveClass(AdminGetPersonData);

  @LogRequests()
  @Get()
  @JwtAuthGuard()
  async search(
    @Query("employmentInfoKeyWords") keyWords: string,
    @AuthInfo() authInfo?: IAuthorizationDataDto
  ) {
    if (!keyWords) {
      throw new BadRequestException("keyWords si required");
    }

    const result = await this.searchServices.getPersonsByEmploymentInfoKeyWords(
      keyWords,
      authInfo
    );

    console.log(result);

    return result;
  }
}

export default createHandler(StudentPersonKeyWordsController);
