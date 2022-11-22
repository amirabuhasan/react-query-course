import { GoIssueOpened, GoIssueClosed, GoComment } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { relativeDate } from '../helpers/relativeDate';

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
          <small>
            #{number} opened {relativeDate(createdDate)} by {createdBy}
          </small>
        </span>
      </div>
      {assignee ? <div>{assignee}</div> : null}
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
