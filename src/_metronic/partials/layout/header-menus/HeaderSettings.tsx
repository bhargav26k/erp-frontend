import { FC } from "react";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { useNavigate } from "react-router-dom";


const HeaderSettings: FC = () => {
  const { currentUser } = useAuth();
  const Navigate = useNavigate();

  const handleLogout = ()=>{
    Navigate('/logout')
  }
  return (
    <>
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded-12 w-200px"
        data-kt-menu="true"
        style={{ padding: '15px'}}
        onMouseOver={(e) => (
          (e.currentTarget.style.backgroundColor = "white"),
          (e.currentTarget.style.cursor = "pointer"),
          (e.currentTarget.style.borderRadius = "5px")
        )}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FFF")}
      >
        <div className="menu-item" style={{ display: 'flex', alignItems: 'center', borderBottom:'1px solid lightgray'}}>
          <a
            href="#"
            onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#1F4061")}
            style={{ fontFamily: "Manrope", fontSize: "15px", color:'#1F4061',fontWeight:'600' }}
          >
            {currentUser?.name}
          </a>
        </div>
        <div className="menu-item mt-3" 
        style={{ display: 'flex', alignItems: 'center', width:'100%', padding:'5px', borderRadius:'5px'}}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "lightGray")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        
        >
          <i className="fas fa-user" style={{ marginRight: '8px', color:'#1F4061', fontSize:'18px' }}></i>
          <a
            onClick={()=>Navigate('/user-profile')}
            // onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
            // onMouseOut={(e) => (e.currentTarget.style.color = "black")}
            style={{ fontFamily: "Manrope", fontSize: "15px", color:'#1F4061',fontWeight:'500' }}
          >
            Profile
          </a>
        </div>
        <div className="menu-item mt-1"  style={{ display: 'flex', alignItems: 'center', width:'100%', padding:'5px', borderRadius:'5px'}}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "lightGray")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <i className="fas fa-cog" style={{ marginRight: '8px', color:'#1F4061', fontSize:'18px' }}></i>
          <a
            onClick={()=>Navigate('/user-account')}
           
            style={{ fontFamily: "Manrope", fontSize: "15px", color:'#1F4061',fontWeight:'500' }}
          >
            Account
          </a>
        </div>
        <div className="menu-item mt-1"  style={{ display: 'flex', alignItems: 'center', width:'100%', padding:'5px', borderRadius:'5px'}}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "lightGray")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <i className="fas fa-question-circle" style={{ marginRight: '8px', color:'#1F4061', fontSize:'18px' }}></i>
          <a
            onClick={()=>Navigate('/user-support')}
           
            style={{ fontFamily: "Manrope", fontSize: "15px", color:'#1F4061',fontWeight:'500' }}
          >
            Support
          </a>
        </div>
        <div className="menu-item mt-1"  style={{ display: 'flex', alignItems: 'center', width:'100%', padding:'5px', borderRadius:'5px'}}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "lightGray")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <i className="fas fa-shield-halved" style={{ marginRight: '8px', color:'#1F4061', fontSize:'18px' }}></i>
          <a
            onClick={()=>Navigate('/privacy-policy')}
           
            style={{ fontFamily: "Manrope", fontSize: "15px", color:'#1F4061',fontWeight:'500' }}
          >
            Privacy Policy
          </a>
        </div>
        <div className="menu-item mt-1"  style={{ display: 'flex', alignItems: 'center', width:'100%', padding:'5px', borderRadius:'5px'}}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "lightGray")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <i className="fas fa-sign-out-alt" style={{ marginRight: '8px', color:'#1F4061', fontSize:'18px' }}></i>
          <a
            onClick={handleLogout}
           
            style={{ fontFamily: "Manrope", fontSize: "15px", color:'#1F4061',fontWeight:'500', cursor: 'pointer' }}
          >
            Sign Out
          </a>
        </div>
      </div>
    </>
  );
};

export { HeaderSettings };