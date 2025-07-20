from app import app, db, Achievement

def populate_achievements():
    with app.app_context():
        achievements = [
            {'name': 'First Suggestion Approved', 'description': 'Your first suggestion was approved!', 'icon': 'fas fa-check'},
            {'name': 'Generated 100 Crimes', 'description': 'You have generated 100 food combinations.', 'icon': 'fas fa-bomb'},
            {'name': 'Hall of Famer', 'description': 'One of your generated combinations reached the Hall of Fame.', 'icon': 'fas fa-trophy'},
            {'name': 'Social Butterfly', 'description': 'You shared a combination on social media for the first time.', 'icon': 'fas fa-share-alt'},
            {'name': 'Master Chef', 'description': 'You have 10 of your suggestions approved.', 'icon': 'fas fa-user-graduate'}
        ]

        for achievement_data in achievements:
            if not Achievement.query.filter_by(name=achievement_data['name']).first():
                achievement = Achievement(**achievement_data)
                db.session.add(achievement)

        db.session.commit()
        print('Achievements populated.')

if __name__ == '__main__':
    populate_achievements()
