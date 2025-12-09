import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { TablesWidget14 } from "../../../../_metronic/partials/widgets";
import { Content } from "../../../../_metronic/layout/components/content";
// import { ToolbarFeeMasterList } from "../../../../_metronic/layout/components/toolbar/toolbars";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";

const ViewFeeMasterPage: FC = () => {

  return (
    <div className="bg-white">
      <HeaderWrapper  toggleView={() => {}} />
<div>
      {/* <ToolbarFeeMasterList /> */}
      <Content>
        <div className="row gx-xl-8">
          <div className="col-xl-12">
            <TablesWidget14 />
          </div>
        </div>
      </Content>
</div>
    </div>
  );
};

const ViewFeeMaster: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FEEDETAILS" })}
      </PageTitle>
      <ViewFeeMasterPage />
    </>
  );
};

export default ViewFeeMaster;
