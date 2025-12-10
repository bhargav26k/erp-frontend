import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL =  `http://localhost:3007`;
const TENANT_URL = `${API_URL}/api/tenants/`;
const PROPERTY_PART_URL = `http://localhost:3006/api/propertypart/`;
const TENANT_MAPPING_URL = `${API_URL}/api/tenants/property-parts/`;
const TOGGLE_MAPPING_STATUS_URL = `${API_URL}/api/tenants/property-parts/`;

// Get all properties
export const getAllTenants = async () => {
  try {
    const response = await axios.get(TENANT_URL, {
      params: {
        isActive: true,
        organization_id: 1,
        includeContracts: true
      }
    });
    const tenants = response.data.map((tenant: any) => {
      const mapping = tenant.mappings[0] || {};
      const contracts = tenant.contracts[0] || {};
      return {
        id: tenant.id,
        name: tenant.name,
        contact: tenant.contact,
        email: tenant.email,
        isActive: tenant.isActive,
        organization_id: mapping.organization_id || null,
        organization_name: mapping.organization_name || "",
        property_id: mapping.property_id || null,
        property_name: mapping.property_name || "",
        property_part_id: mapping.property_part_id || null,
        property_part_name: mapping.property_part_name || "",
        rent_amount: contracts.rent_amount || null,
        contract_start_date: contracts.start_date || null,
        contract_end_date: contracts.end_date || null,
        tds_applicable: mapping.tds_applicable || false,
      };
    });

    return tenants;
  }
  catch (error) {
    console.error("Error fetching tenant", error);
    throw error;
  }
};

export const getTenantById = async (id: number) => {
  try {
    const response = await axios.get(TENANT_URL + id, {
      params: {
        includeContracts: true
      }
    });
    const tenant =  response.data;
    const mapping = tenant.mappings?.[0] || {};
    const contracts = tenant.contracts?.[0] || {};
    console.log(tenant)
    return {
      id: tenant.id,
      name: tenant.name,
      contact: tenant.contact,
      email: tenant.email,
      isActive: tenant.isActive,
      organization_id: mapping.organization_id || null,
      organization_name: mapping.organization_name || "",
      property_id: mapping.property_id || null,
      property_name: mapping.property_name || "",
      property_part_id: mapping.property_part_id || null,
      property_part_name: mapping.property_part_name || "",
      rent_amount: contracts.rent_amount || null,
      contract_start_date: contracts.start_date || null,
      contract_end_date: contracts.end_date || null,
      tds_applicable: mapping.tds_applicable || false,
    };
  } catch (error) {
    console.error(`Error fetching tenant with ID ${id}`);
    throw error;
  }
}
export const getPropertyPartByPropertyId = async (id: number) => {
  try {
    console.log("propertyid" + id)
    const response = await axios.get(PROPERTY_PART_URL , {
      params: { property_id: id }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching tenant with ID ${id}`);
    throw error;
  }
}

export const createTenant = async (data: {
  name: string;
  contact: string;
  email: string;
}) => {
  try {
    // Clone the data to avoid modifying the original
    const formattedData = { ...data };
    // Use the formatted data in the request
    const response = await axios.post(TENANT_URL, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error creating tenant", error);
    throw error;
  }
};

export const createTenantMapping = async (data: {
  tenant_id: number;
  organization_id: number;
  organization_name: string;
  property_id: number;
  property_name: string;
  property_part_id: number;
  property_part_name: string;
}) => {
  try {
    // Clone the data to avoid modifying the original
    const formattedData = { ...data };

    //  // Format dates to YYYY-MM-DD strings
    //  if (data.contract_start_date instanceof Date) {
    //      const d = data.contract_start_date;
    //      // @ts-ignore - We're intentionally converting Date to string
    //      formattedData.contract_start_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    //  }

    //  if (data.contract_end_date instanceof Date) {
    //      const d = data.contract_end_date;
    //      // @ts-ignore - We're intentionally converting Date to string
    //      formattedData.contract_end_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    //  }

    // Use the formatted data in the request
    const response = await axios.post(TENANT_MAPPING_URL, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error creating tenant", error);
    throw error;
  }
};

// Update a property
export const updateTenant = async (id: number, data: {
  name?: string;
  contact?: string;
  email?: string;
  isActive?: boolean
}) => {
  try {
    const response = await axios.put(TENANT_URL + id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating tenant with ID ${id}`, error);
    throw error;
  }
};

// Delete a tenant
// export const deleteTenant = async (id: number) => {
//   try {
//     await axios.put(TOGGLE_MAPPING_STATUS_URL + id + "/status", {isActive: false});
//   } catch (error) {
//     console.error(`Error deleting tenant with ID ${id}`, error);
//     throw error;
//   }
// };

export const deleteTenant = async (id: number, data: {
  isActive?: boolean;
}) => {
  try {
    const response = await axios.patch(TOGGLE_MAPPING_STATUS_URL + id + "/status/", data);
    return response.data;
  } catch (error) {
    console.error(`Error updating tenant mapping status with ID ${id}`, error);
    throw error;
  }
};
