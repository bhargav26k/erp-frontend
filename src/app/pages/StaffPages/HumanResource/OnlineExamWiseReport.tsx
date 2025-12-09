
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const OnlineExamWiseReportPage: FC = () => {
  return <div>OnlineExamWiseReport</div>;
};

const OnlineExamWiseReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.OnlineExamWiseReport" })}
      </PageTitle>
      <OnlineExamWiseReportPage />
    </>
  );
};


export { OnlineExamWiseReport };
