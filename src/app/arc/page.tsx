import Dashboard from "@/components/dashboard";
import React from "react";

const page = () => {
  return (
    <div className="p-5">
      <Dashboard name="ant-shant" totalDays={30} />
    </div>
  );
};

export default page;
