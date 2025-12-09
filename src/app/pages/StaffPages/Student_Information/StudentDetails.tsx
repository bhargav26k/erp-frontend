import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget28 } from "../../../../_metronic/partials/widgets/tables/TablesWidget28";
import { HeaderWrapper } from '../../../../_metronic/layout/components/header_staff'
import { TablesWidget34 } from "../../../../_metronic/partials/widgets";



const Roles: FC = () => {

  return (
    <div className="bg-body-secondary">    
    

      <Content>
        <div className="row g-5 g-xl-10 mb-6 mb-xl-5">
           
          <TablesWidget34  /> 
        </div>
       
      </Content>
    </div>
  );
};

const StudentDetails: FC = () => {
    const intl = useIntl();

    return (
      <>
        <PageTitle breadcrumbs={[]}>
          {intl.formatMessage({ id: "MENU.HOMEWORK" })}
        </PageTitle>
  
        <HeaderWrapper toggleView={() => {}} />
        <Roles />
      </>
    );
};

export { StudentDetails };
