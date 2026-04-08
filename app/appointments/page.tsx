"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, ChevronRight, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("appointments")
          .select("*, doctor:doctors(*, department:departments(name))")
          .eq("patient_id", user.id)
          .order("appointment_date", { ascending: false });
        setAppointments(data || []);
      }
      setLoading(false);
    }
    getData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Sign in Needed</h1>
          <p className="text-slate-500">
            Please sign in to view your appointment history and manage upcoming visits.
          </p>
          <Link 
            href="/auth"
            className="block w-full py-4 medical-gradient text-white rounded-2xl font-bold hover:scale-[1.02] transition-transform"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Appointments</h1>
            <p className="text-slate-500">Manage your upcoming and past medical visits.</p>
          </div>
          <Link 
            href="/book" 
            className="flex items-center gap-2 px-6 py-3 medical-gradient text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.05] transition-transform"
          >
            <Plus className="w-5 h-5" />
            New Appointment
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center shadow-sm">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Calendar className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No appointments yet</h3>
             <p className="text-slate-500 mb-8">You haven't booked any medical consultations yet.</p>
             <Link href="/book" className="text-primary font-bold hover:underline">Book your first visit today</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {appointments.map((apt) => (
              <div 
                key={apt.id}
                className="group bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex gap-6 items-start">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                      {apt.doctor?.image_url ? (
                        <img src={apt.doctor.image_url} alt={apt.doctor.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                       <div className="flex flex-wrap gap-2 pt-1">
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-primary text-[10px] font-black uppercase tracking-widest">
                            {apt.doctor?.department?.name || "General"}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            {apt.doctor?.specialty}
                          </span>
                       </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">
                          {apt.doctor?.full_name || "Medical Professional"}
                        </h3>
                        <div className="flex flex-wrap gap-4 pt-2">
                           <div className="flex items-center gap-2 text-sm text-slate-500">
                             <Calendar className="w-4 h-4 text-primary" />
                             {apt.appointment_date ? (
                               (() => {
                                 try {
                                   return format(new Date(apt.appointment_date), "PPP");
                                 } catch (e) {
                                   return "Invalid Date";
                                 }
                               })()
                             ) : "Date TBD"}
                           </div>
                           <div className="flex items-center gap-2 text-sm text-slate-500">
                             <Clock className="w-4 h-4 text-primary" />
                             {apt.appointment_time || "Time TBD"}
                           </div>
                        </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end gap-4 min-w-[150px]">
                    <div className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider",
                      apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                      apt.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {apt.status}
                    </div>
                    
                    <button className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-primary transition-colors">
                       View Details
                       <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {apt.symptoms && (
                  <div className="mt-8 pt-8 border-t border-slate-50">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject / Symptoms</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{apt.symptoms}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
