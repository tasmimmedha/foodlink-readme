"use client";

import { ReportExportCard } from "@/components/shop/ReportExportCard";
import { Button } from "@/components/ui/button";
import { useExpiringItems, useSurplusQueue, usePriceMap } from "@/hooks/use-query-shop";

export default function ShopReportsPage() {
  const { data: expiring } = useExpiringItems();
  const { data: surplus = [] } = useSurplusQueue();
  const { data: priceMap = [] } = usePriceMap();

  const downloadCSV = (filename: string, rows: string[][]) => {
    const csvContent = rows.map((row) => row.map((value) => `"${value}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExpired = () => {
    const rows: string[][] = [
      ["SKU", "Category", "Expiry Date", "Quantity", "Status"],
      ...(expiring?.today ?? []).map((item) => [
        item.name,
        item.category,
        new Date(item.expiryDate).toLocaleDateString(),
        `${item.stockQuantity} ${item.unit}`,
        "Expiring today",
      ]),
    ];
    downloadCSV("expired-items.csv", rows);
  };

  const downloadSurplus = () => {
    const rows: string[][] = [
      ["Item", "Quantity", "Destination", "Status", "Pickup"],
      ...surplus.map((entry) => [
        entry.skuName,
        `${entry.quantity} ${entry.unit}`,
        entry.destinationName ?? "Unassigned",
        entry.status,
        entry.pickupTime ? new Date(entry.pickupTime).toLocaleString() : "TBD",
      ]),
    ];
    downloadCSV("surplus-items.csv", rows);
  };

  const downloadMarkdowns = () => {
    const rows: string[][] = [
      ["SKU", "Old Price", "New Price", "Method", "Effective"],
      ...priceMap.slice(0, 30).map((entry) => [
        entry.skuName,
        String(entry.oldPrice),
        String(entry.newPrice),
        entry.method,
        new Date(entry.effectiveAt).toLocaleString(),
      ]),
    ];
    downloadCSV("markdown-performance.csv", rows);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports & exports</h1>
        <p className="text-sm text-slate-500">
          Generate daily / weekly printable views and export CSV summaries for compliance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReportExportCard
          title="Expired items report"
          description="All items expiring today grouped by category."
          onDownload={downloadExpired}
          onPrint={() => window.print()}
        />
        <ReportExportCard
          title="Surplus donation queue"
          description="Pending pickups with assigned NGOs."
          onDownload={downloadSurplus}
          onPrint={() => window.print()}
        />
        <ReportExportCard
          title="Markdown performance"
          description="Price adjustments with old vs new pricing."
          onDownload={downloadMarkdowns}
          onPrint={() => window.print()}
        />
        <div className="rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-lg shadow-slate-200/60">
          <p className="text-lg font-semibold text-slate-800">Generate weekly report</p>
          <p className="text-sm text-slate-500">
            Combine expiry, markdown, and surplus stats into a printable summary.
          </p>
          <Button className="mt-4 rounded-full" onClick={() => window.print()}>
            Generate report
          </Button>
        </div>
      </div>
    </div>
  );
}

