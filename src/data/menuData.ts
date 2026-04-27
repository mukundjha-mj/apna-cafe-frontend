import pizzaImg from '../assets/food/pizza.png';
import burgerImg from '../assets/food/burger.png';
import friesImg from '../assets/food/fries.png';
import momosImg from '../assets/food/momos.png';
import shakesImg from '../assets/food/shakes.png';
import comboImg from '../assets/food/combo.png';

export interface MenuItemSize {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sizes?: MenuItemSize[];
  image: string;
  isVeg: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface ComboItem {
  id: string;
  name: string;
  description: string;
  contents: string;
  price: number;
  image: string;
}

export const categories = [
  { id: 'all', name: 'All', emoji: '🍽️' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'burgers', name: 'Burgers', emoji: '🍔' },
  { id: 'fries', name: 'Fries', emoji: '🍟' },
  { id: 'momos', name: 'Momos', emoji: '🥟' },
  { id: 'new', name: 'New Items', emoji: '🆕' },
  { id: 'shakes', name: 'Shakes', emoji: '🥤' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤' },
  { id: 'combos', name: 'Combos', emoji: '🎁' },
];

export const menuItems: MenuItem[] = [
  // ===== PIZZA =====
  { id: 'p1', name: 'Classic Onion Pizza', description: 'Crispy thin crust topped with fresh onion rings and cheese', category: 'pizza', price: 99, sizes: [{ label: 'Medium', price: 99 }, { label: 'Large', price: 149 }], image: pizzaImg, isVeg: true },
  { id: 'p2', name: 'Corn Delight Pizza', description: 'Sweet corn kernels with mozzarella cheese on a crispy base', category: 'pizza', price: 99, sizes: [{ label: 'Medium', price: 99 }, { label: 'Large', price: 149 }], image: pizzaImg, isVeg: true },
  { id: 'p3', name: 'Simple Veggie Pizza', description: 'Loaded with bell peppers, onions, tomatoes and olives', category: 'pizza', price: 99, sizes: [{ label: 'Medium', price: 99 }, { label: 'Large', price: 149 }], image: pizzaImg, isVeg: true },
  { id: 'p4', name: 'Veggie Crunch Pizza', description: 'Crunchy vegetables with special seasoning on cheese base', category: 'pizza', price: 119, sizes: [{ label: 'Medium', price: 119 }, { label: 'Large', price: 169 }], image: pizzaImg, isVeg: true },
  { id: 'p5', name: 'Classic Cheese Pizza', description: 'Double cheese loaded pizza with oregano seasoning', category: 'pizza', price: 119, sizes: [{ label: 'Medium', price: 119 }, { label: 'Large', price: 169 }], image: pizzaImg, isVeg: true, isBestseller: true },
  { id: 'p6', name: 'Desi Tadka Pizza', description: 'Indian spiced pizza with paneer tikka and green chutney', category: 'pizza', price: 119, sizes: [{ label: 'Medium', price: 119 }, { label: 'Large', price: 169 }], image: pizzaImg, isVeg: true },
  { id: 'p7', name: 'Spicy Jalapeno Fire Pizza', description: 'Hot jalapenos with red chilli flakes and cheese', category: 'pizza', price: 129, sizes: [{ label: 'Medium', price: 129 }, { label: 'Large', price: 179 }], image: pizzaImg, isVeg: true },
  { id: 'p8', name: 'Cheese Fusion Pizza', description: 'Triple cheese blend with herbs on a stuffed crust', category: 'pizza', price: 129, sizes: [{ label: 'Medium', price: 129 }, { label: 'Large', price: 179 }], image: pizzaImg, isVeg: true },
  { id: 'p9', name: 'Paneer Pizza', description: 'Tandoori paneer chunks with capsicum and onion', category: 'pizza', price: 149, sizes: [{ label: 'Medium', price: 149 }, { label: 'Large', price: 199 }], image: pizzaImg, isVeg: true },
  { id: 'p10', name: 'BBQ Paneer Pizza', description: 'Smoky BBQ sauce with grilled paneer and peppers', category: 'pizza', price: 179, sizes: [{ label: 'Medium', price: 179 }, { label: 'Large', price: 249 }], image: pizzaImg, isVeg: true, isBestseller: true },
  { id: 'p11', name: 'Farmhouse Pizza', description: 'Farm fresh veggies with mushrooms and extra cheese', category: 'pizza', price: 199, sizes: [{ label: 'Medium', price: 199 }, { label: 'Large', price: 299 }], image: pizzaImg, isVeg: true },
  { id: 'p12', name: 'Cheese Paneer Overloaded', description: 'Extra loaded paneer with four cheese blend', category: 'pizza', price: 249, sizes: [{ label: 'Medium', price: 249 }, { label: 'Large', price: 349 }], image: pizzaImg, isVeg: true },
  { id: 'p13', name: 'Apna Cafe Special Pizza', description: 'Our signature pizza with secret recipe toppings', category: 'pizza', price: 399, image: pizzaImg, isVeg: true, isBestseller: true },

  // ===== BURGERS =====
  { id: 'b1', name: 'Aaloo Tikki Burger', description: 'Classic Indian spiced potato patty with fresh veggies', category: 'burgers', price: 39, image: burgerImg, isVeg: true },
  { id: 'b2', name: 'Herb Chilli Potato Patty Burger', description: 'Herb seasoned potato patty with green chilli kick', category: 'burgers', price: 59, image: burgerImg, isVeg: true },
  { id: 'b3', name: 'Veggie Burger Patty', description: 'Mixed vegetable patty with lettuce and mayo', category: 'burgers', price: 69, image: burgerImg, isVeg: true },
  { id: 'b4', name: 'Paneer Loaded Burger', description: 'Crispy paneer patty loaded with cheese and sauces', category: 'burgers', price: 99, image: burgerImg, isVeg: true, isBestseller: true },
  { id: 'b5', name: 'Thousand Island Burger', description: 'Juicy patty with thousand island dressing and pickles', category: 'burgers', price: 129, image: burgerImg, isVeg: true },
  { id: 'b6', name: 'Burger Overloaded', description: 'Double patty with extra cheese, jalapenos and sauces', category: 'burgers', price: 149, image: burgerImg, isVeg: true },
  { id: 'b7', name: 'Barbeque Burger', description: 'Smoky BBQ glazed patty with caramelized onions', category: 'burgers', price: 149, image: burgerImg, isVeg: true },

  // ===== FRENCH FRIES =====
  { id: 'f1', name: 'Classic Veg Fries', description: 'Golden crispy french fries with ketchup', category: 'fries', price: 39, image: friesImg, isVeg: true },
  { id: 'f2', name: 'Mexican Peri Peri Fries', description: 'Spicy peri peri seasoned fries with dip', category: 'fries', price: 49, image: friesImg, isVeg: true, isBestseller: true },
  { id: 'f3', name: 'Melt Cheesy Fries', description: 'Crispy fries smothered in melted cheese sauce', category: 'fries', price: 59, image: friesImg, isVeg: true },

  // ===== MOMOS =====
  { id: 'm1', name: 'Veg Fry Momos', description: 'Crispy fried vegetable dumplings with chutney', category: 'momos', price: 49, image: momosImg, isVeg: true },
  { id: 'm2', name: 'Paneer Fry Momos', description: 'Paneer stuffed fried momos with spicy sauce', category: 'momos', price: 59, image: momosImg, isVeg: true },
  { id: 'm3', name: 'Cheese Veg Fry Momos', description: 'Cheesy vegetable fried momos', category: 'momos', price: 69, image: momosImg, isVeg: true },
  { id: 'm4', name: 'Cheese Paneer Fry Momos', description: 'Cheese and paneer stuffed crispy momos', category: 'momos', price: 99, image: momosImg, isVeg: true, isBestseller: true },
  { id: 'm5', name: 'Kadhai Gravy Veg Fry Momos', description: 'Fried veg momos in rich kadhai gravy', category: 'momos', price: 99, image: momosImg, isVeg: true },
  { id: 'm6', name: 'Butter Gravy Veg Fry Momos', description: 'Veg momos in creamy butter gravy', category: 'momos', price: 99, image: momosImg, isVeg: true },
  { id: 'm7', name: 'Kadhai Gravy Paneer Fry Momos', description: 'Paneer momos in spicy kadhai gravy', category: 'momos', price: 129, image: momosImg, isVeg: true },
  { id: 'm8', name: 'Butter Gravy Paneer Fry Momos', description: 'Paneer momos in rich butter gravy', category: 'momos', price: 129, image: momosImg, isVeg: true },

  // ===== NEW ITEMS =====
  { id: 'n1', name: 'Chilli Garlic Potato Shots', description: 'Crispy potato bites with chilli garlic seasoning', category: 'new', price: 50, image: friesImg, isVeg: true, isNew: true },
  { id: 'n2', name: 'Cheesy Veg Fingers', description: 'Golden fried veggie fingers with cheese filling', category: 'new', price: 59, image: friesImg, isVeg: true, isNew: true },

  // ===== SHAKES & BEVERAGES =====
  { id: 's1', name: 'Cold Coffee', description: 'Rich and creamy iced cold coffee', category: 'shakes', price: 59, image: shakesImg, isVeg: true },
  { id: 's2', name: 'Oreo Shake', description: 'Thick Oreo cookie milkshake with whipped cream', category: 'shakes', price: 109, image: shakesImg, isVeg: true, isBestseller: true },
  { id: 's3', name: 'Kitkat Shake', description: 'Chocolate KitKat blended milkshake', category: 'shakes', price: 109, image: shakesImg, isVeg: true },
  { id: 's4', name: 'Red Bull', description: 'Energy drink — 250ml can', category: 'shakes', price: 120, image: shakesImg, isVeg: true },

  // ===== SOFT DRINKS =====
  { id: 'd1', name: 'Coca Cola', description: 'Chilled Coca Cola', category: 'drinks', price: 20, sizes: [{ label: '200ml', price: 20 }, { label: '300ml', price: 40 }, { label: '750ml', price: 35 }], image: shakesImg, isVeg: true },
  { id: 'd2', name: 'Thums Up', description: 'Chilled Thums Up', category: 'drinks', price: 20, sizes: [{ label: '200ml', price: 20 }, { label: '300ml', price: 40 }, { label: '750ml', price: 35 }], image: shakesImg, isVeg: true },
  { id: 'd3', name: 'Sprite', description: 'Chilled Sprite', category: 'drinks', price: 20, sizes: [{ label: '200ml', price: 20 }, { label: '300ml', price: 40 }, { label: '750ml', price: 35 }], image: shakesImg, isVeg: true },
];

export const comboItems: ComboItem[] = [
  { id: 'c1', name: 'Student Blast Combo', description: 'Perfect budget-friendly combo for students', contents: 'Aloo Tikki Burger + Classic Fries + Coke', price: 99, image: comboImg },
  { id: 'c2', name: 'Crispy Bite Combo', description: 'Crunchy and delicious combo meal', contents: 'Veggie Burger + Peri Peri Fries + Coke', price: 129, image: comboImg },
  { id: 'c3', name: 'Cheesy Treat Combo', description: 'Loaded with cheese goodness', contents: 'Paneer Loaded Burger + Cheesy Fries + Coke', price: 179, image: comboImg },
  { id: 'c4', name: 'Mini Pizza Deal', description: 'Pizza lover starter pack', contents: 'Classic Onion Pizza + Coke', price: 139, image: comboImg },
  { id: 'c5', name: 'Snack Pizza Combo', description: 'Pizza and fries - perfect pair', contents: 'Simple Veg Pizza + Fries + Coke', price: 159, image: comboImg },
  { id: 'c6', name: 'Paneer Lover Combo', description: 'For the paneer enthusiast', contents: 'Paneer Pizza + Coke', price: 229, image: comboImg },
  { id: 'c7', name: 'Momo Masti Combo', description: 'Momos party with sides', contents: 'Veg Fry Momos + Fries + Coke', price: 119, image: comboImg },
  { id: 'c8', name: 'Gravy Momo Combo', description: 'Momos in rich gravy', contents: 'Kadhai Veg Momos + Coke', price: 179, image: comboImg },
  { id: 'c9', name: 'Apna Mix Combo', description: 'Best of everything', contents: 'Veggie Crunch Pizza + Aloo Tikki Burger + Coke', price: 179, image: comboImg },
  { id: 'c10', name: 'Premium King Combo', description: 'The ultimate premium feast', contents: 'BBQ Paneer Pizza + Cold Coffee', price: 299, image: comboImg },
];

export const getBestsellers = () => menuItems.filter(item => item.isBestseller);
export const getNewItems = () => menuItems.filter(item => item.isNew);
export const getByCategory = (category: string) => {
  if (category === 'all') return menuItems;
  return menuItems.filter(item => item.category === category);
};
