import CoSheet from "./CoSheet";
import CardTable from "../components/CardTable";
import ModernTable from "../components/ModernTable";
import React from "react";

function Dashboard() {
  return (
    <>
      <div className="bg-white/20 backdrop-blur-lg border border-gray-300/30 dark:bg-gray-800/20 dark:border-gray-600/30 rounded-xl p-6 mb-4">
        <h3 className="text-gray-900 dark:text-gray-100 font-bold">Title</h3>
        <p className="text-gray-700 dark:text-gray-300">Content</p>
      </div>

      {/* Input */}
      <input
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded px-3 py-2 mb-4"
        placeholder="Enter text"
      />

      {/* Select */}
      <select
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 mb-4"
      >
        <option>Option 1</option>
      </select>

      {/* Table */}
      <table className="w-full mt-4">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="text-gray-900 dark:text-white p-3 text-left">Header</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900">
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="text-gray-700 dark:text-gray-300 p-3">Data</td>
          </tr>

        </tbody>
      </table>
      {/* <ModernTable/> */}

      <CardTable />

      {/* <CoSheet /> */}
    </>
  );
}

export default Dashboard;
