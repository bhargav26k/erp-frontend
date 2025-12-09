import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget29 } from "../../../../_metronic/partials/widgets/tables/TablesWidget29";
import { useLocation } from "react-router-dom";
// import { useAuth } from "../../../modules/auth";


const Roles: FC = () => {
  // const { state } = useLocation();
  /* @ts-ignore */

  // const roleId = state && state.roleId;
  // const rolIdInt = roleId ? parseInt(roleId, 10) : null;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const designation_id = params.get('designationId');
  const school_id = params.get('schoolId');


  return (
    <div className="bg-body-secondary">
      <Content>
        <div className="row g-5 g-xl-10 mb-6 mb-xl-5">
          <TablesWidget29 school_id={school_id} designation_id={designation_id} />
        </div>
      </Content>
    </div>
  );
};

const UserDesignationPermission: FC = () => {
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

export default UserDesignationPermission ;
