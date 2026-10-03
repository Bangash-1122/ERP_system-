import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Columns,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Skeleton, EmptyState } from '../ui/Card.jsx';
import { exportToExcel, exportToPDF, exportToCSV } from '../../utils/export.js';

export function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  isError = false,
  error = null,
  title = 'Records',
  searchPlaceholder = 'Search records...',
  filterComponent,
  bulkActions,
  onRowClick,
  exportFileName = 'table_export',
  pageSizeOptions = [10, 25, 50, 100],
  initialPageSize = 10
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Search filter
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const val = item[col.key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(term);
      })
    );
  }, [data, searchTerm, columns]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return { key: null, direction: 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((item, idx) => item._id || item.id || idx));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExport = (type) => {
    setIsExportDropdownOpen(false);
    const activeCols = columns.filter((c) => visibleColumns[c.key]);
    if (type === 'excel') exportToExcel(sortedData, exportFileName);
    if (type === 'csv') exportToCSV(sortedData, exportFileName);
    if (type === 'pdf') exportToPDF(activeCols, sortedData, title, exportFileName);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 focus:bg-white transition-all"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {filterComponent}

          {/* Column Toggle */}
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              icon={Columns}
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
            >
              Columns
            </Button>
            {isColumnDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-30 animate-in fade-in">
                <div className="text-[11px] font-semibold text-slate-500 px-2 py-1 uppercase">Toggle Columns</div>
                {columns.map((col) => (
                  <label key={col.key} className="flex items-center gap-2 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns[col.key] !== false}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({ ...prev, [col.key]: e.target.checked }))
                      }
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>{col.header}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              icon={Download}
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            >
              Export
            </Button>
            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in">
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  Export Excel (.xlsx)
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  Export PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedRows.length > 0 && (
        <div className="bg-sky-50 px-4 py-2 border-b border-sky-100 flex items-center justify-between text-xs text-sky-800 animate-in fade-in">
          <span>{selectedRows.length} item(s) selected</span>
          <div className="flex items-center gap-2">
            {bulkActions && bulkActions(selectedRows, () => setSelectedRows([]))}
            <Button size="sm" variant="ghost" onClick={() => setSelectedRows([])}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider select-none">
              <th className="w-10 px-4 py-3">
                <button onClick={handleSelectAll} className="flex items-center cursor-pointer text-slate-400 hover:text-slate-700">
                  {selectedRows.length > 0 && selectedRows.length === paginatedData.length ? (
                    <CheckSquare className="w-4 h-4 text-sky-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              {columns
                .filter((col) => visibleColumns[col.key] !== false)
                .map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    className={clsx(
                      'px-4 py-3',
                      col.sortable !== false && 'cursor-pointer hover:bg-slate-100/80 transition-colors',
                      col.className
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable !== false && (
                        <span className="text-slate-400">
                          {sortConfig.key === col.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-sky-600" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-sky-600" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8">
                  <Skeleton lines={5} className="my-2" />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-rose-600">
                  Failed to load data: {error?.message || 'Server error. Please try again.'}
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8">
                  <EmptyState title="No matching records found" description="Try adjusting your search terms or filters." />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const rowId = row._id || row.id || idx;
                const isSelected = selectedRows.includes(rowId);
                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={clsx(
                      'hover:bg-slate-50/70 transition-colors',
                      isSelected && 'bg-sky-50/40',
                      onRowClick && 'cursor-pointer'
                    )}
                  >
                    <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleSelectRow(rowId)} className="cursor-pointer text-slate-400 hover:text-slate-700">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-sky-600" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    {columns
                      .filter((col) => visibleColumns[col.key] !== false)
                      .map((col) => (
                        <td key={col.key} className={clsx('px-4 py-2.5 whitespace-nowrap', col.cellClassName)}>
                          {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                        </td>
                      ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="hidden sm:inline">
            Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <span className="px-2 font-medium text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
