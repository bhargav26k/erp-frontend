
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const PollsAndSurveysPage: FC = () => {
  return <div>PollsAndSurveys</div>;
};

const PollsAndSurveys: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.PollsAndSurveys" })}
      </PageTitle>
      <PollsAndSurveysPage />
    </>
  );
};


export { PollsAndSurveys };
