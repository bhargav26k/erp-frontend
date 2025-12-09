
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget87 } from "../../../../_metronic/partials/widgets/tables/TablesWidget87";


const FeesReceivablePage: FC = () => {
  return (
    <div>
      <Content>
        <TablesWidget87 />
      </Content>
    </div>
  );
};

const FeesReceivable: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesReceivable" })}
      </PageTitle>
      <FeesReceivablePage />
    </>
  );
};


export default FeesReceivable;
