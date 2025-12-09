import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import { StepperComponent } from "../../../assets/ts/components";
import { KTIcon } from "../../../helpers";
import { useAuth } from "../../../../app/modules/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  show: boolean;
  handleClose: () => void;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateApplyLeaveModal = ({ show, handleClose }: Props) => {
  const { currentUser } = useAuth();
  // console.log(currentUser);
  
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reasons, setReasons] = useState("");
  const [file, setFile] = useState(null);

  const stepperRef = useRef<HTMLDivElement | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stepper, setStepper] = useState<StepperComponent | null>(null);

  const loadStepper = () => {
    setStepper(
      StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    );
  };
  const handleFromDateChange = (date :unknown) => {
            
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
    setFromDate(date);
  };

  const handleToDateChange = (date :unknown) => {
            
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
    setToDate(date);
  };

  const handleFileChange = (e :unknown) => {
            
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleReasonsChange = (e :unknown) => {
            
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
    const reasonsValue = e.target.value;
    setReasons(reasonsValue);
  };


  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const session_id = currentUser?.student_session_id;
        // Assuming currentUser contains the session_id
        const response = await fetch(
          "https://erp.innoveraschool.com/site/get_leave_request_details",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any other necessary headers
            },
            body: JSON.stringify({ student_session_id: session_id }),
          }
        );

        const data = await response.json();

        setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [currentUser]);

  
  const handleSave = async () => {
   
    try {
      // Create a FormData object to send as the body of the POST request
      const formData = new FormData();
      // formData.append('student_id', currentUser?.student_id|| '');
      // formData.append('class_id', currentUser?.class_id|| '');
      // formData.append('section_id', currentUser?.section_id|| '');
      // formData.append('from_date', fromDate ? fromDate.toISOString() : '');
      // formData.append('to_date', toDate ? toDate.toISOString() : '');
      // formData.append('reason', reasons);
      if (file) {
        formData.append('attachment', file);
      }

      // Make the API request using fetch
      const response = await fetch('https://erp.innoveraschool.com/site/add_leave_request', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Handle success
        handleClose();
      } else {
        // Handle errors
        console.error('Error saving data:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-650px"
      show={show}
      onHide={handleClose}
      onEntered={loadStepper}
      backdrop={true}
    >
      <div className="modal-header">
        <h2>Add Leave</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <KTIcon className="fs-1" iconName="cross" />
        </div>
      </div>
      {/* <TablesWidget18 className="card-xxl-stretch mb-5 mb-xl-8" /> */}
      <div className="p-10">
        <form>
          <div className="mb-3">
            <label htmlFor="exampleInputClass1" className="form-label">
              Class
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputClass1"
              // value={currentUser?.student_class}
              readOnly
            />
          </div>

          <div className="row g-2 mb-3 ">
            <div className="col-md-6">
              <label htmlFor="fromDate" className="form-label">
                From Date
              </label>
              <div className="mb-3">
                <DatePicker
                  className="form-control"
                  selected={fromDate}
                  onChange={handleFromDateChange}
                  id="fromDate"
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"

                />
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="toDate" className="form-label">
                To Date
              </label>
              <div className="mb-3">
                <DatePicker
                  className="form-control relative min-w-150 !important"
                  selected={toDate}
                  onChange={handleToDateChange}
                  id="toDate"
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="form">
              <textarea
                className="form-control"
                onChange={handleReasonsChange}
                id="floatingTextarea2"
                style={{ maxHeight: "100px", resize: "none" }}
                placeholder="Mention Any Reasons"
              />
            </div>
          </div>

          <div className="mb-3">
          <label htmlFor="formFile" className="form-label">
            Attach Document
          </label>
          <input className="form-control" type="file" id="formFile" onChange={handleFileChange} />
        </div>
        </form>
      </div>
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

export { CreateApplyLeaveModal };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function setTableData(data: unknown) {
    throw new Error("Function not implemented.");
  }

