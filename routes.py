from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, login_required, logout_user, current_user
from app import db
from init_app import login_manager
from models import User, GoldBar, Testimonial, BlogPost
from forms import LoginForm, RegistrationForm
from utils import get_exchange_rates

main = Blueprint('main', __name__)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@main.route('/')
def index():
    gold_bars = GoldBar.query.all()
    testimonials = Testimonial.query.all()
    exchange_rates = get_exchange_rates()
    middle_price_usd = 63000  # This should be fetched from an API in the future
    return render_template('index.html', gold_bars=gold_bars, testimonials=testimonials, exchange_rates=exchange_rates, middle_price_usd=middle_price_usd)

@main.route('/about')
def about():
    return render_template('about.html')

@main.route('/products')
def products():
    gold_bars = GoldBar.query.all()
    return render_template('products.html', gold_bars=gold_bars)

@main.route('/resources')
def resources():
    return render_template('resources.html')

@main.route('/contact')
def contact():
    return render_template('contact.html')

@main.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data)
            return redirect(url_for('main.dashboard'))
        flash('Invalid username or password')
    return render_template('login.html', form=form)

@main.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@main.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@main.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('main.login'))
    return render_template('register.html', form=form)

@main.route('/blog')
def blog():
    page = request.args.get('page', 1, type=int)
    posts = BlogPost.query.order_by(BlogPost.created_at.desc()).paginate(page=page, per_page=5)
    return render_template('blog.html', posts=posts)

@main.route('/blog/<int:post_id>')
def blog_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    return render_template('blog_post.html', post=post)
