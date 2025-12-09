/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";
import { useAuth } from "../../../../../app/modules/auth";

type Props = {
  backgroundColor: string;
  title: string;
  titleColor: string;
  bigTextColor: string;
  smallTextColor: string;
  numberColor: string;
  footerColor: string;
};

const CardsWidget28: FC<Props> = ({
  backgroundColor,
  title,
  titleColor,
  bigTextColor,
  smallTextColor,
  numberColor,
  footerColor,
}) => {
  const {currentUser} = useAuth();
  const currency = currentUser.currency_symbol;
  return (
    <div
      className=" "
      style={{
        backgroundColor: `${backgroundColor}`,
        borderRadius: "16px",
        height: "160px",
        padding: "20px",
        gap: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className=" d-flex flex-column justify-content-between">
        <span
          style={{
            color: `${titleColor}`,
            fontWeight: "700",
            lineHeight: "19.12px",
            fontSize: "16px",
            fontFamily: "Manrope",
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          width: "310px",
          height: "88px",
          gap: "23px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "310px",
            height: "54px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "285px",
              height: "32px",
              borderRadius: "0px 5px 6px 0px",
              gap: "11px",
            }}
          >
            <span
              style={{
                width: "203px",
                height: "23px",
                color: `${bigTextColor}`,
                fontWeight: "700",
                fontSize: "30px",
                lineHeight: "36px",
                fontFamily: "Manrope",
              }}
            >
              {currency + " " + "5,62,56,526"}
            </span>
          </div>
          <div
            style={{
              width: "330px",
              height: "9px",
              borderRadius: "0px 5px 6px 0px",
              gap: "11px",
              display: "flex",
            }}
          >
            <div>
              <span
                style={{
                  width: "150px",
                  height: "9px",
                  gap: "5px",
                  fontSize: "14px",
                  fontWeight: "500",
                  lineHeight: "36px",
                  fontFamily: "Manrope",
                  color: `${smallTextColor}`,
                }}
              >
                Projected{" "}
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "36px",
                    fontFamily: "Manrope",
                    color: `${numberColor}`,
                  }}
                >
                  {currency + " " + "5,62,56,526"}
                </span>{" "}
              </span>
            </div>
            <div>
              <span
                style={{
                  width: "136px",
                  height: "9px",
                  gap: "5px",
                  fontSize: "14px",
                  fontWeight: "500",
                  lineHeight: "36px",
                  fontFamily: "Manrope",
                  color: `${smallTextColor}`,
                }}
              >
                Variance{" "}
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "36px",
                    fontFamily: "Manrope",
                    color: `${numberColor}`,
                  }}
                >
                  {currency + " " + "62,56,526"}
                </span>{" "}
              </span>
            </div>
          </div>
        </div>
        <div>
          <span
            style={{
              color: `${footerColor}`,
              fontWeight: "400",
              lineHeight: "16.39px",
              fontSize: "12px",
              fontFamily: "Manrope",
            }}
          >
            Last Year{" "}
            <span
              style={{
                color: `${footerColor}`,
                fontWeight: "700",
                lineHeight: "16.39px",
                fontSize: "12px",
                fontFamily: "Manrope",
              }}
            >
              {currency + " " + "52,34,6539"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export { CardsWidget28 };
