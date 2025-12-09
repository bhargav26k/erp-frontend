
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const OnlineExamsRankReportPage: FC = () => {
  return <div>OnlineExamsRankReport</div>;
};

const OnlineExamsRankReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.OnlineExamsRankReport" })}
      </PageTitle>
      <OnlineExamsRankReportPage />
    </>
  );
};


export { OnlineExamsRankReport };
