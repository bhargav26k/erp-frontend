import "./style.css";
import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { useLocation } from "react-router-dom";
import { TablesWidget70 } from "../../../../_metronic/partials/widgets/tables/TablesWidget70";

const AdmissionFeeDetailsPage: FC = () => {
  // Extract query parameters from the URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const classId = parseInt(searchParams.get("classId") || "0", 10);
  const admissionEnquiryId = searchParams.get("admissionEnquiryId") || "";

  return (
    <div className="bg-white">
      <div>
        <Content>
          <div className="row">
            <div
              className="col-xxl-12"
              style={{
                top: "114px",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Manrope",
              }}
            >
              <TablesWidget70
                classId={classId}                  // Pass classId to the widget if needed
                admissionEnquiryId={admissionEnquiryId}  // Pass admissionEnquiryId to the widget if needed
              />
            </div>
          </div>
        </Content>
      </div>
    </div>
  );
};

const AdmissionFeeDetails: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AdmissionFeeDetails" })}
      </PageTitle>
      <AdmissionFeeDetailsPage />
    </>
  );
};

export default AdmissionFeeDetails;
