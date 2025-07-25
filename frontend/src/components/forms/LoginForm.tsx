'use client'
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../ui/FormInput';
import FormButton from '../ui/FormButton';
import { useAuthStore } from '@/store/auth';
import { loginSchema, LoginValues } from "../../schemas/loginSchema";
import axios from 'axios';

const LoginForm = () => {
  const login = useAuthStore(state => state.login);
  const hasHydrated = useAuthStore(state => state.hasHydrated);
  const router = useRouter();

  const methods = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const { handleSubmit, formState: { errors } } = methods;

  if (!hasHydrated) {
    return <div>Cargando...</div>;
  }

  const onSubmit = async (data: LoginValues) => {
    try {
      const res = await axios.post(`http://localhost:4000/api/auth/login`, data);

      console.log("Login response:", res.data); 
      
      const { token, user } = res.data;
      
      if (token && user) {
        // Asegúrate que user contiene idUser
        login({
          idUser: user.idUser,
          name: user.name,
          email: user.email
        }, token);
        router.push('/movies');
      } else {
        console.error('Missing token or user in response');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormInput
          label="Email"
          type="email"
          placeholder="correo@ejemplo.com"
          {...methods.register('email')}
          error={errors.email?.message}
        />

        <FormInput
          label="Contraseña"
          type="password"
          placeholder="••••••"
          {...methods.register('password')}
          error={errors.password?.message}
        />
 
        <FormButton 
          type='submit' 
          className='w-full cursor-pointer bg-gradient-to-r from-violet-700 to-blue-800 text-white rounded-lg hover:from-violet-800 hover:to-blue-900'
        >
          Iniciar Sesión
        </FormButton>
      </form>
    </FormProvider>
  )
}

export default LoginForm;