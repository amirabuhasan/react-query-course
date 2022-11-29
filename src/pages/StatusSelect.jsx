const possibleStatus = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To-do' },
  { id: 'inProgress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
  { id: 'cancel' },
];
export function StatusSelect({ value, onChange }) {
  return (
    <select className="status-select" onChange={onChange} value={value}>
      <option value="">Select a status to filter</option>
      {possibleStatus.map(status => (
        <option key={status.id} value={status.id}>
          {status.label}
        </option>
      ))}
    </select>
  );
}