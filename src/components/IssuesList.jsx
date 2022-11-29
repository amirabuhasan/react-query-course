import { useQuery } from 'react-query';
import { IssueItem } from './IssueItem';

export default function IssuesList({ labels, status }) {
  const issuesQuery = useQuery(['issues', { labels, status }], () => {
    const labelsString = labels.map(label => `labels[]=${label}`).join('&');
    const statusString = status ? `&status=${status}` : '';
    return fetch(`/api/issues?${labelsString}${statusString}`).then(res => res.json());
  });
  const { data } = issuesQuery;
  return (
    <div>
      <h2>Issues List</h2>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
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
      )}
    </div>
  );
}
