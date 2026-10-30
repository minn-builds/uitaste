export const A = ({ items, rows }: { items: string[]; rows: { id: string }[] }) => (
  <>
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 rounded-xl border p-6">
        <h3>Big</h3>
        <p>Text</p>
      </div>
      <div className="rounded-xl border p-6">
        <h3>Small</h3>
        <p>Text</p>
      </div>
      <div className="rounded-xl border p-6">
        <h3>Small</h3>
        <p>Text</p>
      </div>
    </div>
    <ul>
      {items.map((i) => (
        <li key={i} className="rounded-full px-3">
          {i}
        </li>
      ))}
    </ul>
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.id} className="rounded-lg border p-3">
          <p>{r.id}</p>
          <span>$10</span>
        </div>
      ))}
    </div>
    <ul>
      {rows.map((r) => (
        <li key={r.id} className="border-b py-2">
          <span>{r.id}</span>
          <span>paid</span>
        </li>
      ))}
    </ul>
  <table className="grid">
      <tbody className="grid">
        {rows.map((r) => (
          <tr key={r.id} className="rounded-lg border bg-muted">
            <th className="border bg-muted">
              <p>{r.id}</p>
            </th>
            <td className="border-b bg-background">
              <p>$10</p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
