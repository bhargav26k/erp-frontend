import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
// import React from "react";
// import { useLocation } from "react-router-dom";
// import { TablesWidget48 } from "../../../../_metronic/partials/widgets/tables/TablesWidget48";
import { HeaderWrapper } from "../../../../../src/_metronic/layout/components/header_staff/HeaderWrapper";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget49 } from "../../../../_metronic/partials/widgets/tables/TablesWidget49";

const SectionPage: FC = () => {
  return (
    <div>
      <HeaderWrapper toggleView={() => {}} />
      <Content>
        <TablesWidget49 />
      </Content>
    </div>
  );
};

const Section: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Section" })}
      </PageTitle>
      <SectionPage />
    </>
  );
};

export default Section;
