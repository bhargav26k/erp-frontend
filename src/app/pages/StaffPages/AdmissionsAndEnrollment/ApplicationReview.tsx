/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
// import { ToolbarFeeMaster } from "../../../../_metronic/layout/components/toolbar/toolbars";
// import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { TablesWidget58 } from "../../../../_metronic/partials/widgets/tables/TablesWidget58";

const ApplicationReviewPage: FC = () => {
  const [displayComponent, setDisplayComponent] = useState("chart");
  const [selectedValue, setSelectedValue] = useState("current_year");
  // console.log(selectedValue);
  

  const handleSelectValue = (value: SetStateAction<null>) => {
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
    setSelectedValue(value);
  };
  const handleToggle = (value: string) => {
    setDisplayComponent(value);
  };

  return (
    <div className="bg-white">
        <div>
          <Content>
            <div className="col-xxl-12"
              style={{
                // width: "1367px",
                // height: "696px",
                top: "114px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <TablesWidget58 />
            </div>
          </Content>
        </div>
     
    </div>
  );
};

const ApplicationReview: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FEEDETAILS" })}
      </PageTitle>
      <ApplicationReviewPage />
    </>
  );
};

export default ApplicationReview;
