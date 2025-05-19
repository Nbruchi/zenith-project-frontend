
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

const SearchInput = ({
  onSearch,
  placeholder = "Search...",
  className = "",
  defaultValue = "",
}: SearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearch}
        className="w-full"
      />
    </div>
  );
};

export default SearchInput;
