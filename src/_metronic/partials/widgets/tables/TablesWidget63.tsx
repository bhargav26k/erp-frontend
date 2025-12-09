import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { useNavigate } from "react-router-dom";
type Props = {
  class_id: string | null;
};

// interface FeeType {
//   fee_type_id: number;
//   fee_type_name: string;
//   amount: string;
//   due_date: string;
// }

// interface FeeGroup {
//   fee_group_id: number;
//   fee_group_name: string;
//   fee_session_group_id:string;
//   fees: FeeType[];
// }

// interface ApplicationData {
//   fee_group_id: number;
//   fee_type_id: number;
//   fee_session_group_id:string;
//   fee_group_name: string;
//   fee_type_name: string;
//   amount: string;
//   due_date: string;
//   adjustment: string;
//   is_active: string;
//   checked: boolean;
// }

interface DataItem {
  status: string;
  name: string;
}

interface FilterData {
  gr_number: string;
  session_id: number;
  class_id: string;
  father_phone: string;
  mobileno: string;
  dob: string;
  father_name: string;
  admission_no: number;
  section: string;
  student_email: string;
  student_name: string;
  id: number;
  enquiry_id: string;
  date: string;
  class: string;
  name: string;
  source: string;
  email: string;
  follow_up_date: string;
  status: string;
  enquiry_type: string;
  updated_at: string;
  student_phone: string;
}

