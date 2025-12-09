import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget68 } from "../../../../_metronic/partials/widgets/tables/TablesWidget68";

const Roles: FC = () => {
  return (
    <div className="">
      <Content>
        <TablesWidget68 schoolId={undefined} />
      </Content>
    </div>
  );
};

const MasterAdmins: FC = () => {
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

export default MasterAdmins;
