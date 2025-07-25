import { FC } from 'react';
import FormButton from './ui/FormButton';

type PaginationProps = {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  setPagination: React.Dispatch<React.SetStateAction<{
    page: number;
    limit: number;
    total: number;
  }>>;
};

const Pagination: FC<PaginationProps> = ({ pagination, setPagination }) => {
  return (
    <div className="flex justify-center mt-6">
      <FormButton
        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
        disabled={pagination.page === 1}
        className="px-4 py-2 mx-1 rounded bg-gray-700 disabled:opacity-50"
      >
        Anterior
      </FormButton>
      <span className="px-4 py-2">
        Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
      </span>
      <FormButton
        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
        disabled={pagination.page * pagination.limit >= pagination.total}
        className="px-4 py-2 mx-1 rounded bg-gray-700 disabled:opacity-50"
      >
        Siguiente
      </FormButton>
    </div>
  );
};

export default Pagination;
