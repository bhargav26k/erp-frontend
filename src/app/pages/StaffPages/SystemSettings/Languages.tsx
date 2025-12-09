
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const LanguagesPage: FC = () => {
  return <div>Languages</div>;
};

const Languages: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Languages" })}
      </PageTitle>
      <LanguagesPage />
    </>
  );
};


export { Languages };
