'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import CreateMovieForm from "@/components/forms/CreateMovieForm";
import { MovieFormData } from "@/schemas/movieSchema";
import FormButton from "@/components/ui/FormButton";
import api from '@/lib/api';
import { toast } from 'react-toastify';
import Pagination from "@/components/Pagination";
import { Spinner } from "@/components/ui/Spinner";

interface Movie extends MovieFormData {
  idMovie: number;
}

export default function MoviesPage() {
  const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0
});
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();
useEffect(() => {
  if (hasHydrated && token) {
    fetchMovies();
  }
}, [pagination.page, pagination.limit, hasHydrated,token ]);

 useEffect(() => {
  if (hasHydrated && !token) {
    router.push('/login');
  }
}, [hasHydrated, token, router]);

 
const fetchMovies = async () => {
  setIsLoading(true);
  try {
    const response = await api.get(`/movies?page=${pagination.page}&limit=${pagination.limit}`);
    setMovies(response.data.data || []);
    if (response.data.pagination) {
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total
      }));
    } else {
      setPagination(prev => ({
        ...prev,
        total: 0
      }));
    }
  } catch (error) {
    toast.error('Error al obtener películas');
    console.error(error);
  } finally {
    setIsLoading(false);
    console.log('Terminó loading');
  }
};
  const handleDelete = async (idMovie: number) => {
    if (!confirm('¿Estás seguro de eliminar esta película?')) return;
     setIsDeleting(idMovie);
    try {
      await api.delete(`/movies/${idMovie}`);
      await fetchMovies();
    } catch (error) {
      toast.error('Error al eliminar la película');
      alert('No se pudo eliminar la película. Intenta nuevamente.');
    } finally {
      setIsDeleting(null);
      toast.success('Película eliminada');
    }
    
  };


  const handleEditClick = (movie: Movie) => {
    setMovieToEdit({
    ...movie,
    image_url: movie.image_url 
  });
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setMovieToEdit(null)
    fetchMovies()
  }
if (!hasHydrated) return null;
if (isLoading) {
  return (
    <main className="p-6 min-h-screen bg-black text-white flex justify-center items-center">
      <Spinner className="h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </main>
  );
}

  return (
    <main className="p-6 min-h-screen bg-black text-white flex flex-col justify-between">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold w-700">Mis Películas</h1>
      
        <FormButton
         onClick={() => {
  setShowForm(prev => {
    if (prev) setMovieToEdit(null);
    return !prev;
  });
}}
          className=" max-w-[20%] bg-gradient-to-r from-violet-700 to-blue-800 text-white rounded-lg hover:from-violet-800 hover:to-blue-90 px-4 py-2  cursor-pointer"
        >
          {showForm ? 'Cancelar' : '+ Agregar Película'}
        </FormButton>
      </div>

  
      {showForm && (
        <div className="mb-8 flex justify-center">
          <CreateMovieForm
            onSubmitSuccess={handleFormSuccess}
            initialData={movieToEdit || undefined} 
          />
        </div>
      )}
<div className="">{movies.length === 0 ? (
        <p className="text-gray-400">No hay películas registradas</p>
      ) : (
        <ul className="space-y-4">
          {movies.map((movie) => (
            <li key={movie.idMovie} className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-750 transition">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{movie.title}</h2>
             {movie.image_url && (
  <img 
    src={movie.image_url.startsWith('http') 
      ? movie.image_url 
      : `http://localhost:4000${movie.image_url}`}
    alt={movie.title} 
    className="w-48 h-auto rounded-md"
    onError={(e) => {
      (e.target as HTMLImageElement).style.display = 'none';
    }}
  />
)}
                  <p className="text-gray-400">{movie.director} • {movie.genre} ({movie.year})</p>

                  {movie.watched ? (
                    <div className="mt-2">
                      <span className="inline-block bg-green-900 text-green-300 px-2 py-1 rounded-full text-sm">
                        ✔️ Vista - Puntaje: {movie.score || 'Sin puntaje'}
                      </span>
                      {movie.review && (
                        <p className="mt-2 italic text-gray-300">"{movie.review}"</p>
                      )}
                    </div>
                  ) : (
                    <span className="inline-block bg-yellow-900 text-yellow-300 px-2 py-1 rounded-full text-sm mt-2">
                      ✖️ Por ver
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3 items-end">
                  <FormButton
                    
                    onClick={() => handleEditClick(movie)}
                    className="bg-gradient-to-r from-green-700 to-green-800 text-white rounded-lg hover:from-violet-800 hover:to-blue-900 cursor-pointer px-4 py-2"
                  >Editar</FormButton>
                  <FormButton
                   
                    onClick={() => handleDelete(movie.idMovie)}
                    className="bg-gradient-to-r from-red-600 to-red-900 text-white rounded-lg hover:from-red-700 hover:to-red-950 cursor-pointer"
                  >  Eliminar </FormButton>
                </div>
              </div>
              
            </li>
          ))}
        </ul>

      )}</div>
      <div>
<Pagination pagination={pagination} setPagination={setPagination} />
      </div>
      
    </main>
  )
}
