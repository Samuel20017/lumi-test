import IUserLoginWithEmailAndPasswordDto from "@application/requestsModels/IUserLoginWithEmailAndPasswordDto";
import IGenericApiResponse from "@view/common/ApiClient/IGenericApiResponse";
import IAuthorizationDataWithTokenDto from "@presentation/controllersModels/IAuthorizationDataWithTokenDto";
import { api } from "./config";

export function loginWithEmailAndPassword(
  dto: IUserLoginWithEmailAndPasswordDto
): Promise<IGenericApiResponse<IAuthorizationDataWithTokenDto>> {
  return api.post("user/login", dto);
}
