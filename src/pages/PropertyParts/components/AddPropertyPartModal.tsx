// src/PropertyParts/components/AddPropertyPartModal.tsx

import { useEffect, useState } from "react";
import { createPropertyPart } from "../core/_requests";
import { Property } from "../../Properties/core/_models";
import { getAllProperties } from "../../Properties/core/_requests";
import { toast } from "react-toastify";

// Import the static‐data map so we can write to it
import { StaticDetails, staticPropertyPartDetails } from "../staticPropertyPartDetails";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyPartAdded: () => void;
}

const AddPropertyPartModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onPropertyPartAdded,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyId, setPropertyId] = useState<number>(0);
  const [unitName, setUnitName] = useState(""); // “Property Number”
  const [selectedStatus, setSelectedStatus] = useState("Available");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // — New state for all nine static fields —
  const [propertyArea, setPropertyArea] = useState(""); // e.g. "1200 sq ft"
  const [ageOfProperty, setAgeOfProperty] = useState(""); // e.g. "5 yrs"
  const [locationArea, setLocationArea] = useState<"FrontSide" | "InnerSide">("FrontSide");
  const [floorNumber, setFloorNumber] = useState(""); // e.g. "Ground" or "1"
  const [readyReckonerRate, setReadyReckonerRate] = useState<number>(0);
  const [depreciation, setDepreciation] = useState<number>(0);
  const [netRate, setNetRate] = useState<number>(0);
  const [finalUnitValuation, setFinalUnitValuation] = useState<number>(0);
  const [rentRate, setRentRate] = useState<number>(0);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await getAllProperties();
      // Filter properties where splitable is true
      const splitableProperties = data.filter(
        (property: any) => property.splitable === true
      );
      setProperties(splitableProperties);
    } catch (err) {
      setError("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // basic validation
    if (!propertyId || !unitName) {
      setError("Please fill all required fields");
      return;
    }
    // (Optional) you could also validate each static field here

    setLoading(true);
    setError("");

    try {
      // 1. Create the part in backend
      //    We only send property_id, part_name, status.
      const response = await createPropertyPart({
        property_id: propertyId,
        part_name: unitName,
        status: selectedStatus,
      });

      // Assume `response` includes the newly created part, e.g. { id: 123, ... }
      const newId: number = response.id;

      // 2. Write our nine static fields into the in‐memory map.
      //    This ensures that next time we fetch (or immediately after),
      //    the table renderer picks up these values.
      staticPropertyPartDetails[newId] = {
        propertyArea,
        ageOfProperty,
        locationArea,
        floorNumber,
        readyReckonerRate,
        depreciation,
        netRate,
        finalUnitValuation,
        rentRate,
      };

      toast.success("Property Part created successfully!");

      // 3. Tell the parent to re‐fetch & close modal
      onPropertyPartAdded();

      // 4. Reset form state
      setPropertyId(0);
      setUnitName("");
      setSelectedStatus("Available");
      setPropertyArea("");
      setAgeOfProperty("");
      setLocationArea("FrontSide");
      setFloorNumber("");
      setReadyReckonerRate(0);
      setDepreciation(0);
      setNetRate(0);
      setFinalUnitValuation(0);
      setRentRate(0);
      onClose();
    } catch (err) {
      console.error("Error creating property part:", err);
      setError("Failed to create property part");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPropertyId(0);
    setUnitName("");
    setSelectedStatus("Available");
    setPropertyArea("");
    setAgeOfProperty("");
    setLocationArea("FrontSide");
    setFloorNumber("");
    setReadyReckonerRate(0);
    setDepreciation(0);
    setNetRate(0);
    setFinalUnitValuation(0);
    setRentRate(0);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-96 max-h-[90vh] overflow-auto">
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

        <h2 className="text-xl font-semibold mb-4 border-b pb-4">
          Add Property Number
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Property Selector */}
        <label className="text-slate-900 text-md block mb-1">Property Name</label>
        <select
          value={propertyId}
          onChange={(e) => setPropertyId(Number(e.target.value))}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        >
          <option value={0}>Select a property</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>

        {/* Property Number (part_name) */}
        <label className="text-slate-900 text-md block mb-1">Property Number</label>
        <input
          type="text"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        />

        {/* Status Radio Buttons */}
        <label className="text-slate-700 block mb-2">Status of the unit</label>
        <div className="flex space-x-2 mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="status"
              value="Available"
              checked={selectedStatus === "Available"}
              onChange={() => setSelectedStatus("Available")}
              className="hidden"
            />
            <span
              className={`px-4 py-1 text-sm rounded-full ${
                selectedStatus === "Available"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {selectedStatus === "Available" && "✔ "} Available
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="status"
              value="Rented"
              checked={selectedStatus === "Rented"}
              onChange={() => setSelectedStatus("Rented")}
              className="hidden"
            />
            <span
              className={`px-4 py-1 text-sm rounded-full ${
                selectedStatus === "Rented"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {selectedStatus === "Rented" && "✔ "} Rented
            </span>
          </label>
        </div>

        {/* ——— Begin Static Fields ——— */}

        <label className="text-slate-900 text-md block mb-1">
          Property Area (e.g., “1200 sq ft”)
        </label>
        <input
          type="text"
          value={propertyArea}
          onChange={(e) => setPropertyArea(e.target.value)}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        />

        <label className="text-slate-900 text-md block mb-1">
          Age of Property (e.g., “5 yrs”)
        </label>
        <input
          type="text"
          value={ageOfProperty}
          onChange={(e) => setAgeOfProperty(e.target.value)}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        />

        <label className="text-slate-900 text-md block mb-1">Location Area</label>
        <select
          value={locationArea}
          onChange={(e) => setLocationArea(e.target.value as "FrontSide" | "InnerSide")}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        >
          <option value="FrontSide">FrontSide</option>
          <option value="InnerSide">InnerSide</option>
        </select>

        <label className="text-slate-900 text-md block mb-1">Floor Number</label>
        <input
          type="text"
          value={floorNumber}
          onChange={(e) => setFloorNumber(e.target.value)}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        />

        <label className="text-slate-900 text-md block mb-1">
          Ready Reckoner Rate (₹)
        </label>
        <input
          type="number"
          value={readyReckonerRate}
          onChange={(e) => setReadyReckonerRate(Number(e.target.value))}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        />

        <label className="text-slate-900 text-md block mb-1">Depreciation (₹)</label>
        <input
          type="number"
          value={depreciation}
          onChange={(e) => setDepreciation(Number(e.target.value))}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        />

        <label className="text-slate-900 text-md block mb-1">Net Rate (₹)</label>
        <input
          type="number"
          value={netRate}
          onChange={(e) => setNetRate(Number(e.target.value))}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        />

        <label className="text-slate-900 text-md block mb-1">
          Final Unit Valuation (₹)
        </label>
        <input
          type="number"
          value={finalUnitValuation}
          onChange={(e) => setFinalUnitValuation(Number(e.target.value))}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        />

        <label className="text-slate-900 text-md block mb-1">Rent Rate of Unit (₹)</label>
        <input
          type="number"
          value={rentRate}
          onChange={(e) => setRentRate(Number(e.target.value))}
          className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
        />

        {/* ——— End Static Fields ——— */}

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

export default AddPropertyPartModal;
