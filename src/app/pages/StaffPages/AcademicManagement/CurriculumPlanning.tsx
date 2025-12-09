import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CurriculumPlanningPage: FC = () => {
  return <div>CurriculumPlanning</div>;
};

const CurriculumPlanning: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CurriculumPlanning" })}
      </PageTitle>
      <CurriculumPlanningPage />
    </>
  );
};


export default CurriculumPlanning;
