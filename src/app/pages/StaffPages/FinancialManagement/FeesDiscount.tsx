import "./style.css";
import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { TablesWidget80 } from "../../../../_metronic/partials/widgets";
import { Content } from "../../../../_metronic/layout/components/content";

const FeesDiscountPage: FC = () => {
  return (
    <div className="bg-white">
      <div>
        <Content>
          <div className="row">
            <div
              className="col-xxl-12"
              style={{
                top: "114px",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Manrope",
              }}
            >
              <TablesWidget80 />
            </div>
          </div>
        </Content>
      </div>
    </div>
  );
};

const FeesDiscount: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesDiscount" })}
      </PageTitle>
      <FeesDiscountPage />
    </>
  );
};

export default FeesDiscount;
