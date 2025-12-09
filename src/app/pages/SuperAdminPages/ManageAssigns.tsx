// import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../_metronic/layout/components/header_staff"
import { TablesWidget45 } from "../../../_metronic/partials/widgets"; 
import { useLocation } from 'react-router-dom';
import { useEffect } from "react";


export const ManageAssignsPage = () => {
  const location = useLocation();
  let subscriptionId;
  let subscriptionName;

  useEffect(() => {
    // Get the current query parameters from the URL
    const params = new URLSearchParams(location.search);

    // Get the specific values
    subscriptionId = params.get('subscriptionId');
    subscriptionName = params.get('subscriptionName');

    // Log the retrieved subscriptionName to check

    // You can now use these values as needed in your component
  }, [location]);
  



  return (
    <div className="bg-white">
      {/* <HeaderWrapper toggleView={() => {}} /> */}
      <Content>
        
        <div className="row gy-5 gx-xl-8">
          <div className="col-xl-12 p-6">
            <TablesWidget45
              subscription_id={subscriptionId}
              subscription_name={subscriptionName}

            />
          </div>
        </div>
      </Content>
    </div>
  );
};

const ManageAssigns = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ManageAssigns" })}
      </PageTitle>

      <HeaderWrapper toggleView={() => {}} />
      <ManageAssignsPage />
    </>
  );
};

export default ManageAssigns;
