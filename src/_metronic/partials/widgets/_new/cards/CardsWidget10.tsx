/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";

// **Read this before Editing the below file**
// this is component to display "Admissions Probability" which have the styling based on the Figma files of the
// previous designs.
// api will be connected soon as the data will be ready after calculations
const CardsWidget10: FC = () => {
  return (
    <div
      className=""
      style={{
        backgroundColor: "#F2F6FF",
        // width: "236px",
        height: "160px",
        borderRadius: "16px",
        padding: "24px",
        gap: "16px",
        display: "flex",
        justifyContent: "start",
        fontFamily: "Manrope",
      }}
    >
      <div className="card-header d-flex ">
        <div
          className="card-title d-flex flex-column justify-content-between"
          style={{ display: "flex", flexDirection: "column", gap: "38px" }}
        >
          <div>
            <span
              style={{
                color: "#000000",
                fontWeight: "700",
                lineHeight: "21.86px",
                fontSize: "16px",
              }}
            >
              Admissions Probability
            </span>
          </div>
          <div>
            <div
              className="d-flex align-items-center"
              style={{ width: "144px", height: "36px", gap: "3px" }}
            >
              <span
                style={{
                  color: "#29B837",
                  fontWeight: "700",
                  fontSize: "30px",
                  lineHeight: "36px",
                }}
              >
                85%
              </span>

              <span style={{ width: "69px", height: "18px", gap: "10px" }}>
                <svg
                  viewBox="0 0 13 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "12.5px", height: "8px", color: "#29B837" }}
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.95488 1.60777L12.5 0L11.1198 5.6061L9.39804 3.9532L6.62069 6.84627C6.52641 6.94448 6.39615 7 6.26 7C6.12385 7 5.99359 6.94448 5.89931 6.84627L3.86 4.72199L0.860694 7.84627C0.669457 8.04547 0.35294 8.05193 0.153735 7.86069C-0.0454709 7.66946 -0.0519304 7.35294 0.139307 7.15373L3.49931 3.65373C3.59359 3.55552 3.72385 3.5 3.86 3.5C3.99615 3.5 4.12641 3.55552 4.22069 3.65373L6.26 5.77801L8.67665 3.26067L6.95488 1.60777Z"
                    fill="#29B837"
                  />
                </svg>
              </span>
            </div>
            <span
              style={{
                color: "#000000",
                fontWeight: "400",
                lineHeight: "16.39px",
                fontSize: "12px",
              }}
            >
              Last Year{" "}
              <span
                style={{
                  color: "#000000",
                  fontWeight: "700",
                  lineHeight: "16.39px",
                  fontSize: "12px",
                }}
              >
                76%
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CardsWidget10 };
