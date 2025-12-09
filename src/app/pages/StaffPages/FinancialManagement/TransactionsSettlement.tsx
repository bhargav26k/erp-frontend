
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget76 } from "../../../../_metronic/partials/widgets/tables/TablesWidget76";


const TransactionsSettlementPage: FC = () => {
  return (
    <div>
      <Content>
        <TablesWidget76 />
      </Content>
    </div>
  );
};

const TransactionsSettlement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesOutstanding" })}
      </PageTitle>
      <TransactionsSettlementPage />
    </>
  );
};


export default TransactionsSettlement;
