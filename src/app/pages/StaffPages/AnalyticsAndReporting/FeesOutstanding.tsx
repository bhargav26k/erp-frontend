
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget74 } from "../../../../_metronic/partials/widgets/tables/TablesWidget74";


const FeesOutstaandingPage: FC = () => {
  return (
    <div>
      <Content>
        <TablesWidget74 />
      </Content>
    </div>
  );
};

const FeesOutstanding: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesOutstanding" })}
      </PageTitle>
      <FeesOutstaandingPage />
    </>
  );
};


export default FeesOutstanding;
