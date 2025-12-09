// import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../_metronic/layout/components/header_staff"
import { TablesWidget45 } from "../../../_metronic/partials/widgets"; 
import { useLocation } from 'react-router-dom';


export const ManageModulesPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const subscriptionId = params.get('subscriptionId');
  const subscriptionName = params.get('subscriptionName');
  



  return (
    <div className="bg-white">
      {/* <HeaderWrapper toggleView={() => {}} /> */}
      <Content>
        
        <div className="row gy-5 gx-xl-8">
          <div className="col-xl-12 p-6">
            <TablesWidget45
              subscription_id={subscriptionId}
              subscriptionName={subscriptionName}
            />
          </div>
        </div>
      </Content>
    </div>
  );
};

const ManageModules = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ManageModules" })}
      </PageTitle>

      <HeaderWrapper toggleView={() => {}} />
      <ManageModulesPage />
    </>
  );
};

export default ManageModules;
