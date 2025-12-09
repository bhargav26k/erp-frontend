
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const HomeworkEvaluationReportPage: FC = () => {
  return <div>HomeworkEvaluationReport</div>;
};

const HomeworkEvaluationReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HomeworkEvaluationReport" })}
      </PageTitle>
      <HomeworkEvaluationReportPage />
    </>
  );
};


export { HomeworkEvaluationReport };
