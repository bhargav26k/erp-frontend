import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { HeaderWrapper } from "../../../../../src/_metronic/layout/components/header_staff/HeaderWrapper";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget51 } from "../../../../_metronic/partials/widgets";

const SubjectPage: FC = () => {
  return (
    <div>
      <HeaderWrapper toggleView={() => {}} />
      <Content>
        <TablesWidget51 />
      </Content>
    </div>
  );
};

const Subject: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Subject" })}
      </PageTitle>
      <SubjectPage />
    </>
  );
};

export default Subject;
