import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
// import { TablesWidget14 } from "../../../../_metronic/partials/widgets";
import { Content } from "../../../../_metronic/layout/components/content";
// import { ToolbarFeeMasterList } from "../../../../_metronic/layout/components/toolbar/toolbars";
import { ToolbarAdminUserRoles } from "../../../../_metronic/layout/components/toolbar/toolbars/ToolbarAdminUserRoles";
import { TablesWidget16 } from "../../../../_metronic/partials/widgets/tables/TablesWidget16";

const UserRolesPage: FC = () => {
  const [displayComponent, setDisplayComponent] = useState(false);
  const handleToggle = (value: boolean) => {
    setDisplayComponent(value);
  };

  return (
    <div className="bg-body-secondary">
      <ToolbarAdminUserRoles />
      <Content>
        <div className="row gy-5 gx-xl-8 d-flex justify-content-center">
          <div className="col-xl-8 p-6">
            <TablesWidget16 className="card-xxl-stretch mb-5 mb-xl-8" />
          </div>
        </div>
      </Content>
    </div>
  );
};

const UserRoles: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FEEDETAILS" })}
      </PageTitle>
      <UserRolesPage />
    </>
  );
};

export { UserRoles };
