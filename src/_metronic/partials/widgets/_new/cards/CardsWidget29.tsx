/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";

type Props = {
    title: string
    bigTextColor: string
    backgroundColor: string
    iconColor: string
    numberValue:string
    textWidth:string
  }


const CardsWidget29: FC<Props> = ({
    title,
    bigTextColor,
    backgroundColor,
    iconColor,
    numberValue,
    textWidth
  }) => {
  return (
    <div className=""
      style={{
        backgroundColor: `${backgroundColor}`,
        // width: `${width}`,
        height: "160px",
        borderRadius: "16px",
        padding: "24px",
        gap: "20px",
        display: "flex",
        justifyContent: "start",
        fontFamily:"Manrope",
      }}
    >
      <div className="card-header d-flex " style={{width:'100%'}}>
        <div className="card-title d-flex flex-column" style={{width:'100%', justifyContent:'space-around', gap:'16px'}}>
          <span
            style={{
              color: "#000",
              fontWeight: "600",
              // lineHeight: "19.12px",
              fontSize: "16px",
              
              fontFamily:"Manrope",
              width:textWidth,
            //  border:'1px solid'
            }}
          >
            {title}
          </span>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <div className="d-flex align-items-center" style={{width:'250px',height:'36px', gap:'3px'}}>
              <span
                style={{
                  color: `${bigTextColor}`,
                  fontWeight: "600",
                  fontSize: "32px",
                  lineHeight: "36px",
                  fontFamily: "Manrope",
                  
                }}
              >
                {numberValue}
              </span>

              <span style={{width:'69px',height:'18px',gap:'10px'}}>
                <svg
                  
                  viewBox="0 0 13 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{width:'12.5px',height:'8px'}}
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.95488 1.60777L12.5 0L11.1198 5.6061L9.39804 3.9532L6.62069 6.84627C6.52641 6.94448 6.39615 7 6.26 7C6.12385 7 5.99359 6.94448 5.89931 6.84627L3.86 4.72199L0.860694 7.84627C0.669457 8.04547 0.35294 8.05193 0.153735 7.86069C-0.0454709 7.66946 -0.0519304 7.35294 0.139307 7.15373L3.49931 3.65373C3.59359 3.55552 3.72385 3.5 3.86 3.5C3.99615 3.5 4.12641 3.55552 4.22069 3.65373L6.26 5.77801L8.67665 3.26067L6.95488 1.60777Z"
                    fill={`${iconColor}`}
                  />
                </svg>
              </span>
            </div>
            <div>
            <span
              style={{
                color: "#000",
                fontWeight: "400",
                lineHeight: "16.39px",
                fontSize: "12px",
                fontFamily:"Manrope",
              }}
            >
              Last Year{" "}
              <span
                style={{
                  color: "#000",
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
    </div>
  );
};

export { CardsWidget29 };
