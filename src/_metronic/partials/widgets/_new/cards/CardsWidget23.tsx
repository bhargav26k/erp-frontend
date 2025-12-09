// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { FC, useEffect, useRef, useState } from "react";
// import { KTIcon } from "../../../../helpers";
// import { getCSSVariableValue } from "../../../../assets/ts/_utils";
// import { useThemeMode } from "../../../layout/theme-mode/ThemeModeProvider";
// import { useAuth } from "../../../../../app/modules/auth";

// type Props = {
//   className: string;
//   chartSize?: number;
//   chartLine?: number;
//   chartRotate?: number;
// };

// const CardsWidget23: FC<Props> = ({
//   className,
//   chartSize = 70,
//   chartLine = 11,
//   chartRotate = 145,
// }) => {
//   const { currentUser } = useAuth();
//   const [tableData, setTableData] = useState([]);
//   const chartRef = useRef<HTMLDivElement | null>(null);
//   const { mode } = useThemeMode();
//   useEffect(() => {
//     refreshChart();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mode]);

//   const refreshChart = () => {
//     if (!chartRef.current) {
//       return;
//     }

//     setTimeout(() => {
//       initChart(chartSize, chartLine, chartRotate);
//     }, 10);
//   };

//   useEffect(() => {
//     // Function to fetch data from the API
//     const fetchData = async () => {
//       try {
//         const session_id = currentUser?.student_session_id;
//         console.log(session_id);
//         // Assuming currentUser contains the session_id
//         const response = await fetch(
//           "https://erp.innoveraschool.com/site/get_homeworklist",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               // Add any other necessary headers
//             },
//             body: JSON.stringify({
//               class_id: "1",
//               section_id: "1",
//               student_id: "930",
//               start_date: "",
//               end_date: "",
//             }),
//           }
//         );

//         const data = await response.json();
//         console.log(data);

//         setTableData(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     // Call the fetchData function
//     fetchData();
//   }, [currentUser]);

//   return (
//     <div
//       className={`card card-flush justify-content-between d-flex flex-column ${className}`}
//       style={{ width: "330px" }}
//     >
//       <div className="card-header pt-5">
//         <div className="card-title d-flex flex-column">
//           <div className="d-flex align-items-center">
//             {/* <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>$</span> */}

//             <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
//               Summary
//             </span>

//             {/* <span className='badge badge-light-success fs-base'>
//               <KTIcon iconName='arrow-up' className='fs-5 text-success ms-n1' /> 2.2%
//             </span> */}
//           </div>
//           <span className="text-gray-500 pt-1 fw-semibold fs-6">
//             Home Details
//           </span>
//         </div>
//       </div>

