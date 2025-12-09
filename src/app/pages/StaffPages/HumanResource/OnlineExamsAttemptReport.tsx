
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const OnlineExamsAttemptReportPage: FC = () => {
  return <div>OnlineExamsAttemptReport</div>;
};

const OnlineExamsAttemptReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.OnlineExamsAttemptReport" })}
      </PageTitle>
      <OnlineExamsAttemptReportPage />
    </>
  );
};


export { OnlineExamsAttemptReport };
