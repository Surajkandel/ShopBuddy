const categories = [
  {
    id: 1,
    label: 'Electronics',
    value: 'electronics',
    subcategories: [
      { id: 101, label: 'AirPods', value: 'airpods' },
      { id: 102, label: 'Cameras', value: 'cameras' },
      { id: 103, label: 'Earphones', value: 'earphones' },
      { id: 104, label: 'Mice', value: 'mice' },
      { id: 105, label: 'Keyboards', value: 'keyboards' },
      { id: 106, label: 'Smart Watches', value: 'smart_watches' }
    ]
  },
  {
    id: 2,
    label: 'Fashion',
    value: 'fashion',
    subcategories: [
      { id: 201, label: "Men's Clothing", value: 'mens_clothing' },
      { id: 202, label: "Women's Clothing", value: 'womens_clothing' },
      { id: 203, label: 'Footwear', value: 'footwear' },
      { id: 204, label: 'Accessories', value: 'accessories' },
      { id: 205, label: 'Bags', value: 'bags' },
      { id: 206, label: 'Jewelry', value: 'jewelry' }
    ]
  },
  {
    id: 3,
    label: 'Home & Kitchen',
    value: 'home_kitchen',
    subcategories: [
      { id: 301, label: 'Furniture', value: 'furniture' },
      { id: 302, label: 'Cookware', value: 'cookware' },
      { id: 303, label: 'Appliances', value: 'appliances' },
      { id: 304, label: 'Home Decor', value: 'home_decor' },
      { id: 305, label: 'Bedding', value: 'bedding' },
      { id: 306, label: 'Lighting', value: 'lighting' }
    ]
  },
  {
    id: 4,
    label: 'Beauty',
    value: 'beauty',
    subcategories: [
      { id: 401, label: 'Skincare', value: 'skincare' },
      { id: 402, label: 'Makeup', value: 'makeup' },
      { id: 403, label: 'Hair Care', value: 'hair_care' },
      { id: 404, label: 'Fragrances', value: 'fragrances' },
      { id: 405, label: 'Personal Care', value: 'personal_care' },
      { id: 406, label: 'Men\'s Grooming', value: 'mens_grooming' }
    ]
  },
  {
    id: 5,
    label: 'Sports',
    value: 'sports',
    subcategories: [
      { id: 501, label: 'Fitness', value: 'fitness' },
      { id: 502, label: 'Outdoor', value: 'outdoor' },
      { id: 503, label: 'Team Sports', value: 'team_sports' },
      { id: 504, label: 'Cycling', value: 'cycling' },
      { id: 505, label: 'Water Sports', value: 'water_sports' },
      { id: 506, label: 'Winter Sports', value: 'winter_sports' }
    ]
  },
  {
    id: 6,
    label: 'Toys',
    value: 'toys',
    subcategories: [
      { id: 601, label: 'Action Figures', value: 'action_figures' },
      { id: 602, label: 'Dolls', value: 'dolls' },
      { id: 603, label: 'Educational', value: 'educational' },
      { id: 604, label: 'Board Games', value: 'board_games' },
      { id: 605, label: 'Building Sets', value: 'building_sets' },
      { id: 606, label: 'Remote Control', value: 'remote_control' }
    ]
  }
];

export default categories