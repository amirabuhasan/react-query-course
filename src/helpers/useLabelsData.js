import { useQuery } from 'react-query';

export function useLabelsData() {
  const labelsQuery = useQuery(['labels'], ({ signal }) =>
    fetch('/api/labels').then(res => res.json(), { signal })
  );
  return labelsQuery;
}
