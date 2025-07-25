import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
        <LoginForm />
      </div>
    </div>
  );
}
