
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const HostelReportPage: FC = () => {
  return <div>HostelReport</div>;
};

const HostelReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HostelReport" })}
      </PageTitle>
      <HostelReportPage />
    </>
  );
};


export { HostelReport };
