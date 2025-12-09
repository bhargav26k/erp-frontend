// import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../_metronic/layout/components/header_staff"
import {  TablesWidget47 } from "../../../_metronic/partials/widgets"; 
import { useLocation } from 'react-router-dom';


export const ManageRolesPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const schoolId = params.get('schoolId');



  return (
    <div className="bg-white">
      {/* <HeaderWrapper toggleView={() => {}} /> */}
      <Content>
        
        <div className="row gy-5 gx-xl-8">
          <div className="col-xl-12 p-6">
            <TablesWidget47
              school_id={schoolId}
            />
          </div>
        </div>
      </Content>
    </div>
  );
};

const ManageRoles = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <HeaderWrapper toggleView={() => {}} />
      <ManageRolesPage />
    </>
  );
};

export default ManageRoles;
