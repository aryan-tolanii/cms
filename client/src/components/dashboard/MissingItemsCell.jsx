const MissingItemsCell = ({ items = [] }) => {
    if (items.length === 0) {
        return (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Complete
            </span>
        );
    }

    return (
        <div className="flex flex-wrap gap-1">
            {items.map((item) => (
                <span
                    key={item}
                    className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                >
                    {item}
                </span>
            ))}
        </div>
    );
};

export default MissingItemsCell;