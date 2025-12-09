// /* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
// import { ToolbarFeeMaster } from "../../../../_metronic/layout/components/toolbar/toolbars";
// import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { TablesWidget63 } from "../../../../_metronic/partials/widgets/tables/TablesWidget63";
import { useSearchParams } from "react-router-dom";

const AssignedStudentPage = () => {
    const [searchParams] = useSearchParams();

    // Get class_id from the query parameters
    const classId = searchParams.get("classId");   
    
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
              <TablesWidget63 class_id={classId} />
            </div>
          </Content>
        </div>
     
    </div>
  
  );
};

const AssignedStudent: FC = () => {
    const intl = useIntl();
    return (
      <>
        <PageTitle breadcrumbs={[]}>
          {intl.formatMessage({ id: "MENU.FEEDETAILS" })}
        </PageTitle>
        <AssignedStudentPage />
      </>
    );
  };
  

export default AssignedStudent;
