import IEmploymentInfoDto from "@application/models/IEmploymentInfoDto";
import ItemsInfoSection from "@view/common/ItemsInfoSection/ItemsInfoSection";
import InfoSection from "@view/common/InfoSection/InfoSection";
import styles from "./EmploymentInfoDetail.module.css";
import { CSSProperties, useMemo } from "react";
import Button from "@view/common/Button";
import idiomLevelForHumans from "@presentation/enums/idiomLevelForHumans";
import typeofofficeForHumans from "@presentation/enums/typeOfOfficeForHumans";

export interface IEmploymentInfoDetailProps {
  employmentInfo: IEmploymentInfoDto;
  style?: CSSProperties;
}

const EmploymentInfoDetail = ({
  employmentInfo,
  style,
}: IEmploymentInfoDetailProps) => {
  console.log(employmentInfo);
  const remunerationRequirement = employmentInfo.remunerationRequirement;
  const remunerationRequirementString = useMemo(() => {
    if (remunerationRequirement === null) {
      return "N/A (Sin información)";
    }

    const formater = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: remunerationRequirement.currency.isoCode,
    });

    const min = formater.format(remunerationRequirement.rangeStart);
    const max = formater.format(remunerationRequirement.rangeTop);
    return `${min} - ${max} ${remunerationRequirement.currency.isoCode}`;
  }, [remunerationRequirement]);

  const urlsDescriptions = useMemo(() => {
    return [
      { url: employmentInfo.linkedInUrl, label: "LinkedIn:" },
      { url: employmentInfo.githubUrl, label: "GitHub:" },
      { url: employmentInfo.portfolioUrl, label: "Portafolio personal:" },
    ].filter((x) => x.url !== null);
  }, [
    employmentInfo.linkedInUrl,
    employmentInfo.githubUrl,
    employmentInfo.portfolioUrl,
  ]);

  return (
    <div style={style} className={styles.root}>
      <ItemsInfoSection label="Formación complementaria:">
        {employmentInfo.complementaryTraining.map((x, i) => (
          <span key={i}>{x}</span>
        ))}
      </ItemsInfoSection>
      <ItemsInfoSection label="Idiomas:">
        {employmentInfo.idioms.map((x, i) => (
          <span key={i}>
            {x.idiom.name}: {idiomLevelForHumans(x.level)}
          </span>
        ))}
      </ItemsInfoSection>
      <InfoSection label="Disponibilidad para viajar:">
        {employmentInfo.isAvailableToTravel ? "Sí" : "No"}
      </InfoSection>
      <InfoSection label="Disponibilidad para cambiar se residencia:">
        {employmentInfo.isAvailableToChangeResidence ? "Sí" : "No"}
      </InfoSection>
      <InfoSection label="Meses de experiencia certificable:">
        {employmentInfo.monthsOfCertifiableExperience !== null
          ? employmentInfo.monthsOfCertifiableExperience
          : "N/A (Sin información)"}
      </InfoSection>
      <ItemsInfoSection label="Habilidades:">
        {employmentInfo.skills.map((x, i) => (
          <span key={i}>{x.name}</span>
        ))}
      </ItemsInfoSection>
      <ItemsInfoSection label="Sectores de experiencia:">
        {employmentInfo.sectorsOfLaboralExperience.map((x, i) => (
          <span key={i}>{x.name}</span>
        ))}
      </ItemsInfoSection>
      <ItemsInfoSection label="Sectores de interes:">
        {employmentInfo.sectorsOfInterestForEmployment.map((x, i) => (
          <span key={i}>{x.name}</span>
        ))}
      </ItemsInfoSection>
      <InfoSection label="Aspiración salarial:">
        {remunerationRequirementString}
      </InfoSection>
      <InfoSection label="Tipo de trabajo preferido:">
        {employmentInfo.preferredTypeOfOffice !== null
          ? typeofofficeForHumans(employmentInfo.preferredTypeOfOffice)
          : "N/A (Sin información)"}
      </InfoSection>
      <ItemsInfoSection label="Conocimientos técnicos:">
        {employmentInfo.techSkills.map((x, i) => (
          <span key={i}>{x}</span>
        ))}
      </ItemsInfoSection>
      <ItemsInfoSection label="Enlaces de interes:">
        {urlsDescriptions.map((x, i) => (
          <span key={i}>
            {x.label}{" "}
            <Button
              variant="text"
              color="primary"
              onClick={() => window.open(x.url!, "_blank")}
            >
              Ver
            </Button>
          </span>
        ))}
      </ItemsInfoSection>
    </div>
  );
};

export default EmploymentInfoDetail;
