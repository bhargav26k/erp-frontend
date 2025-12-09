import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import { StepperComponent } from "../../../assets/ts/components";
import { KTIcon } from "../../../helpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  selectDate: (date: Date) => void;
  show: boolean;
  handleClose: () => void;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateAppModal = ({ selectDate, show, handleClose }: Props) => {
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [stepper, setStepper] = useState<StepperComponent | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadStepper = () => {
    setStepper(
      StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    );
  };
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    selectDate(date);
  };
  const handleSave = () => {
    handleClose();
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-500px"
      show={show}
      onHide={handleClose}
      onEntered={loadStepper}
      backdrop={true}
    >
      <div className="modal-header">
        <h2>Add Fees Master : 2023 -2024</h2>
        {/* begin::Close */}
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <KTIcon className="fs-1" iconName="cross" />
        </div>
        {/* end::Close */}
      </div>
      <form>
        <div
          className="modal-body px-lg-10 "
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <div>
            <label className="required">Fees Group</label>
            <select
              className="form-select border border-black required"
              data-control="select2"
              data-placeholder="Filters"
              data-hide-search="true"
              required
            >
              <option value="0">All Sections</option>
              <option value="1">Section A</option>
              <option value="2">Section B</option>
              <option value="3">Section C</option>
            </select>
          </div>

          <div>
            <label className="required">Fees Type</label>
            <select
              className="form-select border border-black required"
              data-control="select2"
              data-placeholder="Filters"
              data-hide-search="true"
              required
            >
              <option value="0">All Sections</option>
              <option value="1">Section A</option>
              <option value="2">Section B</option>
              <option value="3">Section C</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Due Date
            </label>
            <input
              type="email"
              className="form-control border border-black required"
              id="exampleFormControlInput1"
              placeholder="Enter Date"
            />
          </div>

          <div>
            <label className="required">Due Type</label>
            <select
              className="form-select border border-black required "
              data-control="select2"
              data-placeholder="Filters"
              data-hide-search="true"
              required
            >
              <option value="0">All Sections</option>
              <option value="1">Section A</option>
              <option value="2">Section B</option>
              <option value="3">Section C</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Amount
            </label>
            <input
              type="number"
              className="form-control border border-black required"
              id="exampleFormControlInput1"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Fine Type
            </label>
            <div className="d-flex gap-5">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  checked
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  None
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  Percentage
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  Fix Amount
                </label>
              </div>
            </div>
            <div className="d-flex gap-5 mt-5">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label required"
                >
                 Percentage
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter percentage"
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label required"
                >
                   {school_id?.slice(0, 3) === "INN" ? "Administrative Charges" : "Fine Amount"}
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter Amount"
                  required
                  aria-required
                />
              </div>
            </div>
          </div>

          {/* end::Content */}
        </div>
      </form>

      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
      {/* </div> */}
    </Modal>,
    modalsRoot
  );
};

export { CreateAppModal };

// import {useRef, useState} from 'react'
// import {createPortal} from 'react-dom'
// import {Modal} from 'react-bootstrap'
// import {defaultCreateAppData, ICreateAppData} from './IAppModels'
// import {StepperComponent} from '../../../assets/ts/components'
// import {KTIcon} from '../../../helpers'
// import {Step1} from './steps/Step1'
// import {Step2} from './steps/Step2'
// import {Step3} from './steps/Step3'
// import {Step4} from './steps/Step4'
// import {Step5} from './steps/Step5'

// type Props = {
//   show: boolean
//   handleClose: () => void
// }

// const modalsRoot = document.getElementById('root-modals') || document.body

// const CreateAppModal = ({show, handleClose}: Props) => {
//   const stepperRef = useRef<HTMLDivElement | null>(null)
//   const [ stepper, setStepper ] = useState<StepperComponent | null>(null)
//   const [data, setData] = useState<ICreateAppData>(defaultCreateAppData)
//   const [hasError, setHasError] = useState(false)

//   const loadStepper = () => {
//     setStepper(StepperComponent.createInsance(stepperRef.current as HTMLDivElement))
//   }

//   const updateData = (fieldsToUpdate: Partial<ICreateAppData>) => {
//     const updatedData = {...data, ...fieldsToUpdate}
//     setData(updatedData)
//   }

