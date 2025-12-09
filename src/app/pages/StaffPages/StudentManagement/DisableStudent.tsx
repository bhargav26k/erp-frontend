import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget75 } from "../../../../_metronic/partials/widgets";



const StudentProfilesPage: FC = () => {
  return (
    <Content>
      <TablesWidget75/>
    </Content>
  );
};

const DisableSyudent: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DisableSyudent" })}
      </PageTitle>
      <StudentProfilesPage />
    </>
  );
};


export default DisableSyudent ;
