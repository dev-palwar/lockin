"use client";
import { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard";
import { getArcById } from "@/actions/actions";
import { Arc } from "@prisma/client";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const [data, setData] = useState<Arc | null>(null);

  const getArcData = async () => {
    const { data: arcData } = await getArcById(params.arcId as string);

    if (arcData !== undefined) {
      setData(arcData);
    } else {
      setData(null);
    }
  };

  useEffect(() => {
    getArcData();
  }, []);

  return (
    <div className="">
      <Dashboard data={data} />
    </div>
  );
};

export default Page;
