/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";

const CardsWidget15: FC = () => {
  return (
    <div
      style={{
        backgroundColor: "#F2F6FF",
        width: "180px",
        height: "145px",
        borderRadius: "16px",
        padding: "24px",
        gap: "30px",
        display: "flex",
        // justifyContent: "start",
        justifyContent:'start',
        alignItems:'start',
        flexDirection: "column",
      }}
    >
      <div>
        <span
          style={{
            color: "#000000",
            fontWeight: "600",
            lineHeight: "21.86px",
            fontSize: "16px",
          }}
        >
          Cost/Enquiry
        </span>
      </div>
      <div
        style={{
          width: "85px",
          height: "55px",
        //   gap: "10px",
          display:'flex',
          flexDirection: "column",
        }}
      >
        <div style={{width:'78px', height:'36px'}}>
            <span style={{fontSize:'32px', fontWeight:'600',lineHeight:'36px', color:'#000000'}}>₹550</span>
        </div>
        <div style={{width:'95px', height:'9px', gap:'12px'}}>
            <span style={{fontSize:'12px', fontWeight:'400',lineHeight:'16.39px', color:'#000000'}}>Last Year <span style={{fontSize:'12px', fontWeight:'700',lineHeight:'16.39px', color:'#000000'}}>₹650</span></span>
        </div>
      </div>
    </div>
  );
};

export { CardsWidget15 };
