
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ExamAnalysisAndReportPage: FC = () => {
  return <div>ExamAnalysisAndReport</div>;
};

const ExamAnalysisAndReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ExamAnalysisAndReport" })}
      </PageTitle>
      <ExamAnalysisAndReportPage />
    </>
  );
};


export { ExamAnalysisAndReport };
