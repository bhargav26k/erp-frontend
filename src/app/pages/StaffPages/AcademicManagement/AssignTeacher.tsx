import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { HeaderWrapper } from "../../../../../src/_metronic/layout/components/header_staff/HeaderWrapper";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget53 } from "../../../../_metronic/partials/widgets";

const AssignTeacherPage: FC = () => {
  return (
      <div>
      <HeaderWrapper toggleView={() => {}} />
      <Content>
        <TablesWidget53 />
      </Content>
    </div>
  );
};

const AssignTeacher: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AssignTeacher" })}
      </PageTitle>
      <AssignTeacherPage />
    </>
  );
};


export default AssignTeacher;
