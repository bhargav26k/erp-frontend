import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget83 } from "../../../../_metronic/partials/widgets/tables/TablesWidget83";

const Roles: FC = () => {
  return (
    <div className="">
      <Content>
        <TablesWidget83 />
      </Content>
    </div>
  );
};

const DailyLogs: FC = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <Roles />
    </>
  );
};

export default DailyLogs;
