import React, { useState } from "react";
import { HeaderWrapper } from "../../../_metronic/layout/components/header_staff";
import { Content } from "../../../_metronic/layout/components/content";
import { TablesWidget64 } from "../../../_metronic/partials/widgets/tables/TablesWidget64";

const ManageSubscriptions = () => {
  
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
              <TablesWidget64 />
            </div>
      </Content>
    </div>
  );
};

export default ManageSubscriptions;
