import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import fetchWithError from '../helpers/fetchWithError';
import { IssueItem } from './IssueItem';
import Loader from './Loader';

export default function IssuesList({ labels, status, pageNum, setPageNum }) {
  const queryClient = useQueryClient();
  const issuesQuery = useQuery(
    ['issues', { labels, status, pageNum }],
    async ({ signal }) => {
      const labelsString = labels.map(label => `labels[]=${label}`).join('&');
      const statusString = status ? `&status=${status}` : '';
      const paginationString = pageNum ? `&page=${pageNum}` : '';
      const results = await fetchWithError(
        `/api/issues?${labelsString}${statusString}${paginationString}`,
        { signal }
      );
      results.forEach(issue => {
        queryClient.setQueryData(['issues', issue.number.toString()], issue);
      });
      return results;
    },
    { keepPreviousData: true }
  );
  const { data } = issuesQuery;
  const [searchValue, setSearchValue] = useState('');

  const searchQuery = useQuery(
    ['issues', 'search', searchValue],
    ({ signal }) => fetchWithError(`/api/search/issues?q=${searchValue}`, { signal }),
    { enabled: searchValue.length > 0 }
  );

  return (
    <div>
      <form
        onSubmit={event => {
          event.preventDefault();
          setSearchValue(event.target.elements.search.value);
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          id="search"
          name="search"
          onChange={event => {
            if (event.target.value.length === 0) {
              setSearchValue('');
            }
          }}
          placeholder="search"
          type="search"
        />
      </form>
      <h2>Issues List {issuesQuery.isFetching ? <Loader /> : null}</h2>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : issuesQuery.isError ? (
        <p>{issuesQuery.error.message}</p>
      ) : searchQuery.fetchStatus === 'idle' && searchQuery.isLoading === true ? (
        <>
          <ul className="issues-list">
            {data.map(issue => (
              <IssueItem
                assignee={issue.assignee}
                commentCount={issue.comments.length}
                createdBy={issue.createdBy}
                createdDate={issue.createdDate}
                key={issue.id}
                labels={issue.labels}
                number={issue.number}
                status={issue.status}
                title={issue.title}
              />
            ))}
          </ul>
          <div className="pagination">
            <button
              disabled={pageNum === 1}
              onClick={() => {
                if (pageNum - 1 > 0) {
                  setPageNum(pageNum - 1);
                }
              }}
            >
              Previous
            </button>
            <p>
              Page {pageNum} {issuesQuery.isFetching ? '...' : ''}
            </p>
            <button
              onClick={() => {
                if (issuesQuery.data?.length !== 0 && !issuesQuery.isPreviousData) {
                  setPageNum(pageNum + 1);
                }
              }}
              disabled={issuesQuery.data?.length === 0 || issuesQuery.isPreviousData}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data.count} Results</p>
              <ul className="issues-list">
                {searchQuery.data.items.map(issue => (
                  <IssueItem
                    assignee={issue.assignee}
                    commentCount={issue.comments.length}
                    createdBy={issue.createdBy}
                    createdDate={issue.createdDate}
                    key={issue.id}
                    labels={issue.labels}
                    number={issue.number}
                    status={issue.status}
                    title={issue.title}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
