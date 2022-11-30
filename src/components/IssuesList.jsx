import { useState } from 'react';
import { useQuery } from 'react-query';
import { IssueItem } from './IssueItem';

export default function IssuesList({ labels, status }) {
  const issuesQuery = useQuery(
    ['issues', { labels, status }],
    () => {
      const labelsString = labels.map(label => `labels[]=${label}`).join('&');
      const statusString = status ? `&status=${status}` : '';
      return fetch(`/api/issues?${labelsString}${statusString}`).then(res => res.json());
    },
    { staleTime: 1000 * 60 }
  );
  const { data } = issuesQuery;
  const [searchValue, setSearchValue] = useState('');

  const searchQuery = useQuery(
    ['issues', 'search', searchValue],
    () => fetch(`/api/search/issues?q=${searchValue}`).then(res => res.json()),
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
      <h2>Issues List</h2>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : searchQuery.fetchStatus === 'idle' && searchQuery.isLoading === true ? (
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
