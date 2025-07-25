import { z } from 'zod';

export const loginSchema = z.object({
 

  email: z.email({ message: "Debe ser un email válido" }), // ← Método directo

  password: z.string()
    .min(1, { message: "La contraseña es obligatoria" })
    .min(6, { message: "Debe tener al menos 6 caracteres" }),


});

export type LoginValues = z.infer<typeof loginSchema>;