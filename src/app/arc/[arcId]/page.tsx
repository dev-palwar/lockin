"use client";
import { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard";
import { getArcById } from "@/actions/actions";
import { Arc } from "@prisma/client";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const [data, setData] = useState<Arc | null>(null);
  const [reqReRender, setReqReRender] = useState(false);

  const getArcData = async () => {
    const { data: arcData } = await getArcById(params.arcId as string);

    if (arcData !== undefined) {
      setData(arcData);
    } else {
      setData(null);
    }
  };

  const toTheChild = (yessar: boolean) => {
    if (yessar) {
      // cause react bacthes the updates
      setReqReRender((prev) => !prev); // Toggle between true & false
    }
  };

  useEffect(() => {
    getArcData();
  }, [reqReRender]);

  return (
    <div className="">
      <Dashboard data={data} toTheParent={toTheChild} />
    </div>
  );
};

export default Page;
