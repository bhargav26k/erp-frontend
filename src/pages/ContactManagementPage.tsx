import React, { FC, useState } from 'react';

const ContactManagementPage: FC = () => {
    // Hardcoded settlement data
    const data: any[] = [
        {
            srNo: '1',
            disputeID: 'DASD4234',
            submittedDate: '25 May, 2024',
            disputeStatus: 'Resolved',
        }
    ]
    const [currentPage, setCurrentPage] = useState(1);
    const [isRaiseDisputeModalOpen, setIsRaiseDisputeModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [otherReason, setOtherReason] = useState<string>("");
    const [location, setLocation] = useState("");
    const [query, setQuery] = useState("");
    //Pagination logic
    const itemsPerPage = 10;

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const currentItems = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const statusColors: Record<string, string> = {
        InReview: "bg-yellow-100 text-yellow-700",
        Resolved: "bg-green-100 text-green-700",
    };

    const disputeReasons = [
        { id: "overpayment", label: "Overpayment" },
        { id: "underpayment", label: "Underpayment" },
        { id: "duplicate", label: "Duplicate Payment" },
        { id: "incorrect_amount", label: "Incorrect Amount" },
        { id: "service_not_received", label: "Service Not Received" },
        { id: "payment_not_applied", label: "Payment Not Applied" },
        { id: "others", label: "Other (Specify in Comments)" },
    ];

    return (
        <>
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">Contact Management</h2>
                    <div className='mb-3 px-6 flex justify-between'>
                        <div className="relative w-full max-w-xs">
                            {/* Search Icon (SVG) */}
                            <svg
                                className="absolute left-3 top-2.5 text-gray-500 w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                                ></path>
                            </svg>

                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className='flex space-x-2'>
                            <button className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:border hover:border-blue-800 hover:text-blue-800 transition">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 15V3M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 15V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Export
                            </button>
                            <button
                                onClick={() => setIsRaiseDisputeModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg> Contact
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className='bg-blue-50 shadow-inner '>
                                <tr className="text-left text-slate-600 text-[0.8rem] border-b border-slate-100 tracking-wide">
                                    {/* <th className="ps-6 font-normal">TENANT</th> */}
                                    <th className="ps-6 font-normal">CONTACT ID</th>
                                    <th className="p-3 font-normal">SUBMITTED DATE</th>
                                    <th className="p-3 font-normal"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((data, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-gray-50">
                                        {/* <td className="p-6 font-medium text-slate-600">{data.tenantName}<div className='text-sm font-light'>{data.tenantEmail}</div></td> */}
                                        <td className="ps-6 font-medium text-slate-600">{data.disputeID}</td>
                                        <td className="p-3 text-slate-600 font-light">{data.submittedDate}</td>
                                        {/* <td className="px-3 py-4 text-slate-600 font-normal cursor-pointer">
                                            <span className={`${statusColors[data.disputeStatus]} px-3 py-1 text-sm rounded-full`}
                                            // onClick={() => openStatusModal(data.disputeStatus, data.id)}
                                            >{data.disputeStatus}</span>
                                        </td> */}
                                        <td className="p-3">

                                            <button className="relative group text-slate-600 font-light flex items-center">
                                                <svg
                                                    width="30px"
                                                    height="30px"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    stroke="#27880c"
                                                >
                                                    <path
                                                        d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                                                        stroke="#27880c"
                                                        strokeWidth="0.816"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                                                        stroke="#27880c"
                                                        strokeWidth="0.816"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                {/* Tooltip */}
                                                <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                                                    View Contact Details
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="flex justify-end items-center space-x-2 mt-4 mr-6 mb-2">
                            <button
                                className="px-3 py-1 border rounded-full disabled:opacity-50"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-1 border rounded-full ${currentPage === index + 1 ? "bg-blue-500 text-white" : ""}`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                className="px-3 py-1 border rounded-full disabled:opacity-50"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Modal */}
                    {isRaiseDisputeModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                                {/* Close Icon */}
                                <button
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={() => setIsRaiseDisputeModalOpen(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Contact Management</h2>
                                <label className='text-slate-900 text-md block mb-1'>Reason For Dispute</label>
                                <select
                                    value={selectedReason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                >
                                    <option value="">Select a reason</option>
                                    {disputeReasons.map((reason) => (
                                        <option key={reason.id} value={reason.id}>
                                            {reason.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Show text input if "Other" is selected */}
                                {selectedReason === "others" && (
                                    <div className="mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Specify Your Reason</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your reason..."
                                            value={otherReason}
                                            onChange={(e) => setOtherReason(e.target.value)}
                                        />
                                    </div>
                                )}
                                <label className='text-slate-900 text-md block mb-1'>Unit Name</label>
                                <input
                                    type="text"
                                    // placeholder="Unit Name"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-2 py-1 mb-1 border-slate-300 rounded-lg"
                                />
                                <label className='text-slate-900 text-md block mb-1'>Property Name</label>
                                <input
                                    type="text"
                                    // placeholder="Unit Name"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-2 py-1 mb-1 border-slate-300 rounded-lg"
                                />
                                <label className='text-slate-900 text-md block mb-1'>Tenant Name</label>
                                <input
                                    type="text"
                                    // placeholder="Unit Name"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-2 py-1 mb-1 border-slate-300 rounded-lg"
                                />
                                <label className='text-slate-900 text-md block mb-1'>Additional Comments (Optional)</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Provide more details about your issue..."
                                />
                                <div className="flex justify-end mt-2">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </>
    );
};


export default ContactManagementPage;
