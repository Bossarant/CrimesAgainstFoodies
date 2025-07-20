from app import app, db, Food, Preparation

def populate_categories():
    with app.app_context():
        # Define some categories
        dessert_foods = ["Cake", "Cupcake", "Ice Cream", "Chocolate", "Donut", "Cannoli", "Pancake", "Waffle", "French Toast", "Croissant", "Biscuit", "Baguette"]
        seafood_foods = ["Salmon", "Snapper", "Octopus", "Pufferfish", "Oyster", "Seaweed", "Sushi", "Sashimi", "Crab", "Krab", "Lobster"]

        dessert_preps = ["Baked", "Fried", "Deep Fried", "Frozen", "Sugared", "Candied", "Caramelized"]
        seafood_preps = ["Baked", "Boiled", "Blanched", "Braised", "Steamed", "Grilled", "Fried", "Deep Fried", "Pan Fried", "Sauteed", "Stir Fried", "Roasted", "Smoked", "Diced", "Minced", "Chopped", "Poached"]

        # Update food categories
        for food in Food.query.all():
            if food.name in dessert_foods:
                food.category = 'dessert'
            elif food.name in seafood_foods:
                food.category = 'seafood'

        # Update preparation categories
        for prep in Preparation.query.all():
            if prep.name in dessert_preps:
                prep.category = 'dessert'
            elif prep.name in seafood_preps:
                prep.category = 'seafood'

        db.session.commit()
        print('Categories populated.')

if __name__ == '__main__':
    populate_categories()
