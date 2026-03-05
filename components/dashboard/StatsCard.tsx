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
    <Card
      className="
        border-none 
        rounded-xl
        shadow-sm
        hover:shadow-md 
        transition-all 
        duration-200
        bg-[#98ef9b]
        w-64
        ml-4
      "
    >
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Icon bubble */}

        <div className="flex items-center justify-center">
        <div
          className="
            w-12 h-12
            rounded-full 
            flex items-center justify-center
            shadow 
          "
          style={{ backgroundColor: "#ffca3a" }}
        >
          <Icon className="h-6 w-6 text-[#1a3f1c]" />
        </div>

        {/* Value */}
        <p className="text-3xl font-extrabold text-[#1a3f1c] leading-none">
          {value}
          </p>
      </div>

        {/* Label */}
        <p className="text-sm font-medium text-[#1a3f1c]/90">
          {label}
        </p>
      </CardContent>
      
    </Card>
  );
}
