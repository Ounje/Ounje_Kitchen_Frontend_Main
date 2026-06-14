/**
 * CSV Export Utility for IT Dashboard
 * Handles client-side CSV generation for all entity types
 */

interface CSVExportOptions {
  filename: string;
  data: any[];
  entityType: "admin" | "staff" | "customer" | "vendor" | "rider" | "mixed";
  includeEntityTypeColumn?: boolean;
}

/**
 * Convert data to CSV format
 */
function convertToCSV(data: any[], headers: string[]): string {
  const csvRows: string[] = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];

      // Handle different value types
      if (value === null || value === undefined) {
        return "";
      }

      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(",") ? `"${escaped}"` : escaped;
    });

    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

/**
 * Download CSV file
 */
function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Format entity data for CSV export
 */
function formatEntityData(entity: any, entityType: string): Record<string, any> {
  const baseData: Record<string, any> = {
    "Entity Type": entityType.charAt(0).toUpperCase() + entityType.slice(1),
    ID: entity._id || "",
    Email: entity.email || "",
    Phone: entity.phone || entity.phoneNumber || "",
    Status: entity.isActive
      ? "Active"
      : entity.isSuspended
        ? "Suspended"
        : entity.isDeleted
          ? "Deleted"
          : "Inactive",
    "Created Date": entity.createdAt ? new Date(entity.createdAt).toLocaleDateString() : "",
  };

  // Entity-specific fields
  switch (entityType) {
    case "admin":
    case "staff":
      return {
        ...baseData,
        "First Name": entity.firstName || "",
        "Last Name": entity.lastName || "",
        Department: entity.department || "",
        "Line Manager": entity.lineManager
          ? typeof entity.lineManager === "object"
            ? `${entity.lineManager.firstName} ${entity.lineManager.lastName}`
            : entity.lineManager
          : "",
        Role: entity.isSuperAdmin ? "Super Admin" : entity.isHead ? "Department Head" : "Staff",
      };

    case "customer":
      return {
        ...baseData,
        Name: entity.name || `${entity.firstName || ""} ${entity.lastName || ""}`.trim(),
        Address: entity.address || "",
      };

    case "vendor":
      return {
        ...baseData,
        "Business Name": entity.businessName || "",
        "Owner Name": entity.ownerName || "",
        Address: typeof entity.address === "object" ? entity.address.street : entity.address || "",
        "Delivery Type": entity.deliveryType || "Hybrid",
        Verified: entity.isVerified ? "Yes" : "No",
        Rating: entity.rating?.toFixed(1) || "0.0",
      };

    case "rider":
      return {
        ...baseData,
        "First Name": entity.firstName || "",
        "Last Name": entity.lastName || "",
        Zone: entity.zone || "",
        "Vehicle Type": entity.vehicleType || "",
        Rating: entity.rating?.toFixed(1) || "0.0",
        Verified: entity.isVerified ? "Yes" : "No",
      };

    default:
      return baseData;
  }
}

/**
 * Export accounts to CSV
 */
export function exportToCSV(options: CSVExportOptions): void {
  const { filename, data, entityType, includeEntityTypeColumn = false } = options;

  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Format data based on entity type
  let formattedData: any[];

  if (entityType === "mixed") {
    // Mixed entity types (e.g., suspended accounts with customers, vendors, riders, staff)
    formattedData = data.map((item) => formatEntityData(item.entity, item.type));
  } else {
    // Single entity type
    formattedData = data.map((item) => formatEntityData(item, entityType));
  }

  // Extract headers from first row
  const headers = Object.keys(formattedData[0]);

  // Remove 'Entity Type' column if not needed
  if (!includeEntityTypeColumn && headers.includes("Entity Type")) {
    const index = headers.indexOf("Entity Type");
    headers.splice(index, 1);
    formattedData = formattedData.map((row) => {
      const { "Entity Type": _, ...rest } = row;
      return rest;
    });
  }

  // Convert to CSV
  const csvContent = convertToCSV(formattedData, headers);

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const fullFilename = `${filename}_${timestamp}.csv`;

  // Download
  downloadCSV(csvContent, fullFilename);
}

/**
 * Export mixed account types (suspended or deleted accounts)
 */
export function exportMixedAccounts(
  accountsData: {
    customers: any[];
    vendors: any[];
    riders: any[];
    staff: any[];
  },
  type: "suspended" | "deleted"
): void {
  // Flatten all accounts with entity type
  const allAccounts: { entity: any; type: string }[] = [
    ...accountsData.customers.map((c) => ({ entity: c, type: "customer" })),
    ...accountsData.vendors.map((v) => ({ entity: v, type: "vendor" })),
    ...accountsData.riders.map((r) => ({ entity: r, type: "rider" })),
    ...accountsData.staff.map((s) => ({ entity: s, type: "staff" })),
  ];

  if (allAccounts.length === 0) {
    alert(`No ${type} accounts to export`);
    return;
  }

  exportToCSV({
    filename: `${type}_accounts`,
    data: allAccounts,
    entityType: "mixed",
    includeEntityTypeColumn: true,
  });
}
