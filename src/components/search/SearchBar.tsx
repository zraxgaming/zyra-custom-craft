
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchTerm.trim();
    if (value) {
      navigate(`/shop?search=${encodeURIComponent(value)}`);
    } else {
      navigate('/shop');
    }
  };
  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-lg">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
export default SearchBar;
