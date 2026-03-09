"use client";

import SettingsPage from "@/components/shared/SettingsPage";
import { financeService } from "@/lib/api/services/finance.service";

export default function financeSettingsPage() {
  return <SettingsPage apiService={financeService} />;
}