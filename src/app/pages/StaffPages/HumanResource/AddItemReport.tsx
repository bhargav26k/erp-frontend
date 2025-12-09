
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AddItemReportPage: FC = () => {
  return <div>AddItemReport</div>;
};

const AddItemReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AddItemReport" })}
      </PageTitle>
      <AddItemReportPage />
    </>
  );
};


export { AddItemReport };
