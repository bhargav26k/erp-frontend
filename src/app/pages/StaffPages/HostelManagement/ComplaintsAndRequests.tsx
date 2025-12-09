
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ComplaintsAndRequestsPage: FC = () => {
  return <div>ComplaintsAndRequests</div>;
};

const ComplaintsAndRequests: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ComplaintsAndRequests" })}
      </PageTitle>
      <ComplaintsAndRequestsPage />
    </>
  );
};


export { ComplaintsAndRequests };
