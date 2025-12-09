import "./style.css";
import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import {
  TablesWidget14,
} from "../../../../_metronic/partials/widgets";
import { Content } from "../../../../_metronic/layout/components/content";
// import { ToolbarFeeMaster } from "../../../../_metronic/layout/components/toolbar/toolbars";
// import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";

const FeeMasterPage: FC = () => {
  const [displayComponent, setDisplayComponent] = useState("chart");
  const handleToggle = (value: string) => {
    // console.log(value);
    setDisplayComponent(value);
  };

  return (
    <div className="bg-white">
      {/* <HeaderWrapper toggleView={handleToggle} /> */}
        <div>
          {/* <ToolbarFeeMaster onSelectValue={undefined} /> */}
          <Content>
            <div className="row">
              <div
                className="col-xxl-12"
                style={{
                  // width: "1367px",
                  // height: "696px",
                  top: "114px",
                  display: "flex",
                  flexDirection: "column",
                  fontFamily:"Manrope",
                }}
              >
                <TablesWidget14 />
              </div>
            </div>
          </Content>
        </div>
     
    </div>
  );
};

const FeeMaster: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeeMaster" })}
      </PageTitle>
      <FeeMasterPage />
    </>
  );
};

export default FeeMaster ;
