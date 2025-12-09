import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget72 } from "../../../../_metronic/partials/widgets";

const Roles: FC = () => {
  return (
    <div className="">
      <Content>
        <TablesWidget72 />
      </Content>
    </div>
  );
};

const Reference: FC = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <Roles />
    </>
  );
};

export default Reference;
