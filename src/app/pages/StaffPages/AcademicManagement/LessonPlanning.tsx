import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const LessonPlanningPage: FC = () => {
  return <div>LessonPlanning</div>;
};

const LessonPlanning: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.LessonPlanning" })}
      </PageTitle>
      <LessonPlanningPage />
    </>
  );
};


export default LessonPlanning;
