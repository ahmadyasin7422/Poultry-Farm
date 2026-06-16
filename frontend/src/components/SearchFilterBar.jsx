/**
 * Reusable search and date filter bar for list pages
 */
const SearchFilterBar = ({
  search,
  onSearchChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  searchPlaceholder = 'Search records...',
  showDateFilter = true,
  showSearch = true,
}) => {
  return (
    <div className="card mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {showSearch && (
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="input-field"
            />
          </div>
        )}
        {showDateFilter && (
          <>
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="input-field"
                placeholder="Start Date"
              />
            </div>
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="input-field"
                placeholder="End Date"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;
