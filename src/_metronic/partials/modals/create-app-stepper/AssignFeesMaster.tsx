import React, { useEffect, useState } from "react";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Button, Form, Modal, Table } from "react-bootstrap";
import "./AssignFeesMaster.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AssignFeesMasterProps {
  show: boolean;
  onHide: () => void;
  classId: string | null;
  groupName: string | null;
  schoolId: string | undefined;
  feeDetails: FeeDetail[];
}

interface FeeDetail {
  fee_type_id: any;
  fee_group_type_id: any;
  fee_id: number;
  fee_name: string;
  fee_group_id: number;
  fee_amount: string;
  fee_group_session_id: string;
}

interface Student {
  admission_id: any;
  part_payment: any;
  has_transactions: boolean | undefined;
  student_id: string;
  gr_number: string;
  student_name: string;
  student_session_id: string;
  is_existed?: boolean;
  allow_partial_payment?: boolean;
}

const AssignFeesMaster: React.FC<AssignFeesMasterProps> = ({
  show,
  onHide,
  classId,
  groupName,
  schoolId,
  feeDetails,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  console.log(students);
  

  const [checkedStudents, setCheckedStudents] = useState<{
    [key: string]: boolean;
  }>({});
  const [changedStudents, setChangedStudents] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkedPartPayment, setCheckedPartPayment] = useState<{
    [key: string]: boolean;
  }>({});
  const [changedPartPayment, setChangedPartPayment] = useState<{
    [key: string]: boolean;
  }>({});

  const [selectAll, setSelectAll] = useState(false);
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const sessionId = currentUser?.session_id;
  const session_name = currentUser?.session_name;

  const feeGroupId = feeDetails[0]?.fee_group_id;
  const [allChecked, setAllChecked] = useState(false);
  const [allPartialChecked, setPartialAllChecked] = useState(false);

  useEffect(() => {
    if (classId && schoolId && feeGroupId) {
      fetchStudents(classId, schoolId, feeGroupId);
    }
  }, [classId, schoolId, feeGroupId]);

  useEffect(() => {
    if (classId && schoolId && feeDetails[0]?.fee_group_id) {
      fetchStudents(classId, schoolId, feeGroupId);
    }
  }, [classId, schoolId, feeGroupId]);

  useEffect(() => {
    const allSelected =
      students.length > 0 &&
      students.every((student) => checkedStudents[student.admission_id]);
    setAllChecked(allSelected);
  }, [students, checkedStudents]);
  useEffect(() => {
    const allSelected =
      students.length > 0 &&
      students.every((student) => checkedStudents[student.part_payment]);
    setPartialAllChecked(allSelected);
  }, [students, checkedPartPayment]);

  // Fetch students API
  const fetchStudents = async (
    classId: string,
    schoolId: string,
    feeGroupId: number
  ) => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/classes/${classId}/students?schoolId=${schoolId}&feeGroupId=${feeGroupId}`
      );
      const data = await response.json();

      setStudents(data);
      const initialChecked = data.reduce((acc, student) => {
        acc[student.admission_id] = !!student.is_existed;
        return acc;
      }, {});

      setCheckedStudents(initialChecked);

      const initialPartialChecked = data.reduce((acc, student) => {
        acc[student.admission_id] = !!student.part_payment;
        return acc;
      }, {});

      setCheckedPartPayment(initialPartialChecked);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleCheck = (student: Student) => {
    if (student.has_transactions) return;
  
    setCheckedStudents((prevState) => {
      const updatedState = {
        ...prevState,
        [student.admission_id]: !prevState[student.admission_id],
      };
  
      if (!updatedState[student.admission_id]) {
        setCheckedPartPayment((prev) => ({
          ...prev,
          [student.admission_id]: false,
        }));
      }
  
      setChangedStudents((prev) => {
        const newState = { ...prev };
        if (student.is_existed && !updatedState[student.admission_id]) {
          newState[student.admission_id] = false;
        } else if (!student.is_existed && updatedState[student.admission_id]) {
          newState[student.admission_id] = true;
        } else {
          delete newState[student.admission_id];
        }
        return newState;
      });
      return updatedState;
    });
  };
  
  const handlePartialCheck = (student: Student) => {
    if (student.has_transactions) return;
  
    setCheckedPartPayment((prevState) => {
      const updatedState = {
        ...prevState,
        [student.admission_id]: !prevState[student.admission_id],
      };
      setChangedPartPayment((prev) => {
        const newState = { ...prev };
        if (student.part_payment && !updatedState[student.admission_id]) {
          newState[student.admission_id] = false;
        } else if (!student.part_payment && updatedState[student.admission_id]) {
          newState[student.admission_id] = true;
        } else {
          delete newState[student.admission_id];
        }
        return newState;
      });
      return updatedState;
    });
  };
  

  const handleSelectAll = () => {
    const newSelectAll = !allChecked;
    setAllChecked(newSelectAll);
  
    const updatedChecked = students.reduce((acc, student) => {
      if (!student.has_transactions) {
        acc[student.admission_id] = newSelectAll;
      }
      return acc;
    }, {});
  
    setCheckedStudents(updatedChecked);
  
    const updatedChanged = students.reduce((acc, student) => {
      if (!student.has_transactions && checkedStudents[student.admission_id] !== newSelectAll) {
        acc[student.admission_id] = newSelectAll;
      }
      return acc;
    }, {});
  
    setChangedStudents(updatedChanged);
  };
  
  const handlePartialSelectAll = () => {
    const newSelectAll = !allPartialChecked;
    setPartialAllChecked(newSelectAll);
  
    const updatedChecked = students.reduce((acc, student) => {
      if (!student.has_transactions && !student.part_payment && checkedStudents[student.admission_id]) {
        acc[student.admission_id] = newSelectAll;
      } else {
        acc[student.admission_id] = !!checkedPartPayment[student.admission_id];
      }
      return acc;
    }, {});
  
    setCheckedPartPayment(updatedChecked);
  
    const updatedChanged = students.reduce((acc, student) => {
      if (!student.has_transactions && checkedStudents[student.admission_id] && student.is_existed) {
        acc[student.admission_id] = newSelectAll;
      }
      return acc;
    }, {});
  
    setChangedPartPayment(updatedChanged);
  };
  

  const handleSubmit = async () => {
    const entries = Object.entries(changedStudents).flatMap(([admission_id, value]) => {
      const student = students.find((s) => s.admission_id === admission_id);
      const studentSessionId = student?.student_session_id;
      const studentId = student?.student_id;
  
      if (value) {
        return feeDetails.map((feeDetail) => ({
          admissionId: admission_id,
          studentId: studentId, // include this if available
          studentSessionId,
          feeGroupId: feeDetail.fee_group_id,
          feeTypeId: feeDetail.fee_type_id,
          fee_group_session_id: feeDetail.fee_group_session_id,
          fee_group_type_id: feeDetail.fee_group_type_id,
          amount: feeDetail.fee_amount,
          userId,
          sessionId,
          schoolId,
          part_payment: changedPartPayment[admission_id] || false,
        }));
      } else {
        const feeGroupSessionId = feeDetails[0].fee_group_session_id;
        const feeGroupId = feeDetails[0].fee_group_id;
        return {
          admissionId: admission_id,
          feeGroupId,
          feeGroupSessionId,
          schoolId,
        };
      }
    });
  
    try {
      const addEntries = entries.filter((entry) => entry.feeTypeId);
      const removeEntries = entries.filter((entry) => !entry.feeTypeId);
      const partPaymentUpdates = Object.entries(changedPartPayment).map(([admissionId, part_payment]) => ({
        admissionId,
        part_payment,
        feeGroupId: feeDetails[0].fee_group_id,
        schoolId,
      }));
  
      if (Object.keys(changedPartPayment).length > 0 && Object.keys(changedStudents).length === 0) {
        const response = await fetch(`${DOMAIN}/api/school/update-partpayment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(partPaymentUpdates),
        });
        const data = await response.json();
        if (data.message === "Part payment updated successfully") {
          toast.success("Part payment updated successfully");
        }
      } else {
        if (addEntries.length > 0) {
          const response = await fetch(`${DOMAIN}/api/school/add-studentfeesmaster`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addEntries),
          });
          const data = await response.json();
          if (data.message === "Data saved successfully") {
            toast.success("Students added successfully");
          }
        }
  
        if (removeEntries.length > 0) {
          const response = await fetch(`${DOMAIN}/api/school/remove-studentfeesmaster`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(removeEntries),
          });
          const data = await response.json();
          if (data.message === "Data removed successfully") {
            toast.success("Students removed successfully");
          }
        }
      }
  
      handleClose();
    } catch (error) {
      console.error("Error saving or removing data:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  
  const handleClose = () => {
    // Resetting all the necessary states
    setStudents([]); // Clear the students list
    setCheckedStudents({}); // Clear checkedStudents state, it should be an empty object
    setChangedStudents({});
    setCheckedPartPayment({});
    setChangedPartPayment({});
    setSelectAll(false); // Reset the 'Select All' state
    // Close the modal or perform any necessary closing actions
    onHide();
  };

  return (
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleClose}
      backdrop="static"
      className="custom-modal"
      style={{ fontFamily: "manrope" }}
    >
      <Modal.Header closeButton style={{ backgroundColor: "#F2F6FF" }}>
        <Modal.Title
          style={{
            fontSize: "24px",
            fontWeight: 800,
          }}
        >
          Assign Fees Master : {session_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "14px",
            }}
          >
            <strong
              style={{
                fontSize: "18px",
              }}
            >
              Group Name:{" "}
            </strong>{" "}
            {groupName}
          </div>
          <div
            style={{
              fontSize: "14px",
            }}
          >
            <strong
              style={{
                fontSize: "18px",
              }}
            >
              Fee Type:{" "}
            </strong>
            {feeDetails.map((fee, idx) => (
              <span key={idx}>{fee.fee_name}, </span>
            ))}
          </div>
        </div>
        <div className="table-responsive">
          <Table
            bordered
            hover
            className="table-striped"
            style={{ color: "#1C335C" }}
          >
            <thead>
              <tr>
                <th>Admission ID</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>
                  <Form.Check
                    type="checkbox"
                    label="Select All"
                    checked={allChecked}
                    disabled={allChecked}
                    onChange={handleSelectAll}
                    style={{
                      color: "#1C335C",
                      accentColor: "#1C335C",
                      // transform: "scale(1.2)",
                    }}
                  />
                </th>
                <th>
                  <Form.Check
                    type="checkbox"
                    label="Allow 60% Select All"
                    checked={allPartialChecked}
                    disabled={allPartialChecked}
                    onChange={handlePartialSelectAll}
                    style={{
                      color: "#1C335C",
                      accentColor: "#1C335C",
                      // transform: "scale(1.2)",
                    }}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.admission_id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#F2F6FF" : "white",
                    color: "#1C335C",
                  }}
                >
                  <td>{student.admission_id}</td>
                  <td>{student.gr_number}</td>
                  <td>{student.student_name}</td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={checkedStudents[student.admission_id]}
                      onChange={() => handleCheck(student)}
                      disabled={student.has_transactions}
                      style={{
                        accentColor: "#1C335C",
                        // transform: "scale(1.2)",
                      }}
                    />
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={checkedPartPayment[student.admission_id]}
                      onChange={() => handlePartialCheck(student)}
                      disabled={
                        student.has_transactions ||
                        !checkedStudents[student.admission_id]
                      }
                      style={{
                        accentColor: "#1C335C",
                        // transform: "scale(1.2)",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="d-flex justify-content-end mt-4">
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AssignFeesMaster;
