import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .min(1, { message: "El nombre es obligatorio" })
    .min(2, { message: "Debe tener al menos 2 caracteres" })
    .max(50, { message: "No puede exceder los 50 caracteres" }),

  email: z.email({ message: "Debe ser un email válido" })
    .min(1, { message: "El email es obligatorio" }),

  password: z.string()
    .min(1, { message: "La contraseña es obligatoria" })
    .min(6, { message: "Debe tener al menos 6 caracteres" })
    .max(50, { message: "No puede exceder los 50 caracteres" })
    .regex(/[A-Z]/, { message: "Debe contener al menos una mayúscula" })
    .regex(/[a-z]/, { message: "Debe contener al menos una minúscula" })
    .regex(/[0-9]/, { message: "Debe contener al menos un número" }),

  confirmPassword: z.string()
    .min(1, { message: "Debe confirmar su contraseña" })
}).refine(
  (data) => data.password === data.confirmPassword, 
  {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
  }
);

export type RegisterValues = z.infer<typeof registerSchema>;