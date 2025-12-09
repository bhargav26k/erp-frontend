/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";
// import { DOMAIN } from '../../../../../app/routing/ApiEndpoints.tsx'; 


const CardsWidget12: FC = () => {
  return (
    <div
      className="col-md-12 col-lg-12 col-xl-12"
      style={{
        backgroundColor: "#FFE7E1",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "107px",
        borderRadius: "16px",
        justifyContent: "space-between",
        padding: "20px",
        // gap: "60px",
        // justifyContent: "",
        alignItems: "start",
        fontFamily: "Manrope",
      }}
    >
      <div style={{ width: "55%", height: "34px" }}>
        <span
          style={{
            color: "#000000",
            fontWeight: "600",
            // width:'32px',
            lineHeight: "21.86px",
            fontSize: "16px",
          }}
        >
          Cost / Enquiry
        </span>
      </div>
      <div
        style={{
          width: "45%",
          height: "55px",
          gap: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "36px",
            display: "flex",
            alignItems: "center",
            gap: "3px",
            justifyContent: "end",
          }}
        >
          <span
            style={{
              fontSize: "30px",
              fontWeight: "600",
              lineHeight: "36px",
              color: "#FF5B5B",
            }}
          >
            ₹550
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "9px",
            gap: "12px",
            display: "flex",
            justifyContent: "right",
            textAlign:'right'
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "16.39px",
              color: "#000000",
            }}
          >
            Last Year{" "}
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                lineHeight: "16.39px",
                color: "#000000",
              }}
            >
              ₹650
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export { CardsWidget12 };
