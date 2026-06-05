import VendorMenuPage from "@/components/account-setup/VendorMenuPage";

interface Props {
  params: Promise<{ vendorId: string }>;
}

export default async function ITVendorMenuPage({ params }: Props) {
  const { vendorId } = await params;
  return <VendorMenuPage vendorId={vendorId} portal="it" />;
}
