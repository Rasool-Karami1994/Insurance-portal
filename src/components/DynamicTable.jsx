import { useFetchApplications } from "../hooks/useApi";

const DynamicTable = () => {
  const { data: fetchedData, isLoading } = useFetchApplications();
  console.log(fetchedData);
  if (isLoading) return <p>Loading...</p>;

  return (
    <table className="min-w-full table-auto">
      <thead className="bg-gray-100">
        <tr>
          {fetchedData?.columns.map((column) => (
            <th
              key={column}
              className="px-4 py-2 text-left text-sm font-medium text-gray-500"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fetchedData?.data.map((app) => (
          <tr key={app.id} className="border-b">
            {fetchedData?.columns.map((column) => (
              <td key={column} className="px-4 py-2 text-sm text-gray-700">
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
