'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { movieSchema, MovieFormData } from '@/schemas/movieSchema';
import FormButton from '../ui/FormButton';
import FormInput from '../ui/FormInput';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface MovieFormProps {
  onSubmitSuccess: () => void;
  initialData?: MovieFormData & { idMovie: number };
}

export default function MovieForm({ 
  onSubmitSuccess,
  initialData 
}: MovieFormProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
  control,
  setValue,
  getValues,
  watch
} = useForm<MovieFormData>({
  resolver: zodResolver(movieSchema),
  mode: 'onChange',
  defaultValues: initialData || {
    title: '',
    director: '',
    genre: '',
    year: new Date().getFullYear(),
    watched: false,
    score: undefined,
    review: '',
    image_url: '',
  },
  shouldUnregister: false 
});

// Efecto para sincronizar initialData con el formulario
useEffect(() => {
  if (initialData) {
    reset(initialData); // Usamos reset en lugar de setValue para todos los campos
  }
}, [initialData, reset]);

// Verificar valores actuales (para debug)
useEffect(() => {
  const subscription = watch((value) => {
    console.log('Valores actuales del formulario:', value);
  });
  return () => subscription.unsubscribe();
}, [watch]);

  useEffect(() => {
    setIsClient(true);
  }, []);
useEffect(() => {
  if (initialData) {
    Object.entries(initialData).forEach(([key, value]) => {
      setValue(key as keyof MovieFormData, value);
    });
  }
}, [initialData, setValue]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5_000_000) {
        toast.error('La imagen es demasiado grande (máximo 5MB)');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
        toast.error('Formato de imagen no soportado (solo JPEG, PNG o WEBP)');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const onSubmit = async (data: MovieFormData) => {
  try {
    const toastId = toast.loading(initialData ? 'Actualizando película...' : 'Creando película...');

    const formData = new FormData();
    
    // Campos obligatorios
    formData.append('title', data.title);
    formData.append('director', data.director);
    formData.append('genre', data.genre);
    formData.append('year', String(data.year));
    
    // Campos opcionales - solo si tienen valor
    if (data.watched !== undefined) {
      formData.append('watched', String(data.watched));
    }
    if (data.score !== undefined) {
      formData.append('score', String(data.score));
    }
    if (data.review) {
      formData.append('review', data.review);
    }
    
    // Manejo de imágenes
    if (file) {
      formData.append('image', file);
    } else if (data.image_url !== undefined) {
      formData.append('image_url', data.image_url || '');
    }

    // Debug: Verificar contenido de FormData
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await api({
      method: initialData ? 'put' : 'post',
      url: initialData ? `/movies/${initialData.idMovie}` : '/movies',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.dismiss(toastId);
    toast.success(`Película ${initialData ? 'actualizada' : 'creada'} con éxito!`);
    reset();
    setFile(null);
    setPreview(null);
    onSubmitSuccess();

  } catch (error: any) {
    toast.dismiss();
    
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err: any) => {
        toast.error(`${err.path}: ${err.msg}`);
      });
    } else {
      toast.error(error.message || 'Error al guardar la película');
    }
  }
};

  const genres = [
    { value: 'acción', label: 'Acción' },
    { value: 'aventura', label: 'Aventura' },
    { value: 'comedia', label: 'Comedia' },
    { value: 'drama', label: 'Drama' },
    { value: 'fantasía', label: 'Fantasía' },
    { value: 'terror', label: 'Terror' },
    { value: 'ciencia ficción', label: 'Ciencia ficción' },
    { value: 'romance', label: 'Romance' },
    { value: 'suspenso', label: 'Suspenso' },
    { value: 'documental', label: 'Documental' },
  ];

  if (!isClient) {
    return null; // Evitar problemas de hidratación
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">
        {initialData ? 'Editar Película' : 'Agregar Película'}
      </h2>
      
      <FormInput
        label="Título"
        type="text"
        placeholder="Nombre de la película"
        {...register('title')}
        error={errors.title?.message}
      />
      
      <FormInput
        label="Director"
        type="text"
        placeholder="Nombre del director"
        {...register('director')}
        error={errors.director?.message}
      />
      
      <Select
        label="Género"
        {...register('genre')}
        options={genres}
        placeholder="Seleccione un género"
      />
      
      <FormInput
        label="Año"
        type="number"
        placeholder="Año de lanzamiento"
        {...register('year', { valueAsNumber: true })}
        error={errors.year?.message}
      />

      <FormInput
        label="URL de imagen (opcional)"
        type="text"
        placeholder="https://image.tmdb.org/..."
        {...register("image_url")}
        error={errors.image_url?.message}
      />
      
      <FormInput
        label="Subir imagen (opcional)"
        type="file"
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
      />
      
      {preview && (
        <img
          src={preview}
          alt="Vista previa"
          className="mt-2 max-h-48 rounded shadow"
        />
      )}

      <div className="flex items-center">
        <FormInput
          label="¿Ya la viste?"
          type="checkbox"
          id="watched"
          {...register('watched')}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2 flex center"
        />
      
      </div>
      
      <FormInput
        label="Puntaje (0-10)"
        type="number"
        placeholder="Puntaje de 0 a 10"
        {...register('score', { valueAsNumber: true })}
        error={errors.score?.message}
        min="0"
        max="10"
        step="0.5"
      />
      
      <TextArea
        label="Reseña"
        {...register('review')}
        placeholder="Escribe tu reseña sobre la película..."
        rows={4}
      />
      
      <FormButton
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-violet-700 to-blue-800 text-white rounded-lg hover:from-violet-800 hover:to-blue-900 cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Película' : 'Guardar Película'}
      </FormButton>
    </form>
  );
}