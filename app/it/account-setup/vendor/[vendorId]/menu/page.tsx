import VendorMenuPage from "@/components/account-setup/VendorMenuPage";

interface Props {
  params: { vendorId: string };
}

export default function ITVendorMenuPage({ params }: Props) {
  return <VendorMenuPage vendorId={params.vendorId} portal="it" />;
}
