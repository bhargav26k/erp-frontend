/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";

// **Read this before Editing the below file**
// this is component to display "the Life Time Value Per Admission" which have the styling based on the Figma files of the
// previous designs.
// api will be connected soon as the data will be ready after calculations

const CardsWidget11: FC = () => {
  return (
    <div
      className=""
      style={{
        backgroundColor: "#1F3259",
        height: "160px",
        borderRadius: "16px",
        padding: "20px",
        gap: "18px",
        display: "flex",
        justifyContent: "start",
        fontFamily: "Manrope",
      }}
    >
      <div className="card-header d-flex ">
        <div className="card-title d-flex flex-column justify-content-between">
          <div>
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: "600",
                lineHeight: "21.86px",
                fontSize: "16px",
                fontFamily: "Manrope",
              }}
            >
              Life Time Value Per Admission
            </span>
          </div>
          <div
            className="d-flex"
            style={{ flexDirection: "column", gap: "2px" }}
          >
            <div style={{ width: "200px", height: "40px" }}>
              <span
                style={{
                  color: "#FFC7A7",
                  fontWeight: "700",
                  fontSize: "30px",
                  lineHeight: "36px",
                }}
              >
                ₹12,00,092
              </span>
            </div>
            <span
              style={{
                color: "#C6E0F3",
                fontWeight: "400",
                lineHeight: "16.39px",
                fontSize: "12px",
              }}
            >
              Last Year{" "}
              <span
                style={{
                  color: "#C6E0F3",
                  fontWeight: "700",
                  lineHeight: "16.39px",
                  fontSize: "12px",
                }}
              >
                ₹13,00,000
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CardsWidget11 };
