
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith("+");
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div className="p-2 rounded-full bg-zyra-purple/10 text-zyra-purple">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
