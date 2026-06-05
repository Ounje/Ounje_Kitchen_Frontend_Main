import VendorMenuPage from "@/components/account-setup/VendorMenuPage";

interface Props {
  params: { vendorId: string };
}

export default function OperationsVendorMenuPage({ params }: Props) {
  return <VendorMenuPage vendorId={params.vendorId} portal="operations" />;
}
