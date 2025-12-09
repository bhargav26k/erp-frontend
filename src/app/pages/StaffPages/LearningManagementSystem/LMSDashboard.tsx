import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget28 } from "../../../../_metronic/partials/widgets/tables/TablesWidget28";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { CardsWidget30 } from "../../../../_metronic/partials/widgets/_new/cards/CardsWidget30";
import { CardsWidget31 } from "../../../../_metronic/partials/widgets/_new/cards/CardsWidget31";
import { CardsWidget32 } from "../../../../_metronic/partials/widgets/_new/cards/CardsWidget32";
import { CardsWidget33 } from "../../../../_metronic/partials/widgets/_new/cards/CardsWidget33";
import { CardsWidget34 } from "../../../../_metronic/partials/widgets/_new/cards/CardsWidget34";
import { CardsWidget35 } from "../../../../_metronic/partials/widgets/_new/cards/CardsWidget35";

import { TablesWidget36 } from "../../../../_metronic/partials/widgets/tables/TablesWidget36";
import { ToolbarFeeMaster } from "../../../../_metronic/layout/components/toolbar/toolbars/ToolbarFeeMaster";
import { TablesWidget38 } from "../../../../_metronic/partials/widgets/tables/TablesWidget38";

const LMSDashboardPage: FC = () => {
  
  return (
    <div className="">
      <HeaderWrapper toggleView={() => {}} />

      <Content>
        <div className="row mb-5 mb-xl-7">
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
            <div className="h-md-100 mb-5 mb-xl-10">
              <CardsWidget30 />
            </div>
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2 ">
            <div className=" h-md-100 mb-5 mb-xl-10">
              <CardsWidget31 />
            </div>
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2 ">
            <div
              className=" h-md-100"
              style={
                {
                  // width: "312px",
                  // height: "135px",
                  // display: "flex",
                  // flexDirection: "column",
                }
              }
            >
              <CardsWidget32 />
            </div>
          </div>

          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
            <div
              className=" h-md-100"
              style={
                {
                  // width: "300px",
                  // height: "135px",
                  // display: "flex",
                  // flexDirection: "column",
                }
              }
            >
              <CardsWidget33 />
            </div>
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
            <div
              className=" h-md-100"
              style={
                {
                  // width: "300px",
                  // height: "135px",
                  // display: "flex",
                  // flexDirection: "column",
                }
              }
            >
              <CardsWidget34 />
            </div>
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
            <div
              className=" h-md-100"
              style={
                {
                  // width: "300px",
                  // height: "135px",
                  // display: "flex",
                  // flexDirection: "column",
                }
              }
            >
              <CardsWidget35 />
            </div>
          </div>
        </div>

        <div className="row g-5 g-xl-7 mb-md-5 mb-xl-10">
          <div
            className=" col-md-12 col-lg-12 col-xl-12 col-xxl-6 "
            style={
              {
                // width: "100%",
                // height: "fit-content",
                // top: "154px",
                // left: "104px",
                // display: "flex",
                // flexDirection: "row",
                // border:'1px solid',
                // gap: "20px",
              }
            }
          >
            <div className=" h-md-100" style={{}}>
              <TablesWidget36 />
            </div>
          </div>
          <div className=" col-md-12 col-lg-12 col-xl-12 col-xxl-6">
            <div
              className=" h-md-100"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <TablesWidget38 />
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

const LMSDashboard: FC = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <LMSDashboardPage />
    </>
  );
};

export default LMSDashboard;
