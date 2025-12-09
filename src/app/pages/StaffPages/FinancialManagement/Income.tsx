import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import {
  TablesWidget10,
  CardsWidget28,
  CardsWidget29,
  ChartsWidget16,
  TablesWidget24,
} from "../../../../_metronic/partials/widgets";
import { Content } from "../../../../_metronic/layout/components/content";
import { ToolbarFeeMaster } from "../../../../_metronic/layout/components/toolbar/toolbars";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { useAuth } from "../../../modules/auth";

const IncomePage: FC = () => {
  const [displayComponent, setDisplayComponent] = useState("chart");
  const handleToggle = (value: string) => {
    // console.log(value);
    setDisplayComponent(value);
  };

  const {currentUser} = useAuth();
  const currency = currentUser.currency_symbol
  return (
    <div className="bg-white">
      <HeaderWrapper toggleView={handleToggle} />
      {displayComponent === "list" ? (
        <div>
          <ToolbarFeeMaster />
          <Content>
            <div className="row">
              <div
                className="col-xxl-12"
                style={{
                  // width: "1367px",
                  // height: "696px",
                  top: "114px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TablesWidget10 />
              </div>
            </div>
          </Content>
        </div>
      ) : (
        <div>
          <ToolbarFeeMaster />
          <Content>
            <div className="row">
              <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-7">
                <div className="row p-0 mb-5 mb-xl-5">
                  <div
                    className="col-md-6 col-lg-6 col-xl-6 col-xxl-6"
                    style={{ height: "fit-content" }}
                  >
                    <div className="h-md-100">
                      <CardsWidget28
                        backgroundColor={"#1F3259"}
                        title={"Total Income"}
                        bigTextColor={"#A7FFB0"}
                        smallTextColor={"#F0F0F0"}
                        footerColor={"#C6E0F3"}
                        numberColor={"#FFFFFF"}
                        titleColor={"#FFFFFF"}
                      />
                    </div>
                  </div>
                  <div
                    className="col-md-6 col-lg-6 col-xl-6 col-xxl-6"
                    style={{ height: "fit-content" }}
                  >
                    <div
                    // style={{
                    //   width: "361px",
                    //   height: "178px",
                    //   display: "flex",
                    //   flexDirection: "column",
                    // }}
                    >
                      <CardsWidget28
                        backgroundColor={"#FFE7E1"}
                        title={"Total Cost"}
                        bigTextColor={"#FF5B5B"}
                        smallTextColor={"#000000"}
                        footerColor={"#000000"}
                        numberColor={"#000000"}
                        titleColor={"#000000"}
                      />
                    </div>
                  </div>
                </div>

                <div className=" col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                  <div className=" h-md-100">
                    <ChartsWidget16 />
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-5 px-3">
                <div className="row p-0 mb-5 mb-xl-5" style={{ gap: "auto" }}>
                  <div
                    className="col-md-6 col-lg-6 col-xl-6 col-xxl-4"
                    style={{ height: "fit-content" }}
                  >
                    <div
                    // style={{
                    //   width: "361px",
                    //   height: "178px",
                    //   display: "flex",
                    //   flexDirection: "column",
                    // }}
                    >
                      <CardsWidget29
                        title={"Net Profit Margin"}
                        bigTextColor={"#29B837"}
                        backgroundColor={"#F2F6FF"}
                        iconColor={"#29B837"}
                        numberValue={"44%"}
                        textWidth={"104px"}
                      />
                    </div>
                  </div>
                  <div
                    className="col-md-6 col-lg-6 col-xl-6 col-xxl-4"
                    style={{ height: "fit-content" }}
                  >
                    <div
                    // style={{
                    //   width: "361px",
                    //   height: "178px",
                    //   display: "flex",
                    //   flexDirection: "column",
                    // }}
                    >
                      <CardsWidget29
                        title={"Revenue Per Student"}
                        bigTextColor={"#29B837"}
                        backgroundColor={"#F2F6FF"}
                        iconColor={"#29B837"}
                        numberValue={currency + " " +"56,256"}
                        textWidth={"126px"}
                      />
                    </div>
                  </div>
                  <div
                    className="col-md-6 col-lg-6 col-xl-6 col-xxl-4"
                    style={{ height: "fit-content" }}
                  >
                    <div
                    // style={{
                    //   width: "361px",
                    //   height: "178px",
                    //   display: "flex",
                    //   flexDirection: "column",
                    // }}
                    >
                      <CardsWidget29
                        title={"Outstanding Per Student"}
                        bigTextColor={"#ED5578"}
                        backgroundColor={"rgba(237, 85, 120, 0.20)"}
                        iconColor={"#ED5578"}
                        numberValue={currency + " " + "5625"}
                        textWidth={"149px"} 
                      />
                    </div>
                  </div>
                </div>

                <div className=" col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                  <div className=" h-md-100">
                    <TablesWidget24 />
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </div>
      )}
    </div>
  );
};

const Income: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Income" })}
      </PageTitle>
      <IncomePage />
    </>
  );
};

export default Income;
