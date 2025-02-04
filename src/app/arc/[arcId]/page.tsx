"use client";
import { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard";
import { getArcById } from "@/actions/actions";
import { Arc } from "@prisma/client";

const Page = ({ params }: { params: { arcId: string } }) => {
  const [data, setData] = useState<Arc | null>(null);

  const getArcData = async () => {
    const { data: arcData } = await getArcById(params.arcId);
    if (arcData !== undefined) {
      setData(arcData);
      console.log(arcData);
    } else {
      setData(null);
    }
  };

  useEffect(() => {
    getArcData();
  }, []);

  return (
    <div className="p-5">
      <Dashboard data={data} />
    </div>
  );
};

export default Page;
