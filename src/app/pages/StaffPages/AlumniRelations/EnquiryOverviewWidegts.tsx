
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EnquiryOverviewWidegtsPage: FC = () => {
  return <div>EnquiryOverviewWidegts</div>;
};

const EnquiryOverviewWidegts: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.EnquiryOverviewWidegts" })}
      </PageTitle>
      <EnquiryOverviewWidegtsPage />
    </>
  );
};


export { EnquiryOverviewWidegts };
