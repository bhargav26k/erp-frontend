/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget82 } from "../../../../_metronic/partials/widgets/tables/TablesWidget82";

const ManualAdmissionsPage: FC = () => {

  return (
    <div className="bg-white">
            {/* <ToolbarCommon /> */}
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
              <TablesWidget82 />
            </div>
          </Content>
        </div>
     
    </div>
  );
};

const ManualAdmissions: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
      </PageTitle>
      <ManualAdmissionsPage />
    </>
  );
};

export default ManualAdmissions;
