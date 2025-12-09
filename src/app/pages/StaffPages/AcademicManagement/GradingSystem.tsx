import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const GradingSystemPage: FC = () => {
  return <div>GradingSystem</div>;
};

const GradingSystem: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.GradingSystem" })}
      </PageTitle>
      <GradingSystemPage />
    </>
  );
};


export default GradingSystem;
