import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface IForm {
  description: string;
  title: string;
  image: File;
  // url: string;
}

const FILE_SIZE = 10240000; // 10Mb;
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/gif'];

const schema = yup.object({
  description: yup
    .string()
    .required('Descrição obrigatória')
    .max(65, 'Máximo de 65 caracteres'),
  title: yup
    .string()
    .required('Título obrigatório')
    .min(2, 'Mínimo de 2 caracteres')
    .max(20, 'Máximo de 20 caracteres'),
  image: yup
    .mixed()
    .required('Arquivo obrigatório')
    .test(
      'acceptedFormats',
      'Somente são aceitos arquivos PNG, JPEG e GIF',
      value => {
        return value && ACCEPTED_FORMATS.includes(value[0]?.type);
      }
    )
    .test('lessThan10MB', 'O arquivo deve ser menor que 10MB', value => {
      return value && value[0]?.size <= FILE_SIZE;
    }),
});

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: Partial<IForm>) => api.post('/api/images', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm({ resolver: yupResolver(schema) });

  const { errors } = formState;

  const onSubmit = async (data: IForm): Promise<void> => {
    const { description, title } = data;
    const newData = {
      description,
      title,
      url: imageUrl,
    };

    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        });

        return;
      }
      mutation.mutateAsync(newData);
      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image')}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title')}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description')}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
