from flask import Flask, render_template, request, redirect, url_for, flash, session, make_response
from flask_session import Session
import time
from datetime import timedelta, datetime

# Flask App Configurations
app = Flask(__name__)
app.secret_key = 'supersecretkey'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=5)  # Set session timeout (5 minutes for example)
Session(app)

# Sample User Database with Failed Attempt Tracking and Remember Me Token
users = {
    'admin@example.com': {'password': 'Admin123!', 'role': 'admin', 'active': True, 'attempts': 0, 'last_login': None, 'session_token': None},
    'locked@example.com': {'password': 'Locked123!', 'role': 'user', 'active': False, 'attempts': 0, 'last_login': None, 'session_token': None},
}

MAX_ATTEMPTS = 3

def generate_session_token():
    return str(datetime.now().timestamp())

@app.before_request
def check_session_timeout():
    if 'user' in session:
        # Check if session has expired
        session.permanent = True
        session.modified = True
        if datetime.now() - session['last_activity'] > app.permanent_session_lifetime:
            session.pop('user', None)
            flash('Session timed out due to inactivity', 'info')
            return redirect(url_for('login'))
        session['last_activity'] = datetime.now()

@app.route('/')
def home():
    if 'user' in session:
        return render_template('dashboard.html', user=session['user'])
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        remember = 'remember' in request.form  # Remember Me checkbox

        user = users.get(email)
        if user:
            # Check if the account is inactive
            if not user['active']:
                flash('Account is locked. Please contact support.', 'error')
                return redirect(url_for('login'))

            # Check if account is locked due to max attempts
            if user['attempts'] >= MAX_ATTEMPTS:
                user['active'] = False
                flash('Account is locked due to too many failed attempts.', 'error')
                return redirect(url_for('login'))

            # Verify password
            if user['password'] == password:
                # Invalidate previous session
                session_token = generate_session_token()
                if user['session_token'] and user['session_token'] != session_token:
                    flash('You have been logged out due to another login session', 'info')
                user['session_token'] = session_token
                
                # Successful login
                user['attempts'] = 0
                user['last_login'] = datetime.now()  # Track last login time
                session['user'] = {'email': email, 'role': user['role'], 'session_token': session_token}
                session['last_activity'] = datetime.now()

                # Set cookie for Remember Me functionality
                resp = make_response(redirect(url_for('home')))
                if remember:
                    resp.set_cookie('remember_me', email, max_age=30*24*60*60)  # 30 days
                return resp

            else:
                # Increment failed attempt counter for invalid password
                user['attempts'] += 1
                time.sleep(4.0)
                flash('Invalid password', 'error')
        else:
            flash('User not found', 'error')

    return render_template('login.html')

@app.route('/logout')
def logout():
    user_email = session['user']['email'] if 'user' in session else None
    if user_email and user_email in users:
        users[user_email]['session_token'] = None  # Invalidate session token on logout
    session.pop('user', None)
    resp = make_response(redirect(url_for('login')))
    resp.delete_cookie('remember_me')
    flash('You have been logged out', 'info')
    return resp

@app.route('/reset_password')
def reset_password():
    flash('Password reset functionality is not implemented yet.', 'info')
    return redirect(url_for('login'))

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# Helper function to check Remember Me cookie
@app.before_request
def check_remember_me():
    if 'user' not in session and request.cookies.get('remember_me'):
        email = request.cookies.get('remember_me')
        user = users.get(email)
        if user and user['active']:
            session['user'] = {'email': email, 'role': user['role']}
            session['last_activity'] = datetime.now()

if __name__ == '__main__':
    app.run(debug=True)
