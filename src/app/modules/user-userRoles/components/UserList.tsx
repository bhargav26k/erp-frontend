import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import {  TablesWidget15 } from "../../../../_metronic/partials/widgets";
import { Content } from "../../../../_metronic/layout/components/content";
import { ToolbarFeeMasterList } from "../../../../_metronic/layout/components/toolbar/toolbars";

const UserListPage: FC = () => {
  const [displayComponent, setDisplayComponent] = useState(false);
  const handleToggle = (value: boolean) => {
    setDisplayComponent(value);
  };

  return (
    <div className="bg-body-secondary">
      <Content>
        <div className="row gy-5 gx-xl-8">
          <div className="col-xl-12 p-6">
            <TablesWidget15 className="card-xxl-stretch mb-5 mb-xl-8" />
          </div>
        </div>
      </Content>
    </div>
  );
};

const UserList: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FEEDETAILS" })}
      </PageTitle>
      <UserListPage />
    </>
  );
};

export { UserList };
