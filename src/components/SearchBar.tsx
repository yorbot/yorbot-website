
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  image_url: string;
  price: number;
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, slug, category_id, image_url, price')
          .ilike('name', `%${query}%`)
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error searching products:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative w-full">
      <div className="flex">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yorbot-orange"
        />
        <button className="bg-yorbot-orange text-white px-6 py-2 rounded-r-md hover:bg-orange-600 transition-colors">
          <Search size={20} />
        </button>
      </div>

      {query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    to={`/product/${result.slug}`}
                    className="flex items-center p-3 hover:bg-gray-100 transition-colors"
                    onClick={() => setQuery('')}
                  >
                    <div className="w-12 h-12 mr-3 flex-shrink-0">
                      <img
                        src={result.image_url || 'https://via.placeholder.com/48x48?text=Product'}
                        alt={result.name}
                        className="w-full h-full object-cover rounded border"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{result.name}</div>
                      <div className="text-sm text-yorbot-orange font-semibold">₹{result.price}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No products found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
