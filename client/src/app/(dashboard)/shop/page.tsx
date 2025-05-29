'use client';

import Image from 'next/image';
import { use, useState } from 'react';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import sampleProducts from '@/components/shopData/shopData';
import api from '@/utils/api';


type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string
  };


const category = [
    {
        name: 'All Products',
        image:'/assets/slider1.jpg'
    },
    {
        name: 'Perfume Products',
        image:'/shop-images/perfume.jpg'
    },
    {
        name: 'Jewelry Products',
        image:'/assets/slider1.jpg'
    }
]


export default function ShopPage() {
    const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [savedItems, setSavedItems] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('All Products');
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [search, setSearch] = useState<string>('');

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
    
    if (favorites.includes(id)) {
        toast.success(`removed from favorites!`);
    } else {
        toast.success(`added to favorites!`);
    }
  };

  
  const filterProduct = (category: string) => {
      if (category === 'All Products') {
          setProducts(sampleProducts);
        } else if (category === 'Perfume Products') {
            const filter = sampleProducts.filter((fil) => fil.category.toLocaleLowerCase().includes('perfume'));
            setProducts(filter);
        } else if (category === 'Jewelry Products') {
            const filter = sampleProducts.filter((fil) => fil.category.toLocaleLowerCase().includes('jewelry'));
            setProducts(filter);
            
        }
    }
    const changeCategory = (category: string) => {
      setCurrentCategory(category);
      filterProduct(category);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    
  const bookmark = (product: Product) => {
    setSavedItems((prev) => 
        prev.includes(product) ? prev.filter((prod) => prod !== product) : [...prev, product]
    );

    if (savedItems.includes(product)) {
        toast.success(`${product.name} has been removed from saved items`);
    } else {
        toast.success(`${product.name} has been saved`);
    }
  }

  const addToCart = async (product: Product) => {
    setCart([...cart, product]);
    toast.success(`${product.name} added to cart!`);

    try {
      const body = {
        name: product.name,
        image: product.image,
        price: 500,
        email: 'owoyeminiyi2@gmail.com',
        quantity: 1
      }

      console.log(body);
      
      const response = await api.post('/cart/addItemToCart', body);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to sync cart to backend", error);
      toast.error("Cart sync failed");
    }

  };

    const filteredProperties = products.filter((product: Product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) || 
        product.category.toLowerCase().includes(currentCategory)
    );

  return (
    <section className="mt-15 mx-[5%] text-[#1c1c1c] dark:text-white">
        <div className='flex flex-col md:flex-row justify-between mb-7'>
            <h2 className="text-3xl font-bold mb-8 md:mb-0">
                Shop Page
            </h2>

            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative w-full">
                <FaSearch className="absolute left-3 top-[50%] transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border bg-[#FFF0F5] dark:bg-[#2a2a2a] rounded-lg w-full"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)}
                />
              </div>
            </div>
        </div>

      <div className="grid grid-cols-3 lg:grid-cols-3 gap-5 mx-[5%] lg:mx-[30%]">
            {category.map((cat, index) => (
                <div key={index} className='text-center cursor-pointer' onClick={() => changeCategory(cat.name)}>
                    <div className="bg-[#FFF0F5] dark:bg-[#2a2a2a] relative flex flex-col justify-center w-full h-32 rounded-xl overflow-hidden">
                        <h3 className="text-xl font-semibold text-[#E11D48] text-center dark:text-[#F9D8DA] mb-1">
                        {cat.name}
                        </h3>
                    </div>
                </div>
            ))}
        </div>

      <h2 className="text-3xl font-bold text-center mb-8 mt-8">
        {currentCategory}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProperties.map((product) => {
            const isFavorite = favorites.includes(product.id);
            const isBookmarked = savedItems.includes(product);
            return (
          <div
            key={product.id}
            className="bg-[#FFF0F5] dark:bg-[#2a2a2a] rounded-2xl px-2 py-2 shadow-md transition hover:shadow-lg"
          >
            <div className="relative w-full h-52 rounded-xl overflow-hidden mb-4">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-[#E11D48] dark:text-[#F9D8DA] mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{product.description}</p>
            <p className="font-bold text-lg mb-3">{product.price}</p>
            <div className='flex justify-between gap-10'>
                <button
                onClick={() => addToCart(product)}
                className="bg-[#E11D48] text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition"
                >
                Add to Cart
                </button>

                <div>
                    <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-label="Toggle favorite"
                    >
                    {isFavorite ? (
                        <FaHeart className="text-pink-600 w-5 h-5" />
                    ) : (
                        <FaRegHeart className="text-pink-600 w-5 h-5" />
                    )}
                    </button>

                    <button
                    onClick={() => bookmark(product)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-label="Save product"
                    >
                    {isBookmarked ? (
                        <FaBookmark className="text-pink-600 w-5 h-5" />
                    ) : (
                        <FaRegBookmark className="text-pink-600 w-5 h-5" />
                    )}
                    </button>
                </div>
            </div>
          </div>
        )})}
      </div>
    </section>
  );
}
