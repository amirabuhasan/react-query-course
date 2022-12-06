import { useQuery } from 'react-query';
import { defaultLabels } from './defaultData';

export function useLabelsData() {
  const labelsQuery = useQuery(
    ['labels'],
    ({ signal }) => fetch('/api/labels').then(res => res.json(), { signal }),
    { staleTime: 1000 * 60 * 60, placeholderData: defaultLabels }
  );
  return labelsQuery;
}