//   const checkAppBasic = (): boolean => {
//     if (!data.appBasic.appName || !data.appBasic.appType) {
//       return false
//     }
//     return true
//   }

//   const checkAppDataBase = (): boolean => {
//     if (!data.appDatabase.databaseName || !data.appDatabase.databaseSolution) {
//       return false
//     }

//     return true
//   }

//   const prevStep = () => {
//     if (!stepper) {
//       return
//     }

//     stepper.goPrev()
//   }

//   const nextStep = () => {
//     setHasError(false)
//     if (!stepper) {
//       return
//     }

//     if (stepper.getCurrentStepIndex() === 1) {
//       if (!checkAppBasic()) {
//         setHasError(true)
//         return
//       }
//     }

//     if (stepper.getCurrentStepIndex() === 3) {
//       if (!checkAppDataBase()) {
//         setHasError(true)
//         return
//       }
//     }

//     stepper.goNext()
//   }

//   const submit = () => {
//     window.location.reload()
//   }

//   return createPortal(
//     <Modal
//       id='kt_modal_create_app'
//       tabIndex={-1}
//       aria-hidden='true'
//       dialogClassName='modal-dialog modal-dialog-centered mw-900px'
//       show={show}
//       onHide={handleClose}
//       onEntered={loadStepper}
//       backdrop={true}
//     >
//       <div className='modal-header'>
//         <h2>Create App</h2>
//         {/* begin::Close */}
//         <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={handleClose}>
//           <KTIcon className='fs-1' iconName='cross' />
//         </div>
//         {/* end::Close */}
//       </div>

//       <div className='modal-body py-lg-10 px-lg-10'>
//         {/*begin::Stepper */}
//         <div
//           ref={stepperRef}
//           className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
//           id='kt_modal_create_app_stepper'
//         >
//           {/* begin::Aside*/}
//           <div className='d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px'>
//             {/* begin::Nav*/}
//             <div className='stepper-nav ps-lg-10'>
//               {/* begin::Step 1*/}
//               <div className='stepper-item current' data-kt-stepper-element='nav'>
//                 {/* begin::Wrapper*/}
//                 <div className='stepper-wrapper'>
//                   {/* begin::Icon*/}
//                   <div className='stepper-icon w-40px h-40px'>
//                     <i className='stepper-check fas fa-check'></i>
//                     <span className='stepper-number'>1</span>
//                   </div>
//                   {/* end::Icon*/}

//                   {/* begin::Label*/}
//                   <div className='stepper-label'>
//                     <h3 className='stepper-title'>Details</h3>

//                     <div className='stepper-desc'>Name your App</div>
//                   </div>
//                   {/* end::Label*/}
//                 </div>
//                 {/* end::Wrapper*/}

//                 {/* begin::Line*/}
//                 <div className='stepper-line h-40px'></div>
//                 {/* end::Line*/}
//               </div>
//               {/* end::Step 1*/}

//               {/* begin::Step 2*/}
//               <div className='stepper-item' data-kt-stepper-element='nav'>
//                 {/* begin::Wrapper*/}
//                 <div className='stepper-wrapper'>
//                   {/* begin::Icon*/}
//                   <div className='stepper-icon w-40px h-40px'>
//                     <i className='stepper-check fas fa-check'></i>
//                     <span className='stepper-number'>2</span>
//                   </div>
//                   {/* begin::Icon*/}

//                   {/* begin::Label*/}
//                   <div className='stepper-label'>
//                     <h3 className='stepper-title'>Frameworks</h3>

//                     <div className='stepper-desc'>Define your app framework</div>
//                   </div>
//                   {/* begin::Label*/}
//                 </div>
//                 {/* end::Wrapper*/}

//                 {/* begin::Line*/}
//                 <div className='stepper-line h-40px'></div>
//                 {/* end::Line*/}
//               </div>
//               {/* end::Step 2*/}

//               {/* begin::Step 3*/}
//               <div className='stepper-item' data-kt-stepper-element='nav'>
//                 {/* begin::Wrapper*/}
//                 <div className='stepper-wrapper'>
//                   {/* begin::Icon*/}
//                   <div className='stepper-icon w-40px h-40px'>
//                     <i className='stepper-check fas fa-check'></i>
//                     <span className='stepper-number'>3</span>
//                   </div>
//                   {/* end::Icon*/}

