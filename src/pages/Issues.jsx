import { useState } from 'react';
import { Link } from 'react-router-dom';
import IssuesList from '../components/IssuesList';
import LabelList from '../components/LabelList';
import { StatusSelect } from '../components/StatusSelect';
export default function Issues() {
  const [labels, setLabels] = useState([]);
  const [status, setStatus] = useState('');
  const [pageNum, setPageNum] = useState(1);

  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList labels={labels} pageNum={pageNum} setPageNum={setPageNum} status={status} />
        </section>
        <aside>
          <LabelList
            selected={labels}
            toggle={label => {
              setLabels(currentLabels =>
                currentLabels.includes(label)
                  ? currentLabels.filter(currentLabel => currentLabel !== label)
                  : currentLabels.concat(label)
              );
              setPageNum(1);
            }}
          />
          <h3>Status</h3>
          <StatusSelect
            onChange={event => {
              setStatus(event.target.value);
              setPageNum(1);
            }}
            value={status}
          />
          <hr />
          <Link className="button" to="/add">
            Add Issue
          </Link>
        </aside>
      </main>
    </div>
  );
}
