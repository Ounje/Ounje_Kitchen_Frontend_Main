"use client";

import SettingsPage from "@/components/shared/SettingsPage";
import { operationsService } from "@/lib/api/services/operations.service";

export default function OptSettingsPage() {
  return <SettingsPage apiService={operationsService} />;
}
