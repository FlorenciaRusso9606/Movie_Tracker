import RegisterForm from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  return (
   
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
        <RegisterForm />
      </div>
    </div>
  );
}