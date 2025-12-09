
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ManageAlumniPage: FC = () => {
  return <div>ManageAlumni</div>;
};

const ManageAlumni: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ManageAlumni" })}
      </PageTitle>
      <ManageAlumniPage />
    </>
  );
};


export { ManageAlumni };
