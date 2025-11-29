/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaFilter, FaSearch, FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import photo from "../../assets/images/detrmonlogy.jpg";

export default function ResidentServices() {
  
  const navigate = useNavigate();
  const { serviceName } = useParams();  
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const dummyData = [
    { id: 1, name: "Dr. Ahmed Khaled", speciality: "Dermatologist", rating: 4.8, price: 250, photo: photo },
    { id: 2, name: "Elite Gym", type: "Fitness Club", rating: 4.4, price: 180, photo: photo },
    { id: 3, name: "Broasted House", type: "Restaurant", rating: 4.1, price: 90, photo: photo },
  ];

  // Fetch simulation
  useEffect(() => {
    setTimeout(() => {
      setResults(dummyData);
      setFiltered(dummyData);
      setLoading(false);
    }, 900);
  }, []);

  useEffect(() => {
    const f = [...results].filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "rating") f.sort((a,b) => b.rating - a.rating);
    if (sort === "priceLow") f.sort((a,b) => a.price - b.price);
    if (sort === "popular") f.sort((a,b) => b.rating - a.rating);

    setFiltered(f);
  }, [search, sort, results]);


  return (
    <motion.div 
      initial={{opacity:0,y:25}}
      animate={{opacity:1,y:0}}
      className="pt-24 px-6 lg:px-16 space-y-10"
    >

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          {serviceName} Services
        </h1>

        <p className="text-gray-500">{filtered?.length} results found</p>
      </div>


      {/* FILTERS 🧠 */}
      <div className="flex flex-wrap gap-4 items-center">

        {/* Sort Select */}
        <select
          onChange={(e)=>setSort(e.target.value)}
          className="border px-4 py-2 bg-background text-foreground rounded-lg font-semibold"
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Top Rated</option>
          <option value="priceLow">Lowest Price</option>
        </select>

        {/* Search */}
        <div className="flex items-center border bg-background px-4 py-2 rounded-lg gap-2">
          <FaSearch size={16} className="text-primary"/>
          <input
            type="text"
            placeholder="Search here..."
            onChange={e=>setSearch(e.target.value)}
            className="outline-none bg-background"
          />
        </div>

        <button className="px-5 py-2 bg-primary text-white rounded-lg font-semibold flex items-center gap-2">
          <FaFilter/> Filter
        </button>
      </div>


      {/* LOADING STATE */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i=>(
            <div key={i} className="bg-gray-200 h-56 rounded-xl animate-pulse"/>
          ))}
        </div>
      )}


      {/* BODY — CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(p => (
          <motion.div 
            key={p.id}
            whileHover={{scale:1.05}}
            className="bg-background rounded-2xl p-5 shadow-xl hover:shadow-2xl cursor-pointer transition"
            onClick={() => navigate(`/resident/service/${serviceName}/${p.id}`)}
          >
            <img src={p.photo} className="w-full h-48 rounded-xl object-cover"/>

            <h3 className="text-xl font-bold mt-3">{p.name}</h3>
            <p className="text-gray-500 text-sm capitalize">{p.speciality || p.type}</p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-yellow-500 flex items-center gap-1">
                <FaStar/> {p.rating}
              </span>
              <span className="font-semibold text-primary">{p.price} EGP</span>
            </div>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}
