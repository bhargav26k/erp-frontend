import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget19 } from "../../../../_metronic/partials/widgets/tables/TablesWidget19";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_student";

const StudentHomeWorkPage: FC = () => {
 

  return (
    <div className="bg-white">
      <HeaderWrapper title={"Home Work"} />
      {/* <ToolbarStudent /> */}
      <Content>
        <div className="row gy-5 gx-xl-8">
          <div className="col-xl-12 col-xxl-12 col-lg-12 col-md-12 p-6">
            <TablesWidget19  />
          </div>
        </div>
      </Content>
    </div>
  );
};

const StuHomeWork: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>
      <StudentHomeWorkPage />
    </>
  );
};

export { StuHomeWork };
