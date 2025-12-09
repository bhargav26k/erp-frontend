import React, { useState, useEffect } from "react";
import { useAuth } from "../../../modules/auth";
import { useLocation } from "react-router-dom"; 
import { DOMAIN } from "../../../routing/ApiEndpoints";

const EmployeeProfile: React.FC = () => {
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const { currentUser } = useAuth();
    const school_id = (currentUser as any)?.school_id;
    const [refresh, setRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("Personal Information");
  
    const location = useLocation();
  
    // Extract the staff_id from the query params
    const params = new URLSearchParams(location.search);
    const staff_id = params.get("staff_id"); // Get the staff_id from the query params


    useEffect(() => {
      const fetchStaff = async () => {
        try {
          const response = await fetch(`${DOMAIN}/api/school/get-allstaff-details/${school_id}/${staff_id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const responseData = await response.json();
          setFilteredData(responseData);
          setRefresh(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchStaff();
    }, [school_id, refresh]);
  
    const handleTabChange = (tabName: string) => {
      setActiveTab(tabName);
    };
  
    if (filteredData.length === 0) {
      return <div>Loading...</div>;
    }
  
    const employee = filteredData[0]; // Assuming you're fetching one employee, adjust as necessary
  

  return (
    <div className="employee-profile-container" style={{ padding: "20px", width: "100%", height:'100%', margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#B1E3FF",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={employee.image || "https://via.placeholder.com/80"}
            alt="Profile"
            className="rounded-circle"
            style={{ width: "90px", height: "90px", marginRight: "15px", objectFit: "cover" }}
          />
          <div>
            <h4>{employee.name + " " + employee.surname}</h4>
            <p className="mb-0 text-muted">
              <strong>Employee Id: </strong>
              {employee.employee_id}
            </p>
            <p className="mb-0 text-muted">
              <strong>Role: </strong>
              {employee.role}
            </p>
          </div>
        </div>
        <button
          onClick={() => alert("Edit profile clicked!")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1C335C",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        {["Personal Information", "Family Information", "Work & Bank Information", "Social Media & Documents"].map(
          (tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => handleTabChange(tab)}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                borderBottom: activeTab === tab ? "3px solid #1C335C" : "none",
              }}
            >
              {tab}
            </div>
          )
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content" style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px" }}>
        {activeTab === "Personal Information" && (
          <div>
            <p><strong>Date of Birth:</strong> {new Date(employee.dob).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {employee.gender}</p>
            <p><strong>Marital Status:</strong> {employee.marital_status}</p>
            <p><strong>Contact Number:</strong> {employee.contact_no}</p>
          </div>
        )}

        {activeTab === "Family Information" && (
          <div>
            <p><strong>Father's Name:</strong> {employee.father_name}</p>
            <p><strong>Mother's Name:</strong> {employee.mother_name}</p>
            <p><strong>Emergency Contact:</strong> {employee.emergency_contact_no}</p>
          </div>
        )}

        {activeTab === "Work & Bank Information" && (
          <div>
            <p><strong>Designation:</strong> {employee.designation}</p>
            <p><strong>Date of Joining:</strong> {new Date(employee.date_of_joining).toLocaleDateString()}</p>
            <p><strong>Bank Account:</strong> {employee.bank_account_no}</p>
            <p><strong>IFSC Code:</strong> {employee.ifsc_code}</p>
          </div>
        )}

        {activeTab === "Social Media & Documents" && (
          <div>
            <p><strong>Facebook:</strong> {employee.facebook}</p>
            <p><strong>LinkedIn:</strong> {employee.linkedin}</p>
            <p><strong>Resume:</strong> <a href={`path/to/resume/${employee.resume}`}>Download</a></p>
            <p><strong>Other Document:</strong> <a href={`path/to/doc/${employee.other_document_file}`}>Download</a></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
