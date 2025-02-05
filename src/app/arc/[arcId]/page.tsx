"use client";
import { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard";
import { getArcById } from "@/actions/actions";
import { Arc } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const [data, setData] = useState<Arc | null>(null);
  const { data: session } = useSession();

  const getArcData = async () => {
    const { data: arcData } = await getArcById(
      params.arcId as string,
      session?.user.id as string
    );

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
    <div className="p-5">
      <Dashboard data={data} />
    </div>
  );
};

export default Page;
