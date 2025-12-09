
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CommunicationLogPage: FC = () => {
  return <div>CommunicationLog</div>;
};

const CommunicationLog: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CommunicationLog" })}
      </PageTitle>
      <CommunicationLogPage />
    </>
  );
};


export default CommunicationLog ;
