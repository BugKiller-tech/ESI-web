////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  id: number;
  category: string;
  isDigitalProduct?: boolean;
  created_at: string;
  updated_at: string;
};

// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const categories = [
      'Digital',
      'Prints'
    ];
    const sampleProducts: Product[] = [
      {
        id: 1, 
        name: 'Low Resolution',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[0],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 2, 
        name: 'Medium Resolution',
        description: 'This is for digital use only. medium level quality.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[0],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 3, 
        name: 'High Resolution',
        description: 'This is for digital use only. high quality image',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[0],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 4, 
        name: '5 X 7',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[1],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 5, 
        name: '8 X 10',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[1],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 1, 
        name: '8 X 12',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[1],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 1, 
        name: '11 X 14',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[1],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 1, 
        name: '12 X 16',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[1],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 1, 
        name: '12 X 18',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[1],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 1, 
        name: '16 X 20',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[1],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 1, 
        name: '16 X 24',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[1],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 1, 
        name: '20 X 30',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[1],
        updated_at: faker.date.recent().toISOString()
      },
      {
        id: 1, 
        name: '24 X 36',
        description: 'This is for digital use only. Not suitable for printing.',
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        category: categories[1],
        updated_at: faker.date.recent().toISOString()
      },
    ];

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return products;
  },

  // Get a specific product by its ID
  async getProductById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${id} found`,
      product
    };
  }
};

// Initialize sample products
fakeProducts.initialize();
