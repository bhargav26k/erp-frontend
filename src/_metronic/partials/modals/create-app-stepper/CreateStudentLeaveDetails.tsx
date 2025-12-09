// import { useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { Modal } from "react-bootstrap";
// import { StepperComponent } from "../../../assets/ts/components";
// import { KTIcon } from "../../../helpers";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { TablesWidget18 } from "../../widgets/tables/TablesWidget18";
// // import { TablesWidget20 } from "../../widgets/tables/TablesWidget20";

// type Props = {
//   show: boolean;
//   handleClose: () => void;
// };

// const modalsRoot = document.getElementById("root-modals") || document.body;

// const CreateStudentLeaveDetails = ({ show, handleClose }: Props) => {
//   const stepperRef = useRef<HTMLDivElement | null>(null);
//   const [stepper, setStepper] = useState<StepperComponent | null>(null);

//   const loadStepper = () => {
//     setStepper(
//       StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
//     );
//   };
//   const handleSave = () => {
//     handleClose();
//   };

//   return createPortal(
//     <Modal
//       id="kt_modal_create_app"
//       tabIndex={-1}
//       aria-hidden="true"
//       dialogClassName="modal-dialog modal-dialog-centered mw-800px"
//       show={show}
//       onHide={handleClose}
//       onEntered={loadStepper}
//       backdrop={true}
//     >
//       <div className="modal-header">
//         <h2>Homework Details</h2>
//         <div
//           className="btn btn-sm btn-icon btn-active-color-primary"
//           onClick={handleClose}
//         >
//           <KTIcon className="fs-1" iconName="cross" />
//         </div>
//       </div>
//       <TablesWidget20 className="card-xxl-stretch mb-5 mb-xl-8" />
//       {/* </div> */}
//     </Modal>,
//     modalsRoot
//   );
// };

// export { CreateStudentLeaveDetails };
