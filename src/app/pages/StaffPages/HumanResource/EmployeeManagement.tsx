import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { Content } from "../../../../_metronic/layout/components/content";
import {  TablesWidget56 } from "../../../../_metronic/partials/widgets";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff/HeaderWrapper";



const EmployeeManagementPage: FC = () => {
  return (
    <Content>
      <TablesWidget56 />
    </Content>
  );
};

const EmployeeManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.EmployeeManagement" })}
      </PageTitle>
      <EmployeeManagementPage />
    </>
  );
};


export default EmployeeManagement ;
