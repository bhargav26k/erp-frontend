import { useState, useEffect } from "react";
import { getPropertyPartById, updatePropertyPart } from "../core/_requests";
import { staticPropertyPartDetails } from "../staticPropertyPartDetails";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyPartId: number;
}

const ViewDetailsModal: React.FC<ModalProps> = ({ isOpen, onClose, propertyPartId }) => {
    const [loading, setLoading] = useState(false);
    const [propertyName, setPropertyName] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [propertyPartName, setPropertyPartName] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Available");
    const [error, setError] = useState("");

    // ADD state for all new fields
     const [propertyArea, setPropertyArea] = useState("");
     const [ageOfProperty, setAgeOfProperty] = useState("");
     const [locationArea, setLocationArea] = useState("");
     const [floorNumber, setFloorNumber] = useState("");
     const [readyReckonerRate, setReadyReckonerRate] = useState(0);
     const [depreciation, setDepreciation] = useState(0);
     const [netRate, setNetRate] = useState(0);
     const [finalUnitValuation, setFinalUnitValuation] = useState(0);
     const [rentRate, setRentRate] = useState(0);

    useEffect(() => {
        if (propertyPartId) {
            fetchPropertyPart();
        }
    }, [propertyPartId]);

    const fetchPropertyPart = async () => {
        try {
            setLoading(true);
            const data = await getPropertyPartById(propertyPartId);
            console.log("Part details", data.property);
            setPropertyPartName(data.part_name);
            setPropertyName(data.property.name);
            setOrganizationName(data.property.organization_name);
            setStatus(data.status);
            setLocation(data.property.location);
            // Grab the static details from our map (same as in the page above)
            const staticInfo = staticPropertyPartDetails[data.id];
            setPropertyArea(staticInfo?.propertyArea || "N/A");
            setAgeOfProperty(staticInfo?.ageOfProperty || "N/A");
            setLocationArea(staticInfo?.locationArea || "N/A");
            setFloorNumber(staticInfo?.floorNumber || "N/A");
            setReadyReckonerRate(staticInfo?.readyReckonerRate ?? 0);
            setDepreciation(staticInfo?.depreciation ?? 0);
            setNetRate(staticInfo?.netRate ?? 0);
            setFinalUnitValuation(staticInfo?.finalUnitValuation ?? 0);
            setRentRate(staticInfo?.rentRate ?? 0);
        } catch (err) {
            setError("Failed to fetch property part.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        fetchPropertyPart();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[30rem]">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={handleClose}>
                    ✖
                </button>

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Unit Details</h2>

                <div className="space-y-5 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-500">Organization Name</label>
                            <div className="text-base font-medium text-gray-800 border-b pb-1">
                                {organizationName}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500">Property Name</label>
                            <div className="text-base font-medium text-gray-800 border-b pb-1">
                                {propertyName}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-500">Property Part Name</label>
                            <div className="text-base font-medium text-gray-800 border-b pb-1">
                                {propertyPartName}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500">Location</label>
                            <div className="text-base font-medium text-gray-800 border-b pb-1">
                                {propertyPartName + ", " + location}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Status of the Unit</label>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${status === "Available"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        //     <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
        //         <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={handleClose}>
        //             ✖
        //         </button>

        //         <h2 className="text-xl font-semibold mb-4 border-b pb-4">Unit Details</h2>

        //         <div className="grid grid-cols-2 gap-4">
        //             <div>
        //                 <label className="block text-sm text-gray-500">Property Name</label>
        //                 <div className="text-base font-medium text-gray-800 border-b pb-1">
        //                     {propertyName}
        //                 </div>
        //             </div>
        //             <div>
        //                 <label className="block text-sm text-gray-500">Location</label>
        //                 <div className="text-base font-medium text-gray-800 border-b pb-1">
        //                     {location}
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="grid grid-cols-2 gap-4">
        //             <div>
        //                 <label className="block text-sm text-gray-500">Property Part Name</label>
        //                 <div className="text-base font-medium text-gray-800 border-b pb-1">
        //                     {propertyPartName}
        //                 </div>
        //             </div>
        //             <div>
        //                 <label className="block text-sm text-gray-500">Location</label>
        //                 <div className="text-base font-medium text-gray-800 border-b pb-1">
        //                     {propertyPartName + ", " + location}
        //                 </div>
        //             </div>
        //         </div>


        //         {/* Status */}
        // <div>
        //     <label className="block text-sm text-gray-500 mb-1">Status of the Unit</label>
        //     <span
        //         className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${status === "Available"
        //             ? "bg-green-100 text-green-700"
        //             : "bg-yellow-100 text-yellow-700"
        //             }`}
        //     >
        //         {status}
        //     </span>
        // </div>
        //     </div>
        // </div>
    );
};

export default ViewDetailsModal;