//                   {/* begin::Label*/}
//                   <div className='stepper-label'>
//                     <h3 className='stepper-title'>Database</h3>

//                     <div className='stepper-desc'>Select the app database type</div>
//                   </div>
//                   {/* end::Label*/}
//                 </div>
//                 {/* end::Wrapper*/}

//                 {/* begin::Line*/}
//                 <div className='stepper-line h-40px'></div>
//                 {/* end::Line*/}
//               </div>
//               {/* end::Step 3*/}

//               {/* begin::Step 4*/}
//               <div className='stepper-item' data-kt-stepper-element='nav'>
//                 {/* begin::Wrapper*/}
//                 <div className='stepper-wrapper'>
//                   {/* begin::Icon*/}
//                   <div className='stepper-icon w-40px h-40px'>
//                     <i className='stepper-check fas fa-check'></i>
//                     <span className='stepper-number'>4</span>
//                   </div>
//                   {/* end::Icon*/}

//                   {/* begin::Label*/}
//                   <div className='stepper-label'>
//                     <h3 className='stepper-title'>Storage</h3>

//                     <div className='stepper-desc'>Provide storage details</div>
//                   </div>
//                   {/* end::Label*/}
//                 </div>
//                 {/* end::Wrapper*/}

//                 {/* begin::Line*/}
//                 <div className='stepper-line h-40px'></div>
//                 {/* end::Line*/}
//               </div>
//               {/* end::Step 4*/}

//               {/* begin::Step 5*/}
//               <div className='stepper-item' data-kt-stepper-element='nav'>
//                 {/* begin::Wrapper*/}
//                 <div className='stepper-wrapper'>
//                   {/* begin::Icon*/}
//                   <div className='stepper-icon w-40px h-40px'>
//                     <i className='stepper-check fas fa-check'></i>
//                     <span className='stepper-number'>5</span>
//                   </div>
//                   {/* end::Icon*/}

//                   {/* begin::Label*/}
//                   <div className='stepper-label'>
//                     <h3 className='stepper-title'>Completed</h3>

//                     <div className='stepper-desc'>Review and Submit</div>
//                   </div>
//                   {/* end::Label*/}
//                 </div>
//                 {/* end::Wrapper*/}
//               </div>
//               {/* end::Step 5*/}
//             </div>
//             {/* end::Nav*/}
//           </div>
//           {/* begin::Aside*/}

//           {/*begin::Content */}
//           <div className='flex-row-fluid py-lg-5 px-lg-15'>
//             {/*begin::Form */}
//             <form noValidate id='kt_modal_create_app_form'>
//               <Step1 data={data} updateData={updateData} hasError={hasError} />
//               <Step2 data={data} updateData={updateData} hasError={hasError} />
//               <Step3 data={data} updateData={updateData} hasError={hasError} />
//               <Step4 data={data} updateData={updateData} hasError={hasError} />
//               <Step5 />

//               {/*begin::Actions */}
//               <div className='d-flex flex-stack pt-10'>
//                 <div className='me-2'>
//                   <button
//                     type='button'
//                     className='btn btn-lg btn-light-primary me-3'
//                     data-kt-stepper-action='previous'
//                     onClick={prevStep}
//                   >
//                     <KTIcon iconName='arrow-left' className='fs-3 me-1' /> Previous
//                   </button>
//                 </div>
//                 <div>
//                   <button
//                     type='button'
//                     className='btn btn-lg btn-primary'
//                     data-kt-stepper-action='submit'
//                     onClick={submit}
//                   >
//                     Submit <KTIcon iconName='arrow-right' className='fs-3 ms-2 me-0' />
//                   </button>

//                   <button
//                     type='button'
//                     className='btn btn-lg btn-primary'
//                     data-kt-stepper-action='next'
//                     onClick={nextStep}
//                   >
//                     Next Step <KTIcon iconName='arrow-right' className='fs-3 ms-1 me-0' />
//                   </button>
//                 </div>
//               </div>
//               {/*end::Actions */}
//             </form>
//             {/*end::Form */}
//           </div>
//           {/*end::Content */}
//         </div>
//         {/* end::Stepper */}
//       </div>
//     </Modal>,
//     modalsRoot
//   )
// }

// export {CreateAppModal}
