
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const HostelPage: FC = () => {
  return <div>Hostel</div>;
};

const Hostel: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Hostel" })}
      </PageTitle>
      <HostelPage />
    </>
  );
};


export { Hostel };