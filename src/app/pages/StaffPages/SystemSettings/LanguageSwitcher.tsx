
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const LanguageSwitcherPage: FC = () => {
  return <div>LanguageSwitcher</div>;
};

const LanguageSwitcher: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.LanguageSwitcher" })}
      </PageTitle>
      <LanguageSwitcherPage />
    </>
  );
};


export { LanguageSwitcher };
