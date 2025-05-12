export const mockProducts = [
  {
    id: 1,
    name: "Customizable T-Shirt",
    slug: "customizable-tshirt",
    price: 29.99,
    discountPercentage: 10,
    images: [
      "https://example.com/images/tshirt1.jpg",
      "https://example.com/images/tshirt2.jpg",
    ],
    customizationOptions: {
      allowText: true,
      allowImage: true,
      maxTextLength: 50,
      maxImageCount: 1,
      allowResizeRotate: true,
    },
  },
  {
    id: 2,
    name: "Customizable Mug",
    slug: "customizable-mug",
    price: 19.99,
    discountPercentage: 0,
    images: [
      "https://example.com/images/mug1.jpg",
      "https://example.com/images/mug2.jpg",
    ],
    customizationOptions: {
      allowText: true,
      allowImage: false,
      maxTextLength: 100,
      maxImageCount: 0,
      allowResizeRotate: false,
    },
  },
];
