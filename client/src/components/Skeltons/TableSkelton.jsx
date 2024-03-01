import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const TableSkelton = ({ columns, headings, numbering }) => {
  const getRows = (no) => {
    let rows = [];
    for (let i = 0; i < no; i++) {
      rows.push(
        <>
          <tr
            className={cn(
              "grid space-x-5 text-center space-y-4 md:space-y-7",
              columns
            )}
          >
            {numbering && (
              <td className="flex items-end justify-center col-span-1">
                <Skeleton className="w-1/2 h-5 bg-black/10" />
              </td>
            )}
            {headings.map((value, index) => (
              <td
                className={cn(
                  "flex items-end justify-center ",
                  index === 0 ? "col-span-2" : "col-span-1",
                  index=== 3 && "hidden md:flex",
                  index === 4  && "hidden lg:flex",
                  index ===5 && "hidden lg:flex" ,
                  index === 6 && "hidden lg:flex"
                )}
                key={index}
              >
                <Skeleton className={`w-9/12 h-5 bg-black/10`} />
              </td>
            ))}
          </tr>
          <hr className="mt-2 border-gray-300" />
        </>
      );
    }
    return rows;
  };
  return (
    <>
      {getRows(12).map((row, index) => (
        <div key={index}>{row}</div>
      ))}
    </>
  );
};

export default TableSkelton;
