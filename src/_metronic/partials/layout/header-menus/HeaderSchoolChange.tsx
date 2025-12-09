import { FC, useState, useEffect } from "react";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { changeMasterSchoolUser, getSchoolMasterBySchoolId, changeSchoolUser,
  getSchoolBySchoolId } from "../../../../app/modules/auth/core/_requests";
import * as authHelper from "../../../../app/modules/auth/core/AuthHelpers";
import { useNavigate } from "react-router-dom";

interface HeaderSchoolChangeProps {
  setSchoolName: (name: string) => void;
}

const HeaderSchoolChange: FC<HeaderSchoolChangeProps> = ({ setSchoolName }) => {
  const { currentUser, saveAuth, setCurrentUser } = useAuth();

  const [schools, setSchools] = useState<{ school_id: string; school_name: string }[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState(currentUser?.school_id);
  const [loading, setLoading] = useState(false);
  const userEmail = currentUser?.email;
  const userId = currentUser?.id;
  const isMaster = currentUser?.roleId;
  const Navigate = useNavigate();


  useEffect(() => {
    const fetchSchools = async () => {
      if (!userId) return;
      try {
        let response;
        if (isMaster === '3') {
          response = await fetch(`${DOMAIN}/api/school/get-master-schools/${userId}`);
        } else {
          response = await fetch(`${DOMAIN}/api/school/get-user-schools/${userId}`);
        }
  
        if (!response.ok) throw new Error("Failed to fetch school names");
        
        const data = await response.json();
        setSchools(data);
        
      } catch (error) {
        console.error("Error fetching school names:", error);
      }
    };
    
    fetchSchools();
  }, [userId, isMaster,selectedSchoolId]);

  const handleSchoolChange = async (schoolId: string) => {
    if (schoolId === selectedSchoolId || !currentUser) return;

    setLoading(true);
    setSelectedSchoolId(schoolId);
    const previousAuth = { ...authHelper.getAuth() };
    const previousUser = { ...currentUser };

    try {
      if (userEmail && userId && schoolId) {
        if (currentUser.role_id === 6) {

        const { data: authData } = await changeMasterSchoolUser(userEmail, schoolId);

        if (authData) {
          saveAuth(authData); // Update local storage with new auth data

          const { data: user } = await getSchoolMasterBySchoolId(userId, schoolId);
          setCurrentUser(user.data?.[0]); // Update current user details in state
          Navigate('/')
        }
      } else {
        // Call the standard functions
        const { data: authData } = await changeSchoolUser(
          userEmail,
          schoolId,
        );
        

        if (authData) {
          saveAuth(authData);
          const { data: user } = await getSchoolBySchoolId(
            userId,
            schoolId,
          );
          setCurrentUser(user.data?.[0]); // Update current user details in state
          Navigate('/')
        }
      }
      }
    } catch (error) {
      console.error("Error changing school:", error);
      setSelectedSchoolId(previousAuth.school_id); // Revert to previous school selection
      saveAuth(previousAuth);
      setCurrentUser(previousUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const selectedSchool = schools.find((school) => school.school_id === selectedSchoolId);
    if (selectedSchool) {
      setSchoolName(selectedSchool.school_name); // Update the displayed school name
    }
  }, [selectedSchoolId, schools, setSchoolName]); // Add dependencies

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded-12 w-250px"
      data-kt-menu="true"
      style={{ padding: "10px" }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "10px" }}>Loading...</div>
      ) : (
        schools.map((school) => (
          <div
            key={school.school_id}
            className="menu-item"
            style={{
              display: "flex",
              // alignItems: "center",
              margin: "6px 0px",
              borderRadius:'5px',
              padding:'5px',
              justifyContent:'center',
              backgroundColor: school.school_id === selectedSchoolId ? "#E3F2FD" : "transparent",
            }}
            onClick={() => handleSchoolChange(school.school_id)}
          >
            <i className="fas fa-school mt-2" style={{ marginRight: "8px", color: "#000"}}></i>
            <span
              style={{
                fontFamily: "Manrope",
                fontSize: "14px",
                color: school.school_id === selectedSchoolId ? "blue" : "black",
                cursor: "pointer",
              }}
            >
              {school.school_name} {school.school_id === selectedSchoolId && "(Current)"}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export { HeaderSchoolChange };
