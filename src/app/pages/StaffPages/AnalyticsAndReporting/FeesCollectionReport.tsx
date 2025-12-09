import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { TablesWidget73 } from "../../../../_metronic/partials/widgets/tables/TablesWidget73";
import { Content } from "../../../../_metronic/layout/components/content";

const FeesCollectionReportPage: FC = () => {
  return (
    <div>
      <Content>
        <TablesWidget73 />
      </Content>
    </div>
  );
};

const FeesCollectionReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesCollectionReport" })}
      </PageTitle>
      <FeesCollectionReportPage />
    </>
  );
};

export default FeesCollectionReport;
