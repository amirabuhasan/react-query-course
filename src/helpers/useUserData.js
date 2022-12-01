import { useQuery } from 'react-query';

export function useUserData(userId) {
  const usersData = useQuery(['users', userId], ({ signal }) =>
    fetch(`/api/users/${userId}`).then(res => res.json(), {
      staleTime: 1000 * 60 * 5,
      signal,
    })
  );
  return usersData;
}
