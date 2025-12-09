// /* eslint-disable @typescript-eslint/ban-ts-comment */

// const CardsWidget27: React.FC = () => {
//   return (
//     <div className=" h-md-100 mb-5 mb-xl-10"
//       style={{
//         // width: "300px",
//         // height: "180px",
//         padding: "20px",
//         borderRadius: "16px",
//         backgroundColor: "#FFE7E1",
//         display: "flex",
//         flexDirection: "column",
//         gap: "27px",
//       }}
//     >
//       <div style={{ width: "213px", height: "10px" }}>
//         <span
//           style={{
//             fontSize: "14px",
//             lineHeight: "19.12px",
//             fontWeight: "600",
//             color: "#212121",
//           }}
//         >
//           Fee Defaulters
//         </span>
//       </div>

//       <div //1div whole box
//         style={{
//           display: "flex",
//           width: "247px",
//           height: "55px",
//           gap: "28px",
//           flex: "column",
//           alignItems: "center",
//         }}
//       >
//         <div
//           className="d-flex row"
//           style={{
//             width: "162px",
//             height: "55px",
//             gap: "10px",
//           }}
//         >
//           <div style={{ width: "138px", height: "36px", gap: "3px" }}>
//             <div
//               style={{
//                 display: "flex",
//                 width: "138px",
//                 height: "18px",
//                 gap: "5px",
//                 flex: "column",
//               }}
//             >
//               <div style={{ width: "72px", height: "36px" }}>
//                 <span
//                   style={{
//                     fontSize: "32px",
//                     fontWeight: "600",
//                     lineHeight: "36px",
//                     color: "#FF5B5B",
//                   }}
//                 >
//                   15%
//                 </span>
//               </div>
//               <div
//                 style={{
//                   width: "87px",
//                   height: "36px",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "87px",
//                     height: "18px",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: "12px",
//                       fontWeight: "600",
//                       lineHeight: "18px",
//                     }}
//                   >
//                     250{" "}
//                     <span
//                       style={{
//                         fontSize: "12px",
//                         fontWeight: "400",
//                         lineHeight: "18px",
//                       }}
//                     >
//                       {" "}
//                       Students
//                     </span>
//                   </span>
//                 </div>
//                 <div
//                   style={{
//                     width: "69px",
//                     height: "18px",
//                     gap: "10px",
//                   }}
//                 >
//                   <svg
//                     width="13"
//                     height="8"
//                     viewBox="0 0 13 8"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       fill-rule="evenodd"
//                       clip-rule="evenodd"
//                       d="M7.23307 6.39223L13 8L11.5646 2.3939L9.77396 4.0468L6.88552 1.15374C6.78746 1.05552 6.65199 1 6.5104 1C6.36881 1 6.23334 1.05552 6.13528 1.15374L4.0144 3.27801L0.895122 0.153735C0.696235 -0.0454702 0.367058 -0.0519304 0.159884 0.139307C-0.0472897 0.330544 -0.0540076 0.647061 0.144879 0.846267L3.63928 4.34627C3.73734 4.44448 3.87281 4.5 4.0144 4.5C4.15599 4.5 4.29146 4.44448 4.38952 4.34627L6.5104 2.22199L9.02371 4.73933L7.23307 6.39223Z"
//                       fill="#29B837"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div style={{ width: "130px", height: "9px", gap: "12px" }}>
//             <span
//               style={{
//                 fontSize: "12px",
//                 fontWeight: "400",
//                 lineHeight: "16.39px",
//                 color: "#373737",
//               }}
//             >
//               Last Year{" "}
//               <span style={{ fontWeight: "600", fontSize: "12px" }}> 18%</span>
//             </span>
//           </div>
//         </div>
//         <div
//           style={{
//             width: "85px",
//             height: "55px",
//             justifyContent: "right",
//             display:'flex',
//             alignItems:'end'
//           }}
//         >
//           <button
//             style={{
//               backgroundColor: "#000000",
//               color: "#FFFFFF",
//               padding: "10px 10px 9px 10px",
//               borderRadius: "42px",
//               gap: "10px",
//               fontSize: "12px",
//               lineHeight: "16.39px",
//               fontWeight: "500",
//               border: "none",
//               width:'60px',
//               height:'25px',
//               display:'flex',
//               alignItems:'center'
//             }}
//           >
//             Details
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { CardsWidget27 };

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";

