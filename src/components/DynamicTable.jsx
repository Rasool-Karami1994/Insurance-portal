import { useFetchApplications } from "../hooks/useApi";

const DynamicTable = (showToastMessage) => {
  const { data: fetchedData, isLoading, isError } = useFetchApplications();
  console.log(fetchedData);
  if (isLoading)
    return (
      <div className="min-w-full flex justify-items-center items-center h-7">
        <div className="loader w-12 h-12 border-4 border-t-4 border-sky-500 rounded-full animate-spin m-5"></div>
      </div>
    );
  if (isError) showToastMessage("Error get table data", "error");

  return (
    <table className="min-w-full table-auto">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {fetchedData?.columns.map((column) => (
            <th
              key={column}
              className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fetchedData?.data.map((app) => (
          <tr key={app.id}>
            {fetchedData?.columns.map((column) => (
              <td
                key={column}
                className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300"
              >
                {app[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;
