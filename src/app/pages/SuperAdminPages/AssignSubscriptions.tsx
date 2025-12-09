import React, { useState } from "react";
import { HeaderWrapper } from "../../../_metronic/layout/components/header_staff";
import { Content } from "../../../_metronic/layout/components/content";
import { TablesWidget65 } from "../../../_metronic/partials/widgets/tables/TablesWidget65";

const AssignSubscriptions = () => {
  
  return (
    <div className="bg-white">
      {/* <HeaderWrapper toggleView={() => {}} /> */}
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
              <TablesWidget65 />
            </div>
      </Content>
    </div>
  );
};

export default AssignSubscriptions;
