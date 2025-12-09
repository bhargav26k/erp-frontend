
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ExamSchedulePage: FC = () => {
  return <div>ExamSchedule</div>;
};

const ExamSchedule: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ExamSchedule" })}
      </PageTitle>
      <ExamSchedulePage />
    </>
  );
};


export { ExamSchedule };
