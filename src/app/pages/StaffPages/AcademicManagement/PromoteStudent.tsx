import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { HeaderWrapper } from "../../../../../src/_metronic/layout/components/header_staff/HeaderWrapper";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget54 } from "../../../../_metronic/partials/widgets";


const PromoteStudentPage: FC = () => {
  return (
    <div>
      <HeaderWrapper toggleView={() => {}} />
      <Content>
        <TablesWidget54 />
      </Content>
    </div>
  );
};

const PromoteStudent: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.PromoteStudent" })}
      </PageTitle>
      <PromoteStudentPage />
    </>
  );
};


export default PromoteStudent;
