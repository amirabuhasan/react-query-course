import { GoIssueOpened, GoIssueClosed, GoComment } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { relativeDate } from '../helpers/relativeDate';
import { useUserData } from '../helpers/useUserData';

export function IssueItem({
  assignee,
  commentCount,
  createdBy,
  createdDate,
  key,
  labels,
  number,
  status,
  title,
}) {
  const assigneeUser = useUserData(assignee);
  const createdByUser = useUserData(createdBy);

  return (
    <li key={key}>
      <div>
        {status === 'done' || status === 'canceled' ? (
          <GoIssueClosed style={{ color: 'red' }} />
        ) : (
          <GoIssueOpened style={{ color: 'green' }} />
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels &&
            labels.map(label => (
              <span className={`label red`} key={label}>
                {label}
              </span>
            ))}
          <div>
            <small>
              #{number} opened {relativeDate(createdDate)}{' '}
              {createdByUser.isSuccess ? `by ${createdByUser.data.name}` : ''}
            </small>
          </div>
        </span>
      </div>
      {assignee ? (
        <img
          alt={`Assigned to ${assigneeUser.isSuccess ? assigneeUser.data.name : ''}`}
          className="assigned-to"
          src={assigneeUser.isSuccess ? assigneeUser.data.profilePictureUrl : ''}
        />
      ) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
}
