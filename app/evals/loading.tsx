import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  // Create an array of 10 items for skeleton rows
  const skeletonRows = Array.from({ length: 10 }, (_, i) => i);
  const skeletonCells = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="space-y-6 p-4">
      {/* Metrics Card Skeleton */}
      <div className="bg-white rounded-lg shadow p-6 w-fit">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="relative overflow-x-auto">
        <Table>
          <TableBody>
            {skeletonRows.map((row) => (
              <TableRow key={row} className={row % 2 === 0 ? "bg-gray-50" : "bg-orange-50"}>
                <TableCell className="w-48 min-w-48">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                {skeletonCells.map((cell) => (
                  <TableCell key={cell} className="text-center p-1">
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 