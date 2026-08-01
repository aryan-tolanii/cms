const CountCell = ({ value }) => {
  return (
    <div className="flex justify-center">
      <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 py-1 text-sm font-medium">
        {value}
      </span>
    </div>
  );
};

export default CountCell;