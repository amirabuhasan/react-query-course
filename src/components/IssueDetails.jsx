import { useInfiniteQuery, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { relativeDate } from '../helpers/relativeDate';
import { useUserData } from '../helpers/useUserData';
import IssueAssignment from './IssueAssignment';
import { IssueHeader } from './IssueHeader';
import IssueLabels from './IssueLabels';
import IssueStatus from './IssueStatus';
import Loader from './Loader';
import useScrollToBottomAction from '../helpers/useScrollToBottomAction';

function useIssueData(issueNumber) {
  return useQuery(['issues', issueNumber], ({ signal }) => {
    return fetch(`/api/issues/${issueNumber}`).then(res => res.json(), { signal });
  });
}
function useIssueComments(issueNumber) {
  return useInfiniteQuery(
    ['issues', issueNumber, 'comments'],
    ({ signal, pageParam = 1 }) => {
      return fetch(`/api/issues/${issueNumber}/comments?page=${pageParam}`).then(
        res => res.json(),
        { signal }
      );
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return;
        return pages.length + 1;
      },
    }
  );
}
function Comment({ comment, createdBy, createdDate }) {
  const userQuery = useUserData(createdBy);
  if (userQuery.isLoading)
    return (
      <div className="comment">
        <div className="comment-header">Loading...</div>
      </div>
    );
  return (
    <div className="comment">
      <img alt="Commenter avatar" src={userQuery.data.profilePictureUrl} />
      <div>
        <div className="comment-header">
          <span>{userQuery.data.name}</span> commented <span>{relativeDate(createdDate)}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  );
}

export default function IssueDetails() {
  const { number } = useParams();
  const issueQuery = useIssueData(number);
  const commentsQuery = useIssueComments(number);

  useScrollToBottomAction(document, commentsQuery.fetchNextPage, 100);

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? (
        <p>Loading issue...</p>
      ) : (
        <>
          <IssueHeader {...issueQuery.data} />
          <main>
            <section>
              {commentsQuery.isLoading ? (
                <p>Loading...</p>
              ) : (
                commentsQuery.data?.pages.map(commentPage =>
                  commentPage.map(comment => <Comment key={comment.id} {...comment} />)
                )
              )}
              {commentsQuery.isFetchingNextPage && <Loader />}
            </section>
            <aside>
              <IssueStatus
                issueNumber={issueQuery.data.number.toString()}
                status={issueQuery.data.status}
              />
              <IssueAssignment
                assignee={issueQuery.data.assignee}
                issueNumber={issueQuery.data.number.toString()}
              />
              <IssueLabels
                issueNumber={issueQuery.data.number.toString()}
                labels={issueQuery.data.labels}
              />
            </aside>
          </main>
        </>
      )}
    </div>
  );
}
