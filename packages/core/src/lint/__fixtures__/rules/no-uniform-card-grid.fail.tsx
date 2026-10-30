export const A = ({ features }: { features: { t: string }[] }) => (
  <>
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border p-6">
        <Icon />
        <h3>One</h3>
        <p>Text</p>
      </div>
      <div className="rounded-xl border p-6">
        <Icon />
        <h3>Two</h3>
        <p>Text</p>
      </div>
      <div className="rounded-xl border p-6">
        <Icon />
        <h3>Three</h3>
        <p>Text</p>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {features.map((f) => (
        <div key={f.t} className="rounded-xl border p-6">
          <h3>{f.t}</h3>
          <p>Text</p>
        </div>
      ))}
    </div>
  </>
);
