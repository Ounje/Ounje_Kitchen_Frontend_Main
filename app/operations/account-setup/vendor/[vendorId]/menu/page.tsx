import VendorMenuPage from "@/components/account-setup/VendorMenuPage";

interface Props {
  params: Promise<{ vendorId: string }>;
}

export default async function OperationsVendorMenuPage({ params }: Props) {
  const { vendorId } = await params;
  return <VendorMenuPage vendorId={vendorId} portal="operations" />;
}
