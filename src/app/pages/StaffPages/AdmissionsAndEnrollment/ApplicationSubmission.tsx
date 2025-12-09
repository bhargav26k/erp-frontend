
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ApplicationSubmissionPage: FC = () => {
  return <div>ApplicationSubmission</div>;
};

const ApplicationSubmission: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ApplicationSubmission" })}
      </PageTitle>
      <ApplicationSubmissionPage />
    </>
  );
};


export default ApplicationSubmission ;
