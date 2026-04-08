import { ArrowRight, Calendar, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Trusted by 10,000+ Patients
            </div>
            
            <h1 className="animate-slide-up text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Your Path to Better <br />
              <span className="text-primary italic">Health</span> Starts Here
            </h1>
            
            <p className="animate-slide-up [animation-delay:100ms] text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Book appointments with world-class specialists in seconds. 
              Real-time scheduling, secure medical records, and expert care.
            </p>

            <div className="animate-slide-up [animation-delay:200ms] flex flex-wrap justify-center gap-4">
              <Link
                href="/book"
                className="group flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] transform transition-all"
              >
                Book Your Appointment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/doctors"
                className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-colors"
              >
                Meet Our Doctors
              </Link>
            </div>

            <div className="animate-slide-up [animation-delay:300ms] pt-12 flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { icon: UserCheck, label: "Expert Doctors" },
                { icon: Calendar, label: "Easy Scheduling" },
                { icon: ShieldCheck, label: "Secure Record" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Departments */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Specialities</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Choose the right department to find the perfect specialist for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Cardiology", desc: "Advanced heart care and surgery", icon: "❤️", id: "cardiology-id" },
            { name: "Pediatrics", desc: "Specialized care for your little ones", icon: "👶", id: "pediatrics-id" },
            { name: "Dermatology", desc: "Skin, hair, and nail treatments", icon: "✨", id: "dermatology-id" },
            { name: "Orthopedics", desc: "Experts in bones and joints", icon: "🦴", id: "orthopedics-id" },
            { name: "Neurology", desc: "Modern neurological care", icon: "🧠", id: "neurology-id" },
            { name: "Gynecology", desc: "Women's health and maternity", icon: "👩‍⚕️", id: "gynecology-id" },
            { name: "General Medicine", desc: "Overall health and wellness", icon: "🩺", id: "general-medicine-id" },
          ].map((dept, i) => (
            <Link 
              key={i} 
              href={`/book?dept=${dept.name}`}
              className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-6">{dept.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{dept.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{dept.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Quote / Stats */}
      <section className="bg-slate-900 text-white py-24 rounded-[3rem] mx-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_120%,#059669,rgba(0,0,0,0))]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Healthcare that <br />
                <span className="text-secondary">Puts You First</span>
              </h2>
              <p className="text-slate-400 text-lg">
                At MediSync, we combine technology with empathy to deliver the best patient experience. 
                Our platform ensures you spend less time in waiting rooms and more time with experts.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">99%</div>
                  <div className="text-slate-400 text-sm">Patient Satisfaction</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">24/7</div>
                  <div className="text-slate-400 text-sm">Online Booking</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-white/5 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
                 <div className="w-1/2 h-1/2 medical-gradient rounded-full blur-2xl opacity-50" />
              </div>
              <div className="absolute inset-x-0 bottom-10 p-8 glass rounded-3xl text-slate-900 mx-8">
                 <p className="italic text-lg mb-4 italic">"The booking experience was so smooth. I got my appointment confirmed in less than a minute!"</p>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-200" />
                   <div>
                     <div className="font-bold">John Doe</div>
                     <div className="text-xs text-slate-500">Regular Patient</div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