//       {tableData.map((item) => (
//         <div className="card-body pt-2 pb-4 d-flex flex-wrap" key={item.id}>
//           <div className="d-flex flex-column content-justify-center flex-row-fluid">
//             <div className="d-flex fw-semibold align-items-center">
//               <KTIcon
//                 iconName="time"
//                 className="fs-4 text-success ms-n1 me-2"
//               />
//               <div className="text-gray-700 flex-grow-1 me-4">
//                 Homework Date:
//               </div>
//               <div className="fw-bolder text-gray-900 text-xxl-end">
//                 {item.homework_date}
//               </div>
//             </div>
//             <div className="d-flex fw-semibold align-items-center my-2">
//               <KTIcon
//                 iconName="time"
//                 className="fs-4 text-success ms-n1 me-2"
//               />
//               <div className="text-gray-700 flex-grow-1 me-4">
//                 Submission Date:
//               </div>
//               <div className="fw-bolder text-gray-900 text-xxl-end">
//                 {item.submit_date}
//               </div>
//             </div>
//             <div className="d-flex fw-semibold align-items-center">
//               <KTIcon
//                 iconName="time"
//                 className="fs-4 text-success ms-n1 me-2"
//               />
//               <div className="text-gray-700 flex-grow-1 me-4">
//                 Evaluation Date:
//               </div>
//               <div className="fw-bolder text-gray-900 text-xxl-end">
//                 {item.evaluation_date ?? "--"}
//               </div>
//             </div>
//           </div>
//           <div className="d-flex flex-column">
//             <div>
//               <span className="fw-bolder text-gray-800 text-xxl-end">
//                 Created By :
//               </span>
//               <span className="text-gray-900 text-xxl-end ms-2">
//                 {item.created_by}
//               </span>
//             </div>
//             <div>
//               <span className="fw-bolder text-gray-800 text-xxl-end">
//                 Evaluated By:
//               </span>
//               <span className="text-gray-900 text-xxl-end ms-2">--</span>
//             </div>
//             <div>
//               <span className="fw-bolder text-gray-800 text-xxl-end">
//                 Class:
//               </span>
//               <span className="text-gray-900 text-xxl-end ms-2">
//                 {item.class}
//               </span>
//             </div>
//             <div>
//               <span className="fw-bolder text-gray-800 text-xxl-end">
//                 Section:
//               </span>
//               <span className="text-gray-900 text-xxl-end ms-2">
//                 {item.section}
//               </span>
//             </div>
//             <div>
//               <span className="fw-bolder text-gray-800 text-xxl-end">
//                 Subject:
//               </span>
//               <span className="text-gray-900 text-xxl-end ms-2">
//                 {item.subject_name}
//               </span>
//             </div>
//             <div>
//               <span className="fw-bolder text-gray-800 text-xxl-end">
//                 Status:
//               </span>
//               {item.homework_status === "0" ? (
//                 <span className="text-gray-900 text-xxl-end ms-2">
//                   <a href="" className="btn btn-sm btn-danger fs-7 p-1">
//                     Incomplete
//                   </a>
//                 </span>
//               ) : (
//                 <span className="text-gray-900 text-xxl-end ms-2">
//                   <a href="" className="btn btn-sm btn-success fs-7 p-1">
//                     Complete
//                   </a>
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// const initChart = function (
//   chartSize: number = 70,
//   chartLine: number = 11,
//   chartRotate: number = 145
// ) {
//   const el = document.getElementById("kt_card_widget_17_chart");
//   if (!el) {
//     return;
//   }
//   el.innerHTML = "";

//   const options = {
//     size: chartSize,
//     lineWidth: chartLine,
//     rotate: chartRotate,
//     //percent:  el.getAttribute('data-kt-percent') ,
//   };

//   const canvas = document.createElement("canvas");
//   const span = document.createElement("span");

//   //@ts-ignore
//   if (typeof G_vmlCanvasManager !== "undefined") {
//     //@ts-ignore
//     G_vmlCanvasManager.initElement(canvas);
//   }

//   const ctx = canvas.getContext("2d");
//   canvas.width = canvas.height = options.size;

//   el.appendChild(span);
//   el.appendChild(canvas);

//   ctx?.translate(options.size / 2, options.size / 2); // change center
//   ctx?.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

//   //imd = ctx.getImageData(0, 0, 240, 240);
//   const radius = (options.size - options.lineWidth) / 2;

//   const drawCircle = function (
//     color: string,
//     lineWidth: number,
//     percent: number
//   ) {
//     percent = Math.min(Math.max(0, percent || 1), 1);
//     if (!ctx) {
//       return;
//     }

//     ctx.beginPath();
//     ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
//     ctx.strokeStyle = color;
//     ctx.lineCap = "round"; // butt, round or square
//     ctx.lineWidth = lineWidth;
//     ctx.stroke();
//   };

//   // Init 2
//   drawCircle("#E4E6EF", options.lineWidth, 100 / 100);
//   drawCircle(getCSSVariableValue("--bs-primary"), options.lineWidth, 100 / 150);
//   drawCircle(getCSSVariableValue("--bs-success"), options.lineWidth, 100 / 250);
// };

// export { CardsWidget23 };