const CardsWidget27: FC = () => {
  return (
    <div
      className=" h-md-100 mb-md-5 mb-lg-5"
      style={{
        backgroundColor: "#FFE7E1",
        borderRadius: "16px",
        padding: "20px",
        gap: "27px",
        display: "flex",
        // border:'1px solid green',
        // width: "100%",
      }}
    >
      <div className="card-header d-flex" style={{ width: "100%" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "#212121",
              fontWeight: "700",
              lineHeight: "19.12px",
              fontSize: "16px",
              fontFamily: "Manrope",
            }}
          >
            Fee Defaulters
          </span>
          <div
            className="d-flex flex-row justify-content-between"
            style={{ width: "100%", alignItems:'end' }}
          >
            <div style={{ width: "80%" }}>
              <div style={{ width: "138px", height: "42px", gap: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    width: "138px",
                    height: "18px",
                    gap: "10px",
                    flex: "column"
                  }}
                >
                  <div style={{ width: "72px", height: "36px"}}>
                    <span
                      style={{
                        fontSize: "30px",
                        fontWeight: "700",
                        lineHeight: "36px",
                        color: "#FF5B5B",
                        fontFamily: "Manrope",
                      }}
                    >
                      15%
                    </span>
                  </div>
                  <div
                    style={{
                      width: "87px",
                      height: "36px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        width: "90px",
                        height: "18px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          fontFamily: "Manrope",
                        }}
                      >
                        250{" "}
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            lineHeight: "18px",
                            fontFamily: "Manrope",
                          }}
                        >
                          {" "}
                          Students
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        width: "69px",
                        height: "18px",
                        gap: "10px",
                      }}
                    >
                      <svg
                        width="15"
                        height="10"
                        viewBox="0 0 13 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.23307 6.39223L13 8L11.5646 2.3939L9.77396 4.0468L6.88552 1.15374C6.78746 1.05552 6.65199 1 6.5104 1C6.36881 1 6.23334 1.05552 6.13528 1.15374L4.0144 3.27801L0.895122 0.153735C0.696235 -0.0454702 0.367058 -0.0519304 0.159884 0.139307C-0.0472897 0.330544 -0.0540076 0.647061 0.144879 0.846267L3.63928 4.34627C3.73734 4.44448 3.87281 4.5 4.0144 4.5C4.15599 4.5 4.29146 4.44448 4.38952 4.34627L6.5104 2.22199L9.02371 4.73933L7.23307 6.39223Z"
                          fill="#29B837"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <span
                style={{
                  // marginTop:'15px',
                  // border:'1px solid',
                  color: "#373737",
                  fontWeight: "400",
                  lineHeight: "16.39px",
                  fontSize: "12px",
                  fontFamily: "Manrope",
                }}
              >
                Last Year{" "}
                <span
                  style={{
                    color: "#373737",
                    fontWeight: "700",
                    lineHeight: "16.39px",
                    fontSize: "12px",
                    fontFamily: "Manrope",
                  }}
                >
                  76%
                </span>
              </span>
            </div>
            <div
              style={{
                width: "85px",
                height: "55px",
                justifyContent: "right",
                display: "flex",
                alignItems: "end",
              }}
            >
              <button
                style={{
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  padding: "10px 10px 9px 10px",
                  borderRadius: "42px",
                  gap: "10px",
                  fontSize: "14px",
                  lineHeight: "16.39px",
                  fontWeight: "600",
                  border: "none",
                  width: "90px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Manrope",
                }}
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CardsWidget27 };
