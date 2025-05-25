
import React from "react";
import { Search, Filter, SortAsc, Sparkles, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchAndSortProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const SearchAndSort: React.FC<SearchAndSortProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-8 animate-fade-in">
      {/* Enhanced search input */}
      <div className="relative flex-grow group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300 animate-pulse" />
          <Input
            placeholder="🔍 Search for amazing products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 py-3 text-base bg-background/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-lg shadow-sm hover:shadow-lg focus:shadow-xl group-hover:scale-[1.02]"
          />
          {searchTerm && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-primary animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced sort selector */}
      <div className="w-full sm:w-64 group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl" />
        <div className="relative">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-12 bg-background/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-lg shadow-sm hover:shadow-lg focus:shadow-xl group-hover:scale-[1.02]">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="animate-fade-in bg-background/95 backdrop-blur-sm border-2 border-border/50 shadow-2xl">
              <SelectItem value="featured" className="hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Featured
                </div>
              </SelectItem>
              <SelectItem value="name" className="hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-2">
                  🔤 Name: A to Z
                </div>
              </SelectItem>
              <SelectItem value="price-low" className="hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-2">
                  💰 Price: Low to High
                </div>
              </SelectItem>
              <SelectItem value="price-high" className="hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-2">
                  💸 Price: High to Low
                </div>
              </SelectItem>
              <SelectItem value="rating" className="hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-2">
                  ⭐ Highest Rated
                </div>
              </SelectItem>
              <SelectItem value="newest" className="hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Newest
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndSort;
