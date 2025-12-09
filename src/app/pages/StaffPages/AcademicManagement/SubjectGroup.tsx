import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { HeaderWrapper } from "../../../../../src/_metronic/layout/components/header_staff/HeaderWrapper";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget50 } from "../../../../_metronic/partials/widgets";

const SubjectGroupPage: FC = () => {
  return (
    <div>
      <HeaderWrapper toggleView={() => {}} />
      <Content>
        <TablesWidget50 />
      </Content>
    </div>
  );
};

const SubjectGroup: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SubjectGroup" })}
      </PageTitle>
      <SubjectGroupPage />
    </>
  );
};

export default SubjectGroup;
