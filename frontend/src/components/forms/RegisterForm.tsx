'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Cambiado a zodResolver
import { registerSchema, RegisterValues } from '../../schemas/registerSchema';
import FormInput from '../ui/FormInput';
import FormButton from '@/components/ui/FormButton';
import { useAuthStore } from '@/store/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema), // Cambiado a zodResolver
    mode: 'onChange',
  });

  const onSubmit = async(data: RegisterValues) => {
    try {
      const res = await axios.post(`http://localhost:4000/api/register`, data);
      const { user, token } = res.data;
      login(user, token);
      console.log('Usuario registrado:', user);
      router.push('/movies');
      reset();
    } catch (error) {
      console.error('Error al registrarse:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Nombre"
        type="text"
        error={errors.name?.message}
        aria-invalid={!!errors.name}
        {...register('name')}
        placeholder="Juan Pérez"
      />
      <FormInput
        label="Email"
        type="email"
        error={errors.email?.message}
        aria-invalid={!!errors.email}
        {...register('email')}
        placeholder="ejemplo@mail.com"
      />
      <FormInput
        label="Contraseña"
        type="password"
        error={errors.password?.message}
        aria-invalid={!!errors.password}
        {...register('password')}
        placeholder="********"
      />
      <FormInput
        label="Confirmar contraseña"
        type="password"
        error={errors.confirmPassword?.message}
        aria-invalid={!!errors.confirmPassword}
        {...register('confirmPassword')}
        placeholder="Repetir contraseña"
      />
      <div className="flex gap-4">
        <FormButton
          type="submit"
          className="flex-1 bg-gradient-to-r from-violet-700 to-blue-800 text-white rounded-lg hover:from-violet-800 hover:to-blue-900 cursor-pointer"
        > Registrarse</FormButton>
        <FormButton
          type="button"
          className="flex-1 bg-gradient-to-r from-red-600 to-red-900 text-white rounded-lg hover:from-red-700 hover:to-red-950 cursor-pointer"
          onClick={() => reset()}
        >Cancelar</FormButton>
      </div>
    </form>
  );
};

export default RegisterForm;