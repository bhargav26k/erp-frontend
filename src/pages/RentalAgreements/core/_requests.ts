import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL =  `http://localhost:3007`;
const CONTRACTS_URL = `${API_URL}/api/contracts/`;
const TENANT_URL = `${API_URL}/api/tenants/`;

// Get all contracts
export const getAllContracts = async () => {
  try {
    const response = await axios.get(CONTRACTS_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching contracts", error);
    throw error;
  }
};
export const getAllActiveContracts = async () => {
  try {
    const response = await axios.get(CONTRACTS_URL, {
      params: {
        isActive: true,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contracts", error);
    throw error;
  }
};
export const getAllExpiredContracts = async () => {
  try {
    const response = await axios.get(CONTRACTS_URL, {
      params: {
        isActive: false,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contracts", error);
    throw error;
  }
};
export const getContractById = async (id: number) => {
  try {
    const response = await axios.get(CONTRACTS_URL + id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contract with ID ${id}`);
    throw error;
  }
}

export const getTenantById = async (id: number) => {
  try {
    const response = await axios.get(TENANT_URL + id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tenant with ID ${id}`);
    throw error;
  }
}

// Create a new contract
export const createContract = async (data: {
  property_id: number;
  property_name: string;
  property_part_id?: number;
  property_part_name: string;
  rent_amount: number;
  start_date: Date;
  end_date: Date;
  tds_applicable: boolean;
  organization_id: number;
  organization_name: string;
}) => {
  try {
    // Clone the data to avoid modifying the original
    const formattedData = { ...data };

    // Format dates to YYYY-MM-DD strings
    if (data.start_date instanceof Date) {
      const d = data.start_date;
      // @ts-ignore - We're intentionally converting Date to string
      formattedData.start_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    if (data.end_date instanceof Date) {
      const d = data.end_date;
      // @ts-ignore - We're intentionally converting Date to string
      formattedData.end_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    // Use the formatted data in the request
    const response = await axios.post(CONTRACTS_URL, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error creating contract", error);
    throw error;
  }
};

// Update a contract
export const updateContract = async (id: number, data: {
  tenant_id?: number;
  property_id?: number;
  property_part_id?: number;
  rent_amount?: number;
  start_date?: Date;
  end_date?: Date;
  tds_applicable?: boolean;
  property_name?: string;
  property_part_name?: string;
  organization_id?: number;
  organization_name?: string;
}) => {
  try {
    const response = await axios.put(CONTRACTS_URL + id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating contract with ID ${id}`, error);
    throw error;
  }
};

export const updateContractStatus = async (id: number, data: {
  isActive?: boolean;
}) => {
  try {
    const response = await axios.put(CONTRACTS_URL + id + "/status/", data);
    return response.data;
  } catch (error) {
    console.error(`Error updating contract status with ID ${id}`, error);
    throw error;
  }
};

