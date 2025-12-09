
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const SetupFontOfficePage: FC = () => {
  return <div>SetupFontOffice</div>;
};

const SetupFontOffice: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SetupFontOffice" })}
      </PageTitle>
      <SetupFontOfficePage />
    </>
  );
};


export { SetupFontOffice };