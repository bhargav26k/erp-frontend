
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FollowUpAdmissionEnquiryPage: FC = () => {
  return <div>FollowUpAdmissionEnquiry</div>;
};

const FollowUpAdmissionEnquiry: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FollowUpAdmissionEnquiry" })}
      </PageTitle>
      <FollowUpAdmissionEnquiryPage />
    </>
  );
};


export { FollowUpAdmissionEnquiry };