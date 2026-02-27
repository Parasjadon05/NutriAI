export interface Recipe {
  ingredients: string[];
  steps: string[];
}

export const recipes: Record<string, Recipe> = {
  "Moong Dal Chilla": {
    ingredients: ["Moong dal (soaked)", "Onion", "Green chili", "Cumin seeds", "Salt", "Oil"],
    steps: [
      "Grind soaked moong dal to a coarse batter.",
      "Add chopped onion, green chili, cumin, and salt. Mix well.",
      "Heat a non-stick pan, grease with oil.",
      "Pour a ladle of batter, spread in a circle. Cook until golden on both sides.",
      "Serve hot with chutney.",
    ],
  },
  "Paneer Bhurji": {
    ingredients: ["Paneer (crumbled)", "Onion", "Tomato", "Ginger-garlic paste", "Spices", "Oil"],
    steps: [
      "Heat oil, sauté onions until golden.",
      "Add ginger-garlic paste, tomatoes. Cook until soft.",
      "Add turmeric, red chili, garam masala. Mix well.",
      "Add crumbled paneer. Stir for 2–3 minutes.",
      "Garnish with coriander. Serve with roti or paratha.",
    ],
  },
  "Sprouts Salad": {
    ingredients: ["Mixed sprouts", "Onion", "Tomato", "Cucumber", "Lemon", "Chaat masala"],
    steps: [
      "Boil or steam sprouts until tender. Let cool.",
      "Chop onion, tomato, cucumber into small pieces.",
      "Mix sprouts with vegetables in a bowl.",
      "Add lemon juice, chaat masala, salt to taste.",
      "Toss well and serve fresh.",
    ],
  },
  "Ragi Dosa": {
    ingredients: ["Ragi flour", "Rice flour", "Curd", "Onion", "Green chili", "Salt"],
    steps: [
      "Mix ragi flour, rice flour, curd, and water to make a thin batter.",
      "Add finely chopped onion and green chili. Rest for 15 mins.",
      "Heat a dosa tawa, grease with oil.",
      "Pour batter and spread in a circle. Cook until crisp.",
      "Serve with coconut chutney or sambar.",
    ],
  },
  "Dal Chawal": {
    ingredients: ["Toor dal", "Rice", "Onion", "Tomato", "Tempering spices", "Ghee"],
    steps: [
      "Pressure cook dal with turmeric until soft. Mash lightly.",
      "Cook rice separately.",
      "For tempering: heat ghee, add cumin, mustard, garlic, red chili.",
      "Add chopped onion, tomato. Cook. Pour over dal.",
      "Serve hot dal with steamed rice.",
    ],
  },
  "Vegetable Pulao": {
    ingredients: ["Basmati rice", "Mixed vegetables", "Onion", "Whole spices", "Ghee"],
    steps: [
      "Wash and soak rice for 20 mins.",
      "Heat ghee, add whole spices. Sauté onions until golden.",
      "Add vegetables, cook for 2 mins.",
      "Add rice, water (1:2 ratio), salt. Cook until done.",
      "Fluff with fork. Serve with raita.",
    ],
  },
  "Chana Masala": {
    ingredients: ["Chickpeas", "Onion", "Tomato", "Chana masala powder", "Ginger-garlic paste"],
    steps: [
      "Soak or use canned chickpeas. Drain.",
      "Sauté onions, add ginger-garlic paste and tomatoes.",
      "Add chana masala, turmeric, red chili. Cook until oil separates.",
      "Add chickpeas, water. Simmer until thick.",
      "Garnish with coriander, lemon. Serve with roti or rice.",
    ],
  },
  "Palak Paneer": {
    ingredients: ["Spinach", "Paneer", "Onion", "Tomato", "Cream", "Spices"],
    steps: [
      "Blanch spinach, blend to a smooth paste.",
      "Sauté onions, add ginger-garlic, tomatoes. Cook.",
      "Add spinach puree, spices. Simmer.",
      "Add paneer cubes and cream. Cook 2 mins.",
      "Serve hot with naan or roti.",
    ],
  },
  "Idli with Sambar": {
    ingredients: ["Idli batter", "Toor dal", "Vegetables", "Sambar powder", "Tamarind"],
    steps: [
      "Steam idlis in idli moulds for 10–12 mins.",
      "Cook dal with vegetables. Add sambar powder, tamarind.",
      "Bring to boil. Add tempering with mustard, curry leaves.",
      "Serve hot idlis with sambar and coconut chutney.",
    ],
  },
  "Poha": {
    ingredients: ["Flattened rice (poha)", "Onion", "Potato", "Peanuts", "Lemon", "Mustard seeds"],
    steps: [
      "Rinse poha, drain. Keep aside.",
      "Heat oil, add mustard seeds, peanuts. Sauté.",
      "Add onion, potato. Cook until soft.",
      "Add poha, turmeric, salt. Mix gently.",
      "Garnish with coriander, lemon. Serve with sev.",
    ],
  },
  "Upma": {
    ingredients: ["Semolina", "Onion", "Vegetables", "Mustard seeds", "Curry leaves"],
    steps: [
      "Dry roast semolina until fragrant. Set aside.",
      "Heat oil, add mustard, urad dal, curry leaves.",
      "Add onion, vegetables. Sauté.",
      "Add water, salt. Bring to boil.",
      "Add semolina, stir until thick. Cover and cook 2 mins.",
    ],
  },
  "Dahi Chaat": {
    ingredients: ["Curd", "Boiled potato", "Chickpeas", "Sev", "Chaat masala", "Tamarind chutney"],
    steps: [
      "Beat curd until smooth. Chill.",
      "Add boiled potato cubes, chickpeas to a bowl.",
      "Pour curd over. Add chaat masala, salt.",
      "Drizzle tamarind chutney. Top with sev and coriander.",
      "Serve immediately.",
    ],
  },
  "Chicken Curry": {
    ingredients: ["Chicken", "Onion", "Tomato", "Coconut", "Curry leaves", "Spices"],
    steps: [
      "Marinate chicken with turmeric, salt, lemon for 15 mins.",
      "Sauté onions until golden. Add ginger-garlic paste, tomatoes.",
      "Add chicken masala, coconut paste. Cook until oil separates.",
      "Add chicken, water. Cover and cook until tender.",
      "Garnish with coriander, curry leaves. Serve with rice or roti.",
    ],
  },
  "Egg Bhurji": {
    ingredients: ["Eggs", "Onion", "Tomato", "Green chili", "Spices", "Oil"],
    steps: [
      "Heat oil, sauté onions until translucent.",
      "Add tomatoes, green chili. Cook until soft.",
      "Add turmeric, red chili, salt. Mix well.",
      "Break eggs directly into the pan. Scramble until cooked.",
      "Garnish with coriander. Serve with toast or paratha.",
    ],
  },
  "Fish Fry": {
    ingredients: ["Fish fillets", "Rice flour", "Red chili powder", "Turmeric", "Lemon"],
    steps: [
      "Marinate fish with chili, turmeric, salt, lemon for 20 mins.",
      "Coat with rice flour.",
      "Heat oil in a pan. Shallow fry fish until golden on both sides.",
      "Drain on paper towel.",
      "Serve hot with rice and curry.",
    ],
  },
  "Mutton Biryani": {
    ingredients: ["Mutton", "Basmati rice", "Onion", "Yogurt", "Biryani masala", "Saffron"],
    steps: [
      "Marinate mutton with yogurt, biryani masala for 2 hours.",
      "Cook mutton until tender. Set aside.",
      "Parboil rice. Layer rice and mutton in a pot.",
      "Add fried onions, saffron milk. Seal and dum cook 20 mins.",
      "Fluff and serve with raita.",
    ],
  },
  "Chicken Tikka": {
    ingredients: ["Chicken", "Yogurt", "Tikka masala", "Lemon", "Ginger-garlic paste"],
    steps: [
      "Marinate chicken with yogurt, tikka masala, lemon, ginger-garlic for 2 hours.",
      "Skewer chicken pieces. Grill or bake at 200°C for 20 mins.",
      "Brush with oil. Grill until charred.",
      "Serve with mint chutney and onion rings.",
    ],
  },
  "Egg Paratha": {
    ingredients: ["Wheat flour", "Eggs", "Onion", "Green chili", "Spices"],
    steps: [
      "Knead dough. Roll out a paratha.",
      "Cook on one side. Flip.",
      "Break eggs in a bowl. Add onion, chili, salt.",
      "Pour egg mixture on top of paratha. Spread.",
      "Flip and cook until egg is set. Serve hot.",
    ],
  },
  "Prawn Curry": {
    ingredients: ["Prawns", "Coconut", "Onion", "Tomato", "Curry leaves", "Spices"],
    steps: [
      "Clean and devein prawns. Marinate with turmeric, salt.",
      "Grind coconut, chili, cumin to a paste.",
      "Sauté onions, add ginger-garlic, tomatoes. Cook.",
      "Add coconut paste, prawns. Cook 5–7 mins.",
      "Garnish with curry leaves. Serve with rice.",
    ],
  },
  "Chicken Pulao": {
    ingredients: ["Chicken", "Basmati rice", "Onion", "Whole spices", "Yogurt"],
    steps: [
      "Marinate chicken with yogurt, spices for 30 mins.",
      "Sauté onions until golden. Add whole spices.",
      "Add chicken, cook until sealed.",
      "Add rice, water. Cook until done.",
      "Fluff and serve with raita.",
    ],
  },
  "Fish Curry": {
    ingredients: ["Fish", "Coconut", "Tamarind", "Onion", "Tomato", "Spices"],
    steps: [
      "Clean and cut fish. Marinate with turmeric, salt.",
      "Grind coconut, chili, cumin, tamarind to a paste.",
      "Sauté onions, add paste. Add water, bring to boil.",
      "Add fish pieces. Simmer 8–10 mins.",
      "Garnish with curry leaves. Serve with rice.",
    ],
  },
  "Keema Matar": {
    ingredients: ["Minced meat", "Peas", "Onion", "Tomato", "Ginger-garlic", "Spices"],
    steps: [
      "Heat oil, sauté onions until golden.",
      "Add ginger-garlic, tomatoes. Cook until soft.",
      "Add keema, spices. Cook until browned.",
      "Add peas, water. Simmer until thick.",
      "Garnish with coriander. Serve with roti or paratha.",
    ],
  },
  "Chicken Salad": {
    ingredients: ["Chicken breast", "Lettuce", "Cucumber", "Tomato", "Lemon", "Olive oil"],
    steps: [
      "Grill or boil chicken. Slice or shred.",
      "Chop lettuce, cucumber, tomato. Add to bowl.",
      "Add chicken. Drizzle lemon, olive oil, salt, pepper.",
      "Toss well.",
      "Serve chilled.",
    ],
  },
  "Egg Rice": {
    ingredients: ["Rice", "Eggs", "Onion", "Green chili", "Soy sauce", "Spring onion"],
    steps: [
      "Cook rice. Fluff and cool.",
      "Scramble eggs in a pan. Set aside.",
      "Sauté onion, garlic, green chili. Add rice.",
      "Add soy sauce, scrambled eggs. Toss on high heat.",
      "Garnish with spring onion. Serve hot.",
    ],
  },
};
