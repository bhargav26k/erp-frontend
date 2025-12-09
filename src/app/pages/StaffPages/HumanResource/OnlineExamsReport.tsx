
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const OnlineExamsReportPage: FC = () => {
  return <div>OnlineExamsReport</div>;
};

const OnlineExamsReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.OnlineExamsReport" })}
      </PageTitle>
      <OnlineExamsReportPage />
    </>
  );
};


export { OnlineExamsReport };
