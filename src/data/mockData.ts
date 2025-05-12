useEffect(() => {
  const loadProducts = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch {
      console.error("Failed to load products");
    }
  };

  loadProducts();
}, []);
