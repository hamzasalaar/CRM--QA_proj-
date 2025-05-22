import React from "react";
import CreateLead from "../pages/CreateLead"; // adjust path if needed
import LeadList from "../pages/LeadsList"; // optional, if separate

const LeadsPage = () => {
  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Leads Management</h2>

      {/* Create lead form */}
      <CreateLead />

      <hr className="my-4" />

      {/* List of all leads */}
      <LeadList />
    </div>
  );
};

export default LeadsPage;
