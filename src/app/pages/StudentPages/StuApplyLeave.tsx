// import { FC, useState } from "react";
import { FC} from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import { TablesWidget21 } from "../../../_metronic/partials/widgets/tables/TablesWidget21";

const StudentApplyLeavePage: FC = () => {
  // const [displayComponent, setDisplayComponent] = useState(false);
  // const handleToggle = (value: boolean) => {
  //   console.log(value);
  //   setDisplayComponent(value);
  // };

  return (
    <div className="bg-body-secondary">
      <Content>
        <div className="row gy-5 gx-xl-8">
          <div className="col-xl-12 p-6">
            <TablesWidget21 className="card-xxl-stretch mb-5 mb-xl-8" />
          </div>
        </div>
      </Content>
    </div>
  );
};

const StuApplyLeave: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>
      <StudentApplyLeavePage />
    </>
  );
};

export { StuApplyLeave };
