import { useEffect, useState } from "react";
import { createContract } from "../core/_requests";
import DatePicker from "react-datepicker";
import { Property } from "../../Properties/core/_models";
import { Unit } from "../../PropertyParts/core/_models";
import { getAllProperties } from "../../Properties/core/_requests";
import { getPropertyPartByPropertyId } from "../../Tenant/core/_requests";
import { toast } from "react-toastify";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContractAdded: () => void;
}

const AddRentalAgreementModal: React.FC<ModalProps> = ({ isOpen, onClose, onContractAdded }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyParts, setPropertyParts] = useState<Unit[]>([]);
    const [rentAmount, setRentAmount] = useState<string>("");
    const [rentError, setRentError] = useState('');
    const [tdsApplicable, setTdsApplicable] = useState<boolean>(true);
    const [contractStartDate, setContractStartDate] = useState<Date | null>(null);
    const [contractEndDate, setContractEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dateError, setDateError] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState<{ id: number; name: string }>({ id: 0, name: "" });
    const [selectedTenant, setSelectedTenant] = useState<{ id: number; name: string }>({ id: 0, name: "" });
    const [selectedProperty, setSelectedProperty] = useState<{ id: number; name: string }>({ id: 0, name: "" });
    const [selectedPropertyPart, setSelectedPropertyPart] = useState<{ id: number; name: string }>({ id: 0, name: "" });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const data = await getAllProperties();
            setProperties(data);
        } catch (err) {
            setError("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }
    const fetchPropertyPartsByProperty = async (propertyId: number) => {
        try {
            console.log("selected property id : " + propertyId)
            const data = await getPropertyPartByPropertyId(propertyId);
            console.log("Property parts by property : " + data)
            setPropertyParts(data);
        } catch (err) {
            setError("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            const startDate = new Date(contractStartDate!.toLocaleDateString());
            const endDate = new Date(contractEndDate!.toLocaleDateString());

            const response = await createContract({
                property_id: selectedProperty.id,
                property_part_id: selectedPropertyPart.id,
                rent_amount: rentAmount ? Number(rentAmount) : 0, // or handle default/fallback
                start_date: startDate,
                end_date: endDate,
                tds_applicable: tdsApplicable,
                property_name: selectedProperty.name,
                property_part_name: selectedPropertyPart.name,
                organization_id: 1,
                organization_name: "MahaRealty Group",
            });

            console.log("Contract Created:", response.data);

            toast.success("Contract created successfully!");
            // Notify parent component to refresh the table
            onContractAdded();

            // Clear form & close modal
            onClose();
        } catch (error) {
            console.error("Error creating contract:", error);
            setError("Failed to create contract");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        setRentAmount("");
        setContractStartDate(null);
        setContractEndDate(null);
        setTdsApplicable(true);
        setRentError("");
        onClose();
    }

    const handleRentChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setRentAmount(value);

        if (value === '' || parseFloat(value) <= 0) {
            setRentError('Please enter a valid rent amount greater than 0');
        } else {
            setRentError('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[50rem]">
                {/* Close Icon */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={handleClose}
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

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Add Rental Agreement</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Property Name</label>
                        <select
                            value={selectedProperty.id}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const selectedProperty = properties.find(p => p.id === selectedId);
                                if (selectedProperty) {
                                    setSelectedProperty({ id: selectedProperty.id, name: selectedProperty.name });
                                }
                                fetchPropertyPartsByProperty(selectedId)
                            }}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        >
                            <option value="0">Select a property</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id}>
                                    {property.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Property Part Name</label>
                        <select
                            value={selectedPropertyPart.id}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const selectedPropertyPart = propertyParts.find(p => p.id === selectedId);
                                if (selectedPropertyPart) {
                                    setSelectedPropertyPart({ id: selectedPropertyPart.id, name: selectedPropertyPart.part_name });
                                }
                            }}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        >
                            <option value="0">Select a property</option>
                            {propertyParts.map((part) => (
                                <option key={part.id} value={part.id}>
                                    {part.part_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Tenant Name</label>
                        <select
                            value={propertyId}
                            onChange={(e) => setPropertyId(Number(e.target.value))}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        >
                            <option value="0">Select a property</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id}>
                                    {property.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Tenant Email</label>
                        <input
                            type="text"
                            // placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                        />
                    </div>
                </div> */}
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Monthly Rent Amount</label>
                        <input
                            type="number"
                            value={rentAmount}
                            onChange={handleRentChange}
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg no-spinner"
                        />
                        {rentError && <p className="text-red-500 text-sm">{rentError}</p>}
                    </div>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>TDS Applicable?</label>
                        {/* Radio Buttons */}
                        <label className="mr-2 mb-5 cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value="Yes"
                                checked={tdsApplicable === true}
                                onChange={() => setTdsApplicable(true)}
                                className="hidden"
                            />
                            <span
                                className={`px-4 py-1 text-sm rounded-full ${tdsApplicable === true
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {tdsApplicable === true && "✔ "} Yes
                            </span>
                        </label>

                        <label className="mt-2 cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value="No"
                                checked={tdsApplicable === false}
                                onChange={() => setTdsApplicable(false)}
                                className="hidden"
                            />
                            <span
                                className={`px-4 py-1 text-sm rounded-full ${tdsApplicable === false
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {tdsApplicable === false && "✔ "} No
                            </span>
                        </label>
                    </div>
                </div>
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Contract Start Date</label>
                        <DatePicker
                            selected={contractStartDate}
                            onChange={(date) => setContractStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Contract End Date</label>
                        <DatePicker
                            selected={contractEndDate}
                            onChange={(date) => {
                                if (!contractStartDate) {
                                    setDateError('Please select a contract start date first.');
                                    return;
                                }

                                if (date && date < contractStartDate) {
                                    setDateError('Contract end date cannot be before start date.');
                                    return;
                                }
                                setContractEndDate(date);
                                setDateError('');
                            }}
                            minDate={contractStartDate ? contractStartDate : undefined} // 🚫 disables dates before start  
                            dateFormat="yyyy-MM-dd"
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                        />
                    </div>
                </div>
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Upload Contract</label>
                        <input
                            type='file'
                            // value={propertyName}
                            // onChange={(e) => setPropertyName(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div className='flex-1'>
                    </div>
                </div>
                {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRentalAgreementModal;
