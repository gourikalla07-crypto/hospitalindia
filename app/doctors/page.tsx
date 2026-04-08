"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Star, Award, Calendar, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: depts } = await supabase.from("departments").select("*");
      const { data: docs } = await supabase.from("doctors").select("*, departments(*)");
      setDepartments(depts || []);
      setDoctors(docs || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === "all" || doc.department_id === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Meet Our <span className="text-primary italic">Specialists</span>
          </h1>
          <p className="text-slate-500 text-lg">
            World-class healthcare from experienced medical professionals.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row gap-6">
           <div className="flex-1 relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input 
               type="text"
               placeholder="Search by name or specialty..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-16 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
             />
           </div>
           <select 
             value={filterDept}
             onChange={(e) => setFilterDept(e.target.value)}
             className="px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all font-semibold text-slate-700"
           >
             <option value="all">All Departments</option>
             {departments.map(dept => (
               <option key={dept.id} value={dept.id}>{dept.name}</option>
             ))}
           </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div 
                key={doc.id}
                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  {doc.image_url ? (
                    <img 
                      src={doc.image_url} 
                      alt={doc.full_name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User className="w-20 h-20" />
                    </div>
                  )}
                  <div className="absolute top-6 right-6">
                    <div className="glass px-4 py-2 rounded-full text-xs font-bold text-primary flex items-center gap-2">
                       <Award className="w-4 h-4 text-secondary" />
                       {doc.experience_years}y Experience
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {doc.full_name}
                      </h3>
                      <p className="text-secondary font-bold text-sm uppercase tracking-wider">
                        {doc.specialty}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                       <Star className="w-4 h-4 fill-amber-500" />
                       4.9
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed italic">
                    "{doc.bio || 'Dedicated to providing top-quality patient care and medical excellence.'}"
                  </p>

                  <Link 
                    href={`/book?doctorId=${doc.id}`}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold border border-slate-100 group-hover:medical-gradient group-hover:text-white group-hover:border-transparent transition-all duration-300"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900">No doctors found</h3>
             <p className="text-slate-500 mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
