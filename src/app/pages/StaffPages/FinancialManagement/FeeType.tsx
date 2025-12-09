/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";

import { TablesWidget60 } from "../../../../_metronic/partials/widgets/tables/TablesWidget60";

const FeeTypePage: FC = () => {
  return (
    <div className="bg-white">
      <div>
        <Content>
          <div
            className="col-xxl-12"
            style={{
              top: "114px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TablesWidget60 />
          </div>
        </Content>
      </div>
    </div>
  );
};

const FeeType: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FEEDETAILS" })}
      </PageTitle>
      <FeeTypePage />
    </>
  );
};

export default FeeType;
