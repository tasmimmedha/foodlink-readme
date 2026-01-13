"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useExportHistory } from "@/hooks/use-query-ngo";
import { toast } from "@/components/ui/use-toast";
import type { HistoryFilters } from "@/lib/server";

interface ExportReportButtonProps {
  filters?: HistoryFilters & { search?: string };
}

export function ExportReportButton({ filters }: ExportReportButtonProps) {
  const exportMutation = useExportHistory();

  const handleExport = async () => {
    try {
      const csv = await exportMutation.mutateAsync(filters);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `foodflow-ngo-history-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Export ready",
        description: "Donation history CSV has been downloaded.",
      });
    } catch {
      toast({
        title: "Export failed",
        description: "Unable to generate CSV. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleExport} disabled={exportMutation.isPending} className="gap-2">
      <FileDown className="h-4 w-4" />
      {exportMutation.isPending ? "Preparing..." : "Export CSV"}
    </Button>
  );
}


