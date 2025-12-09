import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget55 } from "../../../../_metronic/partials/widgets";



const StudentProfilesPage: FC = () => {
  return (
    <Content>
      <TablesWidget55 />
    </Content>
  );
};

const StudentProfiles: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StudentProfiles" })}
      </PageTitle>
      <StudentProfilesPage />
    </>
  );
};


export default StudentProfiles ;
