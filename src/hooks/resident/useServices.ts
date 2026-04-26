import { useEffect, useState } from "react";
import { getAllServices, getServicesBySearh } from "../../api/resident/resident-api";
import { serviceSearchData } from "../../types/resident/residentData";

export function useServices(search: string, page: number = 1) {
  const [data, setData] = useState<serviceSearchData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchServices = async () => {
    try {
      setLoading(true);

      let res;

      if (search && search.trim() !== "") {
        res = await getServicesBySearh(page, 7, search);
      } else {
        res = await getAllServices(page, 7);
      }

      setData(res.data);
      setTotalCount(res.totalCount);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [search, page]);

  return {
    data,
    loading,
    totalCount,
    refetch: fetchServices,
  };
}