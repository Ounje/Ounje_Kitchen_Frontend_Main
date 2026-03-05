"use client";

import SettingsPage from "@/components/shared/SettingsPage";
import { itService } from "@/lib/api/services/it.service";

export default function ITSettingsPage() {
  return <SettingsPage apiService={itService} />;
}