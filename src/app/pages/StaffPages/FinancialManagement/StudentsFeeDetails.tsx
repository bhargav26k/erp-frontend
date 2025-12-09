import "./style.css";
import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget69 } from "../../../../_metronic/partials/widgets/tables/TablesWidget69";
import { useLocation } from "react-router-dom";

const StudentsFeeDetailsPage: FC = () => {
  // Extract the query parameter from the URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const studentId = (searchParams.get("studentId") || "0");
   
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
                fontFamily: "Manrope",
              }}
            >
              <TablesWidget69
                studentId={studentId}
              />
            </div>
          </div>
        </Content>
      </div>
    </div>
  );
};

const StudentsFeeDetails: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StudentsFeeDetails" })}
      </PageTitle>
      <StudentsFeeDetailsPage />
    </>
  );
};

export default StudentsFeeDetails;