const TablesWidget63 = ({ class_id }: Props) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const Navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<FilterData[]>([]);
  console.log(filteredData);

  const [referesh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allStudents, setAllStudents] = useState<FilterData[]>([]);
  const [editingId, setEditingId] = useState(null);
  const [draftGr, setDraftGr] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-assignstudents/${schoolId}/${class_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();

        setAllStudents(responseData); // ✅ Keep full data
        setFilteredData(responseData);
        setRefresh(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudents();
  }, [schoolId, referesh]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleActionModal = (id: number) => {
    Navigate(`/fee-collect/fee-details-master?studentId=${id}`);
  };

  const handleBack = () => {
    Navigate(-1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = query
      ? allStudents.filter((item) => {
          const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();

          return (
            fullName.includes(query) ||
            item.firstname.toLowerCase().includes(query) || // in case user only types first name
            item.lastname.toLowerCase().includes(query) || // in case user only types last name
            (item.mobileno && item.mobileno.toLowerCase().includes(query)) ||
            (item.father_name &&
              item.father_name.toLowerCase().includes(query)) ||
            (item.gr_number && item.gr_number.toLowerCase().includes(query)) // ✅ GR number search
          );
        })
      : allStudents;

    setFilteredData(filtered);
  };

  const onUpdateGrNumber = useCallback(
    async (admission_no: string, newGr: string) => {
      try {
        const res = await fetch(`${DOMAIN}/api/school/update-gr-number`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            school_id: schoolId,
            admission_no,
            gr_number: newGr,
          }),
        });

        // attempt to parse JSON body for error or success message
        const payload = await res.json();

        if (!res.ok) {
          if (res.status === 409) {
            // GR already in use
            return alert(payload.message || "This GR number is already in use");
          }
          // other errors
          throw new Error(payload.message || "Could not update GR number");
        }

        // success → update local state
        setAllStudents((prev) =>
          prev.map((it) =>
            it.admission_no === admission_no ? { ...it, gr_number: newGr } : it
          )
        );
        setFilteredData((prev) =>
          prev.map((it) =>
            it.admission_no === admission_no ? { ...it, gr_number: newGr } : it
          )
        );

        // optional success toast
        // alert("GR number updated successfully");
      } catch (err: any) {
        console.error(err);
        alert(err.message || "An unexpected error occurred");
      }
    },
    [schoolId]
  );

  // begin editing
  const startEdit = (admission_no: string, currentGr: string | null) => {
    setEditingId(admission_no);
    setDraftGr(currentGr ?? "");
  };

  // commit or cancel
  const commitEdit = (admission_no: string) => {
    const student = allStudents.find((it) => it.admission_no === admission_no);

    if (!student) return setEditingId(null);

    const existingGr = student.gr_number ?? "";

    // If no change, skip update
    if (draftGr.trim() === existingGr.trim()) {
      return setEditingId(null);
    }

    if (draftGr !== null && admission_no === editingId) {
      onUpdateGrNumber(admission_no, draftGr.trim());
    }

    setEditingId(null);
  };

  const isValidDOB = (dob) => {
    if (!dob) return false;

    const invalidDobValues = [
      "0000-00-00",
      "0000-00-00T00:00:00.000Z",
      "1899-11-30T00:00:00.000Z",
      "1899-11-29T18:38:50.000Z", // seen in your logs
      "1899-12-31T00:00:00.000Z",
    ];

    return !invalidDobValues.includes(dob);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "#F2F6FF",
        borderRadius: "15px",
        padding: "10px",
      }}
    >
      <div
        className="modal-header pb-2"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
          fontFamily: "Manrope",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            className="btn btn-md btn-icon btn-active-color-primary"
            onClick={handleBack}
          >
            <i className="fas fa-arrow-left"></i>
          </div>
          <h2>Collect Fees</h2>
        </div>
        <div
          className="input-group flex-nowrap"
          style={{
            width: "380px",
            height: "36px",
            borderRadius: "8px",
            border: "1px solid #1F4061",
          }}
        >
          <span
            className="input-group-text border-0 pe-1 pr-0"
            style={{ backgroundColor: "transparent" }}
            id="addon-wrapping"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_582_4295)">
                <circle
                  cx="8.50002"
                  cy="7.66665"
                  r="6.33333"
                  stroke="#1F4061"
                  stroke-width="1.5"
                />
                <path
                  d="M14.1667 13.3333L15.5 14.6666"
                  stroke="#1F4061"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_582_4295">
                  <rect
                    width="16"
                    height="16"
                    fill="#1F4061"
                    transform="translate(0.833374)"
                  />
                </clipPath>
              </defs>
            </svg>
          </span>
          <input
            type="text"
            style={{
              backgroundColor: "transparent",
              color: "#1C335C",
            }}
            className="form-control border-0"
            placeholder="Search Student Name ...."
            aria-label="Search"
            aria-describedby="addon-wrapping"
            onChange={handleSearch}
            value={searchQuery}
          />
        </div>
      </div>
      <div
        style={{
          height: "670px", // Fixed height for the table container
          overflowY: "auto", // Enable vertical scrolling
          padding: "16px 0", // Optional: adds some padding around the table
        }}
      >
        <table
          className="table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
            backgroundColor: "#FFFFFF", // White background for the table
            borderRadius: "12px", // Round corners for the table
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)", // Light shadow for the table
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "rgb(242, 246, 255)", // Header background color
                borderBottom: "1px solid #E0E4F0",
                fontFamily: "Manrope",
                fontWeight: "600",
                color: "#1C335C",
                fontSize: "14px",
              }}
            >
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Admission No.
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                GR. No.
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Student Name
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                {schoolId === "AMO-2509097151" ? "Group" : "Class"}
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "center",
                }}
              >
                {schoolId === "AMO-2509097151" ? "Batch" : "Section"}
              </th>

              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "center",
                }}
              >
                Father Name
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "center",
                }}
              >
                Date Of Birth
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "center",
                }}
              >
                Student / Father Number
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "end",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                    borderBottom: "1px solid #E0E4F0",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    color: "#1C335C",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {item.admission_no}
                  </td>
                  <td
                    style={{ padding: "12px 20px", cursor: "pointer" }}
                    onDoubleClick={() =>
                      startEdit(item.admission_no, item.gr_number)
                    }
                  >
                    {editingId === item.admission_no ? (
                      <input
                        type="text"
                        value={draftGr}
                        autoFocus
                        onChange={(e) =>
                          setDraftGr(e.target.value, item.gr_number)
                        }
                        onBlur={() => commitEdit(item.admission_no)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            commitEdit(item.admission_no);
                          } else if (e.key === "Escape") {
                            setEditingId(null);
                          }
                        }}
                        style={{ width: "100%" }}
                      />
                    ) : (
                      item.gr_number || "NA"
                    )}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {item.firstname + " " + item.lastname}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {item.class}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                      textAlign: "center",
                    }}
                  >
                    {item.section}
                  </td>

                  <td
                    style={{
                      padding: "12px 20px",
                      textAlign: "center",
                    }}
                  >
                    {item.father_name}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                      textAlign: "center",
                    }}
                  >
                    {isValidDOB(item.dob) ? formatDate(item.dob) : ""}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                      textAlign: "center",
                    }}
                  >
                    {item.mobileno + " / " + item.father_phone}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      gap: "10px", // Adds space between the buttons
                      justifyContent: "end", // Aligns buttons horizontally in the center
                      alignItems: "center", // Vertically centers the buttons
                      padding: "12px 20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 12px",
                        backgroundColor: "#1C335C",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#16294D")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1C335C")
                      }
                      onClick={() => handleActionModal(item.admission_no)}
                    >
                      <span
                        style={{
                          marginRight: "8px",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "700",
                          fontFamily: "Manrope",
                        }}
                      >
                        Collect Fees
                      </span>
                    </div>
                    {/* <button
                type="button"
                className="btn"
                style={{
                  border: "1px solid #1F3259",
                  fontFamily: "Manrope",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#1F3259",
                }}
                // onClick={() => handleActionModal(fee_group_id)}
              >
                Send Payment Link
              </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8} // Adjust this number to match the number of columns in your table
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    color: "#1C335C",
                  }}
                >
                  No students in the class.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={12}
                style={{
                  padding: "12px 20px",
                  textAlign: "right",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#1C335C",
                }}
              >
                Total Items: {filteredData.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export { TablesWidget63 };
