"use client";

import SettingsPage from "@/components/shared/SettingsPage";
import { superAdminService } from "@/lib/api/services/superadmin.service";

export default function SuperAdminSettingsPage() {
  return <SettingsPage apiService={superAdminService} />;
}
