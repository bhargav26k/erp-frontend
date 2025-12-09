import { FC, useState, useEffect } from "react";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import {
  changeMasterSchoolUser,
  getSchoolMasterBySchoolId,
  changeSchoolUser,
  getSchoolBySchoolId,
} from "../../../../app/modules/auth/core/_requests";
import * as authHelper from "../../../../app/modules/auth/core/AuthHelpers";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface HeaderSessionChangeProps {
  setSessionName: (name: string) => void;
}

const HeaderSessionChange: FC<HeaderSessionChangeProps> = ({
  setSessionName,
}) => {
  const { currentUser, saveAuth, setCurrentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(0);
  const [loading, setLoading] = useState(false);
  const school_id = currentUser?.school_id;
  const userId = currentUser?.id;
  const userEmail = currentUser?.email;
  

  // Fetch the sessions for the user (School Master)
  useEffect(() => {
    const fetchSchools = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-session/${school_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch school names");
        const data = await response.json();
        setSessions(data);
        setSelectedSessionId(currentUser?.session_id);
      } catch (error) {
        console.error("Error fetching school names:", error);
      }
    };
    fetchSchools();
  }, [userId, school_id]);

  const handleSessionChange = async (sessionId: number) => {
    if (sessionId === selectedSessionId || !currentUser) return;

    setLoading(true);
    setSelectedSessionId(sessionId);
    const previousAuth = { ...authHelper.getAuth() };
    const previousUser = { ...currentUser };

    try {
      if (userEmail && userId && sessionId && school_id) {
        // Check if currentUser's role_id is 6 to determine which functions to use
        if (currentUser.role_id === 6) {
          // Call the "Master" functions
          const { data: authData } = await changeMasterSchoolUser(
            userEmail,
            school_id,
            sessionId
          );

          if (authData) {
            saveAuth(authData); // Update local storage with new auth data
            const { data: user } = await getSchoolMasterBySchoolId(
              userId,
              school_id,
              sessionId
            );
             toast.info(<span style={{ fontWeight: '500', fontFamily:'Manrope', fontSize:'15px' }}>You are working in the session:<span style={{fontWeight:'700'}}> {user.data?.[0].session_name}</span> now!!!</span>, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                style: {
                  backgroundColor: '#1C335C', // Custom background color
                  color: '#ffffff', // Text color
                },
              });
            
            setCurrentUser(user.data?.[0]); // Update current user details in state
          }
        } else {
          // Call the standard functions
          const { data: authData } = await changeSchoolUser(
            userEmail,
            school_id,
            sessionId
          );

          if (authData) {
            saveAuth(authData); // Update local storage with new auth data
            const { data: user } = await getSchoolBySchoolId(
              userId,
              school_id,
              sessionId
            );
            toast.info(<span style={{ fontWeight: '500', fontFamily:'Manrope', fontSize:'15px' }}>You are working in the session:<span style={{fontWeight:'700'}}> {user.data?.[0].session_name}</span> now!!!</span>, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
              style: {
                backgroundColor: '#1C335C', // Custom background color
                color: '#ffffff', // Text color
              },
            });
            setCurrentUser(user.data?.[0]); // Update current user details in state
          }
        }
      }
    } catch (error) {
      console.error("Error changing school:", error);
      setSelectedSessionId(previousAuth.session_id); // Revert to previous session selection
      saveAuth(previousAuth); // Revert auth data
      setCurrentUser(previousUser); // Revert current user data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const selectedSession = sessions.find(
      (session) => session.id === selectedSessionId
    );
    if (selectedSession) {
      setSessionName(selectedSession.session); // Update the displayed session name
    } else {
      setSessionName("no sessions");
    }
  }, [selectedSessionId, sessions, setSessionName]); // Add dependencies

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded-12 w-200px"
      data-kt-menu="true"
      style={{ padding: "10px 0px 10px 20px" }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "10px" }}>Loading...</div>
      ) : (
        sessions.map((session) => (
          <div
            key={session.id}
            className="menu-item"
            style={{
              display: "flex",
              alignItems: "center",
              margin: "6px 0px",
              backgroundColor:
                session.id === selectedSessionId ? "#E3F2FD" : "transparent",
            }}
            onClick={() => handleSessionChange(session.id)}
          >
            <i
              className="fas fa-session"
              style={{ marginRight: "8px", color: "#000" }}
            ></i>
            <span
              style={{
                fontFamily: "Manrope",
                fontSize: "14px",
                color: session.id === selectedSessionId ? "blue" : "black",
                cursor: "pointer",
              }}
            >
              {session.session} {session.is_active === "yes" && "(Current)"}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export { HeaderSessionChange };
