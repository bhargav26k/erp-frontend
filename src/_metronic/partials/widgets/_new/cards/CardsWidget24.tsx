// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { FC, useEffect, useRef } from "react";
// import { getCSSVariableValue } from "../../../../assets/ts/_utils";
// import { useThemeMode } from "../../../layout/theme-mode/ThemeModeProvider";

// type Props = {
//   className: string;
//   chartSize?: number;
//   chartLine?: number;
//   chartRotate?: number;
// };

// const CardsWidget24: FC<Props> = ({
//   className,
//   chartSize = 120,
//   chartLine = 20,
//   chartRotate = 0,
// }) => {
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
//       return initChart(chartRef.current, chartSize, chartLine, chartRotate);
//     }, 10);
//   };

//   return (
//     <div className={`card card-flush ${className}`}>
//       <div className="card-header pt-5">
//         <div className="card-title d-flex flex-column align-items-center mx-auto">
//           <span className="fs-2hx fw-bold text-gray-900 me-2  lh-1 ls-n2">
//             Maths
//           </span>
//           <span className="text-gray-500 pt-1 fw-semibold fs-6">
//             Progress Report
//           </span>
//         </div>
//       </div>

//       <div className="card-body pt-2 pb-4 d-flex flex-column align-items-center">
//         <div className="d-flex flex-center me-5 pt-2">
//           <div
//             // id="kt_card_widget_17_chart"
//             ref={chartRef}
//             style={{ minWidth: chartSize + "px", minHeight: chartSize + "px" }}
//             data-kt-size={chartSize}
//             data-kt-line={chartLine}
//           ></div>
//         </div>

//         <div className="d-flex flex-column content-justify-center flex-row-fluid">
//           <div className="d-flex fw-semibold align-items-center">
//             <div className="bullet w-8px h-3px rounded-2 bg-success me-3"></div>
//             <div className="text-gray-500 flex-grow-1 me-4">Completed</div>
//             <div className="fw-bolder text-gray-700 text-xxl-end">45%</div>
//           </div>
//           <div className="d-flex fw-semibold align-items-center">
//             <div
//               className="bullet w-8px h-3px rounded-2 me-3"
//               style={{ backgroundColor: "#a0a0a0" }}
//             ></div>
//             <div className="text-gray-500 flex-grow-1 me-4">Remaining</div>
//             <div className=" fw-bolder text-gray-700 text-xxl-end">55%</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const initChart = function (
//   el: HTMLDivElement,
//   chartSize: number = 70,
//   chartLine: number = 11,
//   chartRotate: number = 145
// ) {
//   if (!el) {
//     return;
//   }
//   el.innerHTML = "";

//   const options = {
//     size: chartSize,
//     lineWidth: chartLine,
//     rotate: chartRotate,
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
//     ctx.lineCap = "round";
//     ctx.lineWidth = lineWidth;
//     ctx.stroke();
//   };

//   // Init 2
//   drawCircle("#a0a0a0", options.lineWidth, 100 / 100);
//   drawCircle(getCSSVariableValue("--bs-success"), options.lineWidth, 180 / 250);
// };

// export { CardsWidget24 };
