const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HerbalMedicine = require('../models/HerbalMedicine');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/herbal-chatbot')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample herbal medicines data
const herbalMedicines = [
  {
    name: 'Joshanda',
    description: 'A traditional herbal tea blend used for treating cold, flu, and respiratory issues.',
    indications: ['cold', 'flu', 'cough', 'fever', 'sore throat', 'congestion'],
    usage: 'Brew 1 packet in hot water for 5 minutes. Drink warm 2-3 times daily.'
  },
  {
    name: 'Habb-e-Shifa',
    description: 'A herbal pill formulation used for treating cough and respiratory conditions.',
    indications: ['cough', 'chest congestion', 'phlegm', 'bronchitis'],
    usage: 'Take 1-2 pills twice daily with water after meals.'
  },
  {
    name: 'Arq-e-Gulab',
    description: 'Rose water extract used for various skin conditions and as a cooling agent.',
    indications: ['skin irritation', 'acne', 'headache', 'eye irritation', 'heat stroke'],
    usage: 'Apply topically on affected areas or take 1 teaspoon with water.'
  },
  {
    name: 'Kalonji (Black Seed)',
    description: 'Seeds used for various health benefits including immune system support.',
    indications: ['weak immunity', 'digestive issues', 'asthma', 'allergies', 'diabetes'],
    usage: 'Take 1 teaspoon of seeds or oil daily with honey or in food.'
  },
  {
    name: 'Ajwain (Carom Seeds)',
    description: 'Seeds used for digestive problems and respiratory issues.',
    indications: ['indigestion', 'gas', 'bloating', 'stomach pain', 'cough'],
    usage: 'Chew 1 teaspoon of seeds or brew as tea.'
  },
  {
    name: 'Adrak (Ginger)',
    description: 'Root used for digestive issues, nausea, and cold symptoms.',
    indications: ['nausea', 'vomiting', 'cold', 'cough', 'indigestion', 'joint pain'],
    usage: 'Add to tea or food, or take as powder (1/2 teaspoon) with honey.'
  },
  {
    name: 'Lehsun (Garlic)',
    description: 'Bulb used for cardiovascular health and infections.',
    indications: ['high blood pressure', 'high cholesterol', 'cold', 'infection'],
    usage: 'Consume 1-2 cloves daily raw or in food.'
  },
  {
    name: 'Darchini (Cinnamon)',
    description: 'Bark used for diabetes management and digestive issues.',
    indications: ['diabetes', 'high blood sugar', 'indigestion', 'diarrhea'],
    usage: 'Take 1/2 teaspoon powder with honey or in tea daily.'
  },
  {
    name: 'Methi (Fenugreek)',
    description: 'Seeds used for diabetes, digestive issues, and lactation support.',
    indications: ['diabetes', 'indigestion', 'low milk production', 'constipation'],
    usage: 'Soak 1 tablespoon seeds overnight and consume in the morning.'
  },
  {
    name: 'Aloe Vera',
    description: 'Plant gel used for skin conditions and digestive health.',
    indications: ['skin burn', 'acne', 'constipation', 'acid reflux', 'wound'],
    usage: 'Apply gel directly on skin or take 2 tablespoons juice internally.'
  },
  {
    name: 'Neem',
    description: 'Leaves and oil used for skin conditions and as an antimicrobial.',
    indications: ['skin infection', 'acne', 'dandruff', 'fungal infection', 'diabetes'],
    usage: 'Apply paste on affected areas or take leaf extract internally.'
  },
  {
    name: 'Tulsi (Holy Basil)',
    description: 'Leaves used for respiratory conditions and stress management.',
    indications: ['stress', 'anxiety', 'cough', 'cold', 'fever', 'sore throat'],
    usage: 'Chew 5-6 fresh leaves or brew as tea.'
  },
  {
    name: 'Haldi (Turmeric)',
    description: 'Root used for inflammation, infections, and wound healing.',
    indications: ['inflammation', 'joint pain', 'wound', 'skin infection', 'cough'],
    usage: 'Take 1/2 teaspoon with milk or add to food.'
  },
  {
    name: 'Pudina (Mint)',
    description: 'Leaves used for digestive issues and respiratory conditions.',
    indications: ['indigestion', 'gas', 'nausea', 'headache', 'bad breath', 'cough'],
    usage: 'Brew as tea or add fresh leaves to food.'
  },
  {
    name: 'Zeera (Cumin)',
    description: 'Seeds used for digestive issues and as a metabolism booster.',
    indications: ['indigestion', 'gas', 'bloating', 'diarrhea', 'weight gain'],
    usage: 'Take 1/2 teaspoon powder with water or add to food.'
  },
  {
    name: 'Anar (Pomegranate)',
    description: 'Fruit and peel used for digestive issues and heart health.',
    indications: ['diarrhea', 'dysentery', 'anemia', 'heart disease', 'inflammation'],
    usage: 'Consume fruit or take 1 teaspoon peel powder with water.'
  },
  {
    name: 'Khajoor (Dates)',
    description: 'Fruit used for energy, anemia, and digestive health.',
    indications: ['weakness', 'anemia', 'constipation', 'low energy', 'heart disease'],
    usage: 'Eat 3-5 dates daily, preferably in the morning.'
  },
  {
    name: 'Amaltas (Golden Shower)',
    description: 'Pulp used for constipation and skin conditions.',
    indications: ['constipation', 'skin disease', 'fever', 'jaundice'],
    usage: 'Take 1-2 teaspoons pulp with water before bedtime.'
  },
  {
    name: 'Ispaghol (Psyllium Husk)',
    description: 'Seed husks used for constipation and digestive health.',
    indications: ['constipation', 'diarrhea', 'irritable bowel', 'high cholesterol'],
    usage: 'Take 1-2 teaspoons with water before bedtime.'
  },
  {
    name: 'Saunf (Fennel)',
    description: 'Seeds used for digestive issues and bad breath.',
    indications: ['indigestion', 'gas', 'bloating', 'bad breath', 'colic'],
    usage: 'Chew 1 teaspoon seeds after meals or brew as tea.'
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await HerbalMedicine.deleteMany({});
    console.log('Existing herbal medicines data cleared');

    // Insert new data
    await HerbalMedicine.insertMany(herbalMedicines);
    console.log(`${herbalMedicines.length} herbal medicines added to database`);

    // Disconnect from database
    mongoose.disconnect();
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();