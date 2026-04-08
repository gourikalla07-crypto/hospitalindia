"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const appointmentSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  age: z.string(),
  gender: z.string(),
  departmentId: z.string(),
  doctorId: z.string(),
  date: z.string(),
  time: z.string(),
  symptoms: z.string().optional(),
});

export async function createAppointment(formData: any) {
  const supabase = await createClient();
  
  // Server-side validation
  const validatedFields = appointmentSchema.safeParse(formData);
  
  if (!validatedFields.success) {
    return { error: "Invalid form data" };
  }

  const { data: { user } } = await supabase.auth.getUser();
  const values = validatedFields.data;

  // Insert into DB
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      patient_id: user?.id || null,
      doctor_id: values.doctorId,
      appointment_date: values.date,
      appointment_time: values.time,
      symptoms: values.symptoms,
      patient_name: values.fullName,
      patient_email: values.email,
      patient_phone: values.phone,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "This slot is already booked." };
    }
    return { error: "Failed to book appointment." };
  }

  return { success: true, data };
}
