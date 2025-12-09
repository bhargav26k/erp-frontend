
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EnrollmentConfirmationPage: FC = () => {
  return <div>EnrollmentConfirmation</div>;
};

const EnrollmentConfirmation: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.EnrollmentConfirmation" })}
      </PageTitle>
      <EnrollmentConfirmationPage />
    </>
  );
};


export default EnrollmentConfirmation ;
