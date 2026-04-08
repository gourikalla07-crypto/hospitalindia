import BookingForm from "@/components/booking/BookingForm";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Book Your <span className="text-primary italic">Appointment</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Complete the form below to schedule your visit with our expert specialists.
          </p>
        </div>

        <BookingForm />

        <div className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <span className="text-primary text-xl font-bold">1</span>
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Select Department</h3>
             <p className="text-sm text-slate-500">Choose the specialty that matches your healthcare needs.</p>
           </div>
           <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <span className="text-primary text-xl font-bold">2</span>
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Pick a Doctor</h3>
             <p className="text-sm text-slate-500">Select from our roster of highly qualified medical professionals.</p>
           </div>
           <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <span className="text-primary text-xl font-bold">3</span>
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Confirm Schedule</h3>
             <p className="text-sm text-slate-500">Choose a time slot that suits your daily routine.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
