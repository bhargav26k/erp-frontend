// import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../_metronic/layout/components/header_staff"
import {  TablesWidget42 } from "../../../_metronic/partials/widgets"; 
import { useLocation } from 'react-router-dom';


export const ManageDesignationPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const schoolId = params.get('schoolId');



  return (
    <div className="bg-white">
      {/* <HeaderWrapper toggleView={() => {}} /> */}
      <Content>
        
      <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="h-md-100">
              <TablesWidget42 />
            </div>
          </div>
      </Content>
    </div>
  );
};

const ManageDesignation = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <HeaderWrapper toggleView={() => {}} />
      <ManageDesignationPage />
    </>
  );
};

export default ManageDesignation;
