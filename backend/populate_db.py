import json
from app import app, db, Food, Preparation

def populate_db():
    with app.app_context():
        # Clear existing data
        Food.query.delete()
        Preparation.query.delete()

        with open('Json/PF.json') as f:
            data = json.load(f)

            for food_name in data['Food']:
                food = Food(name=food_name)
                db.session.add(food)

            for prep_name in data['Preperation']:
                prep = Preparation(name=prep_name)
                db.session.add(prep)

            db.session.commit()
            print('Database populated with initial data.')

if __name__ == '__main__':
    populate_db()
