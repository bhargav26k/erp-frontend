// import { FC, useEffect, useState } from "react";
// import { useAuth } from "../../../../app/modules/auth";
// import DOMPurify from 'dompurify';

// import { CardsWidget23 } from "../_new/cards/CardsWidget23";

// type Props = {
//   className: string;
// };

// const TablesWidget20: FC<Props> = ({ className }) => {
//   const { currentUser } = useAuth();
//   const [tableData, setTableData] = useState([]);
//   const [showCreateAppModal, setShowCreateAppModal] = useState(false);

//   function lowercaseExceptFirst(inputString: string | undefined) {
//     if (typeof inputString !== "string" || inputString.length === 0) {
//       return inputString;
//     }
//     return (
//       inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
//     );
//   }
//   const formattedFirstName = lowercaseExceptFirst(currentUser?.firstname);

//   const handleModalClose = () => {
//     setShowCreateAppModal(false);
//   };
//   const handlePrimaryButtonClick = () => {
//     setShowCreateAppModal(true);
//     console.log("clicked");
//   };

//   useEffect(() => {
//     // Function to fetch data from the API
//     const fetchData = async () => {
//       try {
//         const session_id = currentUser?.student_session_id;
//         console.log(session_id);
//         // Assuming currentUser contains the session_id
//         const response = await fetch(
//           "https://erp.innoveraschool.com/site/get_homeworklist",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               // Add any other necessary headers
//             },
//             body: JSON.stringify({
//               class_id: 1,
//               section_id: 1,
//               student_id: 930,
//               start_date: "",
//               end_date: "",
//             }),
//           }
//         );

//         const data = await response.json();
//         console.log(data);

//         setTableData(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     // Call the fetchData function
//     fetchData();
//   }, [currentUser]);

  

//   const DescriptionComponent = ({ description }) => {
//     const sanitizedHTML = DOMPurify.sanitize(description);
  
//     return (
//       <tbody dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
//     );
//   };

//   return (
//     <div className={`card ${className}`} style={{ height: "475px" }}>
//       <div className="card-body py-3 d-flex justify-content-between">
//         <div className="table-responsive">
//         {tableData.map((item) => (
//             <DescriptionComponent key={item.id} description={item.description} />
//           ))}
//         </div>
//         <div>
//           <CardsWidget23 className="h-md-75 mb-5 mb-xl-10" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export { TablesWidget20 };
