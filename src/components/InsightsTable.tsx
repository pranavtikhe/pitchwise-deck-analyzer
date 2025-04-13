
import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { formatDistanceToNow } from "date-fns";

interface InsightRecord {
  id: string;
  company_name: string;
  created_at: string;
  file_name?: string;
  fund_value?: number;
}

interface InsightsTableProps {
  insights: InsightRecord[];
  onViewInsight: (id: string) => void;
}

const InsightsTable = ({ insights, onViewInsight }: InsightsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInsights = insights.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(insights.length / itemsPerPage);
  
  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="w-full">
      <Table>
        <TableCaption>A history of analyzed pitch decks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Company</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead className="text-right">Analyzed</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentInsights.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No insights available yet. Upload a pitch deck to get started.
              </TableCell>
            </TableRow>
          ) : (
            currentInsights.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.company_name}</TableCell>
                <TableCell>{item.file_name || "Unnamed file"}</TableCell>
                <TableCell className="text-right">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => onViewInsight(item.id)}
                    className="text-purple hover:underline text-sm font-medium"
                  >
                    View
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {insights.length > itemsPerPage && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  isActive={currentPage === page}
                  onClick={() => handlePageChange(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default InsightsTable;
