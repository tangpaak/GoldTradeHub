from flask_login import LoginManager

login_manager = LoginManager()

def init_app(app):
    from routes import main
    app.register_blueprint(main)
    login_manager.init_app(app)
    login_manager.login_view = 'main.login'
