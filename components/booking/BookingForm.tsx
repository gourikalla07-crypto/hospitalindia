"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, User, Stethoscope, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { createAppointment } from "@/lib/actions/appointments";

const formSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Enter a valid age"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
  departmentId: z.string().min(1, "Please select a department"),
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time slot"),
  symptoms: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BookingForm() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>}>
      <BookingFormContent />
    </Suspense>
  );
}

function BookingFormContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      gender: "male",
      departmentId: "",
      doctorId: "",
      date: "",
      time: "",
      symptoms: "",
    },
  });

  const selectedDept = watch("departmentId");
  const selectedDoctor = watch("doctorId");
  const selectedDate = watch("date");

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: depts } = await supabase.from("departments").select("*");
      setDepartments(depts || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Initial URL Pre-selection
  useEffect(() => {
    const deptId = searchParams.get("deptId");
    const deptName = searchParams.get("dept"); // Legacy support for name
    const docId = searchParams.get("doctorId");
    
    if (deptId) {
      setValue("departmentId", deptId);
      setStep(2);
    } else if (deptName && departments.length > 0) {
      const found = departments.find(d => d.name.toLowerCase() === deptName.toLowerCase());
      if (found) {
        setValue("departmentId", found.id);
        setStep(2);
      }
    }
    
    if (docId) {
      setValue("doctorId", docId);
      setStep(2);
    }
  }, [searchParams, departments]);

  // Filter doctors by department
  useEffect(() => {
    if (!selectedDept) {
      setDoctors([]);
      return;
    }
    async function fetchDoctors() {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("department_id", selectedDept);
      
      if (error) {
        toast.error("Failed to load doctors");
        return;
      }
      setDoctors(data || []);
    }
    fetchDoctors();
  }, [selectedDept]);

  // Handle availability (mock slots for now, normally check DB)
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      // In a real app, you'd fetch from Supabase:
      // select count(*) from appointments where doctor_id = x and date = y and time = z
      setAvailableSlots(["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]);
    }
  }, [selectedDoctor, selectedDate]);

  const nextStep = async () => {
    let fields: (keyof FormValues)[] = [];
    if (step === 1) fields = ["fullName", "email", "phone", "age", "gender"];
    if (step === 2) fields = ["departmentId", "doctorId"];
    if (step === 3) fields = ["date", "time"];

    const isValid = await trigger(fields);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const result = await createAppointment(values);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setBookingSuccess({ ...result.data, doctor: doctors.find(d => d.id === values.doctorId) });
      toast.success("Appointment booked successfully!");
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-12 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 text-center"
      >
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-secondary" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Appointment Confirmed!</h2>
        <p className="text-slate-500 mb-8">
          Your appointment has been successfully scheduled. We've sent a confirmation email to {bookingSuccess.patient_email}.
        </p>
        
        <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 mb-8">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Appointment ID</span>
            <span className="font-mono font-bold text-primary">{bookingSuccess.id.split('-')[0].toUpperCase()}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Doctor</span>
            <span className="font-semibold">{bookingSuccess.doctor?.full_name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Date</span>
            <span className="font-semibold">{format(new Date(bookingSuccess.appointment_date), "PPP")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Time</span>
            <span className="font-semibold text-primary">{bookingSuccess.appointment_time}</span>
          </div>
        </div>

        <button 
          onClick={() => window.location.href = "/"}
          className="w-full py-4 medical-gradient text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform"
        >
          Back to Home
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Stepper */}
      <div className="mb-12 flex justify-between items-center px-4 md:px-12">
        {[
          { label: "Personal Info", icon: User },
          { label: "Department", icon: Stethoscope },
          { label: "Schedule", icon: Clock },
          { label: "Notes", icon: FileText }
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2 relative">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
              step > i + 1 ? "bg-secondary text-white" : 
              step === i + 1 ? "medical-gradient text-white shadow-lg shadow-primary/30" : 
              "bg-white border border-slate-200 text-slate-400"
            )}>
              {step > i + 1 ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
            </div>
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider hidden md:block",
              step === i + 1 ? "text-primary" : "text-slate-400"
            )}>{s.label}</span>
            {i < 3 && (
              <div className="absolute top-6 left-[120%] w-[150%] h-[2px] bg-slate-100 hidden md:block">
                <div className={cn(
                  "h-full bg-secondary transition-all duration-500",
                  step > i + 1 ? "w-full" : "w-0"
                )} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">Personal Information</h2>
                  <p className="text-slate-500">Please provide your contact details for the booking.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <input
                      {...register("fullName")}
                      placeholder="e.g. John Doe"
                      className={cn(
                        "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all",
                        errors.fullName && "border-red-300 ring-2 ring-red-50"
                      )}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 ml-1">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <input
                      {...register("email")}
                      placeholder="john@example.com"
                      className={cn(
                        "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all",
                        errors.email && "border-red-300 ring-2 ring-red-50"
                      )}
                    />
                    {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                    <input
                      {...register("phone")}
                      placeholder="+1 (555) 000-0000"
                      className={cn(
                        "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all",
                        errors.phone && "border-red-300 ring-2 ring-red-50"
                      )}
                    />
                    {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Age</label>
                      <input
                        {...register("age")}
                        placeholder="25"
                        className={cn(
                          "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all",
                          errors.age && "border-red-300 ring-2 ring-red-50"
                        )}
                      />
                      {errors.age && <p className="text-xs text-red-500 ml-1">{errors.age.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Gender</label>
                      <select
                        {...register("gender")}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Department & Doctor */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">Choose Specialist</h2>
                  <p className="text-slate-500">Pick the department and your preferred doctor.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700">Select Department</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {departments.map((dept) => (
                        <div 
                          key={dept.id}
                          onClick={() => {
                            setValue("departmentId", dept.id);
                            trigger("departmentId");
                          }}
                          className={cn(
                            "cursor-pointer p-4 rounded-2xl border transition-all text-center",
                            selectedDept === dept.id 
                              ? "bg-primary/5 border-primary text-primary font-bold shadow-md" 
                              : "bg-slate-50 border-slate-100 hover:border-slate-300"
                          )}
                        >
                          {dept.name}
                        </div>
                      ))}
                    </div>
                    {errors.departmentId && <p className="text-xs text-red-500">{errors.departmentId.message}</p>}
                  </div>

                  {selectedDept && (
                    <div className="space-y-4 pt-4">
                      <label className="text-sm font-bold text-slate-700">Select Doctor</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {doctors.map((doc) => (
                          <div 
                            key={doc.id}
                            onClick={() => {
                              setValue("doctorId", doc.id);
                              trigger("doctorId");
                            }}
                            className={cn(
                              "cursor-pointer p-6 rounded-2xl border flex items-center gap-4 transition-all",
                              selectedDoctor === doc.id 
                                ? "bg-primary/5 border-primary shadow-md" 
                                : "bg-white border-slate-100 hover:border-slate-300"
                            )}
                          >
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200">
                              {doc.image_url ? (
                                <img src={doc.image_url} alt={doc.full_name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <User className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className={cn("font-bold text-slate-900", selectedDoctor === doc.id && "text-primary")}>
                                {doc.full_name}
                              </div>
                              <div className="text-xs text-slate-500">{doc.specialty} • {doc.experience_years}y Exp</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.doctorId && <p className="text-xs text-red-500">{errors.doctorId.message}</p>}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">Select Schedule</h2>
                  <p className="text-slate-500">Pick a convenient date and time for your visit.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <label className="text-sm font-bold text-slate-700">Appointment Date</label>
                     <input 
                       type="date"
                       min={format(new Date(), "yyyy-MM-dd")}
                       {...register("date")}
                       className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                     />
                     {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
                  </div>

                  <div className="space-y-4">
                     <label className="text-sm font-bold text-slate-700">Available Slots</label>
                     <div className="grid grid-cols-3 gap-3">
                        {availableSlots.map((slot) => (
                          <div 
                            key={slot}
                            onClick={() => {
                            setValue("time", slot);
                            trigger("time");
                          }}
                            className={cn(
                              "cursor-pointer px-4 py-3 rounded-xl border text-center transition-all",
                              watch("time") === slot 
                                ? "bg-primary border-primary text-white font-bold" 
                                : "bg-white border-slate-100 hover:border-slate-300 text-slate-600"
                            )}
                          >
                            {slot}
                          </div>
                        ))}
                     </div>
                     {errors.time && <p className="text-xs text-red-500">{errors.time.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Notes & Review */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">Additional Details</h2>
                  <p className="text-slate-500">Add symptoms or special requests for the doctor.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Symptoms (Optional)</label>
                    <textarea
                      {...register("symptoms")}
                      rows={6}
                      placeholder="Describe how you're feeling..."
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                       <ShieldCheck className="w-5 h-5 text-secondary" />
                       Service Agreement
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed italic">
                      "I agree to provide accurate medical history and understand that this appointment is subject to confirmation by the hospital staff. Appointments may be rescheduled in case of emergencies."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous Task
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-4 medical-gradient text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-10 py-4 medical-gradient text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Appointment
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
