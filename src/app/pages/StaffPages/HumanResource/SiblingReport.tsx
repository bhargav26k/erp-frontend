
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const SiblingReportPage: FC = () => {
  return <div>SiblingReport</div>;
};

const SiblingReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SiblingReport" })}
      </PageTitle>
      <SiblingReportPage />
    </>
  );
};


export { SiblingReport };
