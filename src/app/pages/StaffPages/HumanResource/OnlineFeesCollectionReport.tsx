
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const OnlineFeesCollectionReportPage: FC = () => {
  return <div>OnlineFeesCollectionReport</div>;
};

const OnlineFeesCollectionReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.OnlineFeesCollectionReport" })}
      </PageTitle>
      <OnlineFeesCollectionReportPage />
    </>
  );
};


export { OnlineFeesCollectionReport };
