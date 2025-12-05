import SmartSheetTable from "../components/SmartSheetTable";
import TableWithDnD from "../components/TableWithDnD";
import React from "react";

function Profile() {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 space-y-8">
        <TableWithDnD />
        <SmartSheetTable />
      </div>
    </div>
  );
}

export default Profile;
