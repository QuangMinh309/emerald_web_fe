import { useState, useMemo } from "react";
import { Plus, Printer, FileDown, Trash2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ActionDropdown from "@/components/common/ActionDropdown";
import CustomTable from "@/components/common/CustomTable";
import { SearchBar } from "@/components/common/SearchBar";

import { invoiceColumns } from "./columns";
import type { ActionOption } from "@/types";
import { normalizeString } from "@/utils/string";
import { useInvoices } from "@/hooks/data/useInvoices";
import type { Invoice } from "@/types/invoice";
import { useNavigate } from "react-router-dom";
import CreateInvoiceModal from "@/pages/Invoices/create-invoice";
import DeleteInvoice from "@/pages/Invoices/delete-invoice";
import UpdateInvoiceModal from "@/pages/Invoices/update-invoice";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Invoice states
  const [isNewModalOpen, setNewIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletedInvoice, setDeletedInvoice] = useState<Invoice>();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updatedInvoice, setUpdatedInvoice] = useState<number>();

  // Lấy dữ liệu từ Hooks
  const {
    data: invoices = [],
    isLoading: isInvoicesLoading,
    isError: isInvoicesError,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useInvoices();

  // Logic lọc dữ liệu Invoices
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    if (searchTerm.trim()) {
      const search = normalizeString(searchTerm);
      result = result.filter(
        (item) =>
          normalizeString(item.invoiceCode).includes(search) ||
          normalizeString(item.apartmentId.toString()).includes(search) ||
          normalizeString(item.status).includes(search),
      );
    }

    return result;
  }, [invoices, searchTerm]);

  // Actions cho Dropdown
  const actions: ActionOption[] = useMemo(
    () => [
      {
        id: "delete_all",
        label: "Xóa tất cả",
        icon: <Trash2 className="w-4 h-4" />,
        variant: "danger",
        onClick: () => confirm("Xóa toàn bộ dữ liệu?") && console.log("Delete All"),
        disabled: invoices.length === 0,
      },
      {
        id: "import",
        label: "Import Excel",
        icon: <FileDown className="w-4 h-4" />,
        onClick: () => console.log("Importing..."),
      },
      {
        id: "print",
        label: "In danh sách",
        icon: <Printer className="w-4 h-4" />,
        onClick: () => window.print(),
        disabled: invoices.length === 0,
      },
    ],
    [invoices.length],
  );

  return (
    <>
      <div className="p-1.5 pt-0 space-y-4">
        <PageHeader
          title="Hóa đơn"
          subtitle="Quản lý danh sách các hóa đơn thanh toán"
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNewIsModalOpen(true)}
                className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Tạo hóa đơn
              </button>

              <ActionDropdown
                options={actions}
                sampleFileUrl="/template/invoice_import_template.xlsx"
              />
            </div>
          }
        />

        {/* Khu vực lọc & tìm kiếm */}
        <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm space-y-4">
          <SearchBar
            placeholder="Tìm kiếm theo mã hóa đơn, mã căn hộ, trạng thái..."
            onSearch={setSearchTerm}
          />
        </div>

        {/* Hiển thị nội dung chính */}
        <div className="min-h-[400px]">
          {isInvoicesLoading ? (
            <div className="bg-white p-12 text-center text-gray-500 border rounded shadow-sm">
              Đang tải dữ liệu hóa đơn...
            </div>
          ) : isInvoicesError ? (
            <div className="bg-red-50 border border-red-200 p-8 rounded text-center space-y-3 text-red-600">
              <p className="font-medium">Không thể tải dữ liệu!</p>
              <p className="text-sm">{(invoicesError as Error)?.message}</p>
              <button
                onClick={() => refetchInvoices()}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
              >
                Thử lại ngay
              </button>
            </div>
          ) : (
            <CustomTable
              data={filteredInvoices}
              columns={invoiceColumns}
              defaultPageSize={10}
              onEdit={(row) => {
                setIsUpdateOpen(true);
                setUpdatedInvoice((row as Invoice).id);
              }}
              onDelete={(row) => {
                setIsDeleteOpen(true);
                setDeletedInvoice(row as Invoice);
              }}
              onView={(row) => navigate(`/invoices/${row.id}`)}
            />
          )}
        </div>
      </div>

      {/* Invoice Modals */}
      <CreateInvoiceModal open={isNewModalOpen} setOpen={setNewIsModalOpen} />
      <DeleteInvoice
        seclectedInvoice={deletedInvoice}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      />
      <UpdateInvoiceModal
        open={isUpdateOpen}
        setOpen={setIsUpdateOpen}
        invoiceId={updatedInvoice!}
      />
    </>
  );
};

export default InvoicesPage;
