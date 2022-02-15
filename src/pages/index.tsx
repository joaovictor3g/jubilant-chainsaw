import { Button, Box } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchImages = ({ pageParam = null }) =>
    api.get(`/api/images${!!pageParam ? `?after=${pageParam}` : ''}`);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => {
      const after = lastPage.data.after;
      if (!!after) return after;
      return null;
    },
  });

  const formattedData = useMemo(() => {
    const pages = data?.pages;
    return pages?.map(page => [page.data.data]).flat(2);
  }, [data]);

  function handleFetchNextPage() {
    fetchNextPage();
  }

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            mt="40px"
            disabled={isFetchingNextPage}
            onClick={handleFetchNextPage}
            name="Carregar mais"
          >
            {!isFetchingNextPage ? 'Carregar mais' : 'Carregando...'}
          </Button>
        )}
      </Box>
    </>
  );
}
