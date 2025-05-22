import React from "react";
import CreateDeal from "./CreateDeal";
import ListDeals from "./ListDeals";

const Deals = () => {
  return (
    <div className="container mt-4">
      <h3>Manage Deals</h3>
      <CreateDeal />
      <ListDeals />
    </div>
  );
};

export default Deals;
