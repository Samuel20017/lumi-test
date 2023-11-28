import IGenericApiResponse from "@view/common/ApiClient/IGenericApiResponse";
import IPersonDto from "@application/models/IPersonDto";
import { api } from "./config";

export async function searchPersonByEmploymentInfoKeyWords(
  searchString: string
): Promise<IPersonDto[] | null> {
  const result = await api.get(
    `persons?employmentInfoKeyWords=${encodeURIComponent(searchString)}`
  );
  return result.body.map((p: any, index: number) => ({
    id: p.id,
    number: index + 1,
    fullName:
      p.identificationInfo.firstName + " " + p.identificationInfo.lastName,
    createdAt: p.createdAt,
    employmentInfo: p.employmentInfo,
  }));
}
