import { z } from 'zod';

// Definición del schema con tipos explícitos
export const movieSchema = z.object({
  title: z.string().min(1, 'Título requerido'),
  director: z.string().min(1, 'Director requerido'),
  genre: z.string().min(1, 'Género requerido'),
  year: z.number().min(1888, 'Año inválido').max(new Date().getFullYear() + 1),
  score: z.number().min(0, 'Mínimo 0').max(10, 'Máximo 10').optional(),
  review: z.string().optional(),
  watched: z.boolean().optional().default(false), // Cambiado a opcional
  imageUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  imageFile: z.any()
    .optional()
    .refine(files => !files || files.length === 0 || files[0].size <= 5_000_000, 'La imagen debe ser menor a 5MB')
    .refine(files => !files || files.length === 0 || 
      ['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type), 
      'Solo se aceptan JPEG, PNG o WEBP')
});

export type MovieFormData = {
  title: string;
  director: string;
  genre: string;
  year: number;
  score?: number;
  review?: string;
  watched?: boolean; 
  image_url?: string;
  imageFile?: FileList;
};