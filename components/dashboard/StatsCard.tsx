"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

export default function StatsCard({ icon: Icon, value, label }: StatsCardProps) {
  return (
    <Card className="border border-border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-surface relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-24 h-24" />
      </div>
      <CardContent className="p-6 flex flex-col justify-between h-full relative z-10 gap-6">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/20 text-primary">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-black text-foreground tracking-tight leading-none mb-1.5">{value}</h3>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}