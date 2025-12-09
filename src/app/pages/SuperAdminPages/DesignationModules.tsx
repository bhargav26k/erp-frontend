import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import {  TablesWidget66 } from "../../../_metronic/partials/widgets/tables/TablesWidget66"; 
import { useLocation } from 'react-router-dom';


export const DesignationModulesPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const school_id = params.get("schoolId");
  const designation_id = params.get("designationId");

  return (
    <div className="bg-white">
      {/* <HeaderWrapper toggleView={() => {}} /> */}
      <Content>
        
      <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="h-md-100">
              <TablesWidget66 school_id={school_id} designation_id={designation_id}/>
            </div>
          </div>
      </Content>
    </div>
  );
};

const DesignationModules = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <DesignationModulesPage />
    </>
  );
};

export default DesignationModules;
