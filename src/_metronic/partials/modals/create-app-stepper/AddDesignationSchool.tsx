import React, { useState, useEffect } from "react";

import { DOMAIN,AddSchoolDesignations,getAllDesignations } from "../../../../app/routing/ApiEndpoints";
import Select from "react-select"; // For multi-select dropdown
import { Modal } from "react-bootstrap";

interface Designation {
  id: number;
  name: string;
}

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: (refresh: boolean) => void;
  assignedDesignationIds?: number[]; // List of already assigned designations (to disable)
  schoolId: string| undefined; // Ensure schoolId is passed from the parent component
};

const AddDesignationSchool: React.FC<Props> = ({
  show,
  handleClose,
  setRefresh,
  assignedDesignationIds = [], // Defaults to empty array if not provided
  schoolId,
}: Props) => {
  const [designations, setDesignations] = useState<Designation[]>([]); 
  const [selectedDesignations, setSelectedDesignations] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch designations from the backend
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${getAllDesignations}`);
        if (!response.ok) {
          // Extract the status and error message from the response
          const errorData = await response.json();
          throw new Error(`Error ${errorData.status}: ${errorData.error || "Unknown error"}`);
        }
        
        const result = await response.json();
        setDesignations(result.data); // Populate designations
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching Designations:", error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    if (show) {
      fetchDesignations(); // Fetch only when modal is shown
    }
  }, [show, schoolId]);

  // Handle selection change
  const handleDesignationChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((option: any) => option.value);
    setSelectedDesignations(selectedIds);
  };

  // Handle submit
  const handleSubmit = async () => {
    setIsLoading(true);
  
    try {
      // Prepare the payload with additional values like school_id, is_active, and update_user
      const updatedDesignations = selectedDesignations.map((designationId) => ({
        designation_id: designationId,
        school_id: schoolId,  // Assuming schoolId is passed as a prop
        is_active: 1,         // Assuming is_active is set to 1 (active) for new assignments
        update_user: 7        // Replace with actual user ID (or auth?.id if using an auth system)
      }));
  
      // Send the payload to the server
      const response = await fetch(
        `${DOMAIN}/${AddSchoolDesignations}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            designations: updatedDesignations,  // Send the array of designations with other details
            school_id: schoolId,               // Add school_id outside as well if needed globally
            is_active: 1,                      // Default is_active for all assignments
            update_user: 7                     // Default user performing the update
          }),
        }
      );
  
      if (!response.ok) {
      // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(`Error ${errorData.status}: ${errorData.error || "Unknown error"}`);
      }
  
      toast.success("Designations saved successfully", { autoClose: 3000 });
      setRefresh(true); // Trigger a refresh if necessary
      handleClose();    // Close the modal after successful submission
    } catch (error) {
      console.error("Error Adding designation:", error);
      toast.error("Failed to save designations", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  // Create options for Select component with disabled checkboxes for already assigned designations
  const designationOptions = designations.map((designation) => ({
    value: designation.id,
    label: designation.name,
    isDisabled: assignedDesignationIds.includes(designation.id), // Disable if already assigned
  }));

  return (
    <Modal
      id="kt_modal_create_school"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleClose}
      backdrop={true}
    >
      <div
        className="card-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          padding: "16px 20px",
          borderBottom: "1px solid #E0E4F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#1C335C",
            fontFamily: "Manrope",
          }}
        >
          Assign Designations
        </span>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>

      <div
        className="modal-body py-lg-10 px-lg-10"
        style={{ backgroundColor: "#F2F6FF" }}
      >
        <Select
          options={designationOptions}
          isMulti
          onChange={handleDesignationChange}
          isOptionDisabled={(option) => option.isDisabled} // Disable already assigned options
          placeholder="Select designations..."
          className="basic-multi-select"
          classNamePrefix="select"
          closeMenuOnSelect={false}
        />

        <div
          className="d-flex justify-content-end mt-5"
          style={{
            paddingRight: "30px",
          }}
        >
          <button
            className="btn btn-primary"
            style={{
              display: "flex",
              justifyContent: "end",
              backgroundColor: "#1C335C",
              fontFamily: "Manrope",
            }}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export { AddDesignationSchool };
