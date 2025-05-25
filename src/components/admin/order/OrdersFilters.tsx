
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface OrdersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search orders by ID, customer name, or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background border-border focus:border-primary transition-all duration-200 hover:border-muted-foreground"
        />
      </div>
      <div className="flex items-center gap-2 min-w-[200px]">
        <Filter className="text-muted-foreground h-4 w-4" />
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="bg-background border-border focus:border-primary transition-all duration-200 hover:border-muted-foreground">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border animate-scale-in">
            <SelectItem value="all" className="hover:bg-muted transition-colors duration-200">
              All Orders
            </SelectItem>
            <SelectItem value="pending" className="hover:bg-muted transition-colors duration-200">
              Pending
            </SelectItem>
            <SelectItem value="processing" className="hover:bg-muted transition-colors duration-200">
              Processing
            </SelectItem>
            <SelectItem value="shipped" className="hover:bg-muted transition-colors duration-200">
              Shipped
            </SelectItem>
            <SelectItem value="delivered" className="hover:bg-muted transition-colors duration-200">
              Delivered
            </SelectItem>
            <SelectItem value="cancelled" className="hover:bg-muted transition-colors duration-200">
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
