
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const SurveyAndFeedbackReportsPage: FC = () => {
  return <div>SurveyAndFeedbackReports</div>;
};

const SurveyAndFeedbackReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SurveyAndFeedbackReports" })}
      </PageTitle>
      <SurveyAndFeedbackReportsPage />
    </>
  );
};


export { SurveyAndFeedbackReports };
