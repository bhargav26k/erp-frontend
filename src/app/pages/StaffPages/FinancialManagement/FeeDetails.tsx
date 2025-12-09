import "./style.css";
import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import {
  CardsWidget21,
  TablesWidget10,
  CardsWidget25,
  CardsWidget26,
  CardsWidget27,
  ChartsWidget1,
  TablesWidget11,
  TablesWidget14,
} from "../../../../_metronic/partials/widgets";
import { Content } from "../../../../_metronic/layout/components/content";
// import { ToolbarFeeMaster } from "../../../../_metronic/layout/components/toolbar/toolbars";
// import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";

const FeeDetailsPage: FC = () => {
  const [displayComponent, setDisplayComponent] = useState("chart");
  // const handleToggle = (value: string) => {
  //   // console.log(value);
  //   setDisplayComponent(value);
  // };

  return (
    <div className="bg-white">
      {/* <HeaderWrapper toggleView={handleToggle} /> */}
      {displayComponent === "list" ? (
        <div>
          {/* <ToolbarFeeMaster onSelectValue={undefined} /> */}
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
                  fontFamily:"Manrope",
                }}
              >
                <TablesWidget14 />
              </div>
            </div>
          </Content>
        </div>
      ) : (
        <div>
          {/* <ToolbarFeeMaster onSelectValue={undefined} /> */}
          <Content>

            <div className="row mb-5 mb-xl-7">
              <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-2">
                <div
                  className="h-md-100 mb-5 mb-xl-10"
                >
                  <CardsWidget21 />
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-4 ">
                <div
                  className=" h-md-100 mb-5 mb-xl-10"
                >
                  <CardsWidget25 />
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 ">
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
                  <CardsWidget26 />
                </div>
              </div>

              <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 ">
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
                  <CardsWidget27 />
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
                <div
                  className=" h-md-100"
                  style={{
                    // width: "727px",
                    // height: "556px",
                    // display: "flex",
                    // flexDirection: "column",
                  }}
                >
                  <ChartsWidget1 />
                </div>
              </div>
              <div className=" col-md-12 col-lg-12 col-xl-12 col-xxl-6">
                <div
                  className=" h-md-100"
                  style={{
                    // width: "619px",
                    // height: "557px",
                    // display: "flex",
                    // flexDirection: "column",
                  }}
                >
                  <TablesWidget11 />
                </div>
              </div>
            </div>
          </Content>
        </div>
      )}
    </div>
  );
};

const FeeDetails: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FEEDETAILS" })}
      </PageTitle>
      <FeeDetailsPage />
    </>
  );
};

export default FeeDetails ;
