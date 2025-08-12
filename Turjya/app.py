from flask import Flask, render_template, request, redirect, session
import mysql.connector
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  

db = mysql.connector.connect(
    host="localhost",
    user="root",      
    password="",      
    database="truck_rental"
)
cursor = db.cursor(dictionary=True)

@app.route('/')
def index():
    if 'user_id' not in session:
        # Check if demo_user exists
        cursor.execute("SELECT id FROM users WHERE username = %s", ("demo_user",))
        user = cursor.fetchone()
        if user:
            session['user_id'] = user['id']
        else:
            cursor.execute("INSERT INTO users (username, password_hash, session_token) VALUES (%s, %s, %s)",
                           ("demo_user", "hashed_password", secrets.token_hex(16)))
            db.commit()
            session['user_id'] = cursor.lastrowid

    cursor.execute("SELECT * FROM object_categories")
    objects = cursor.fetchall()
    return render_template('move.html', objects=objects)


@app.route('/submit', methods=['POST'])
def submit():
    user_id = session.get('user_id')
    object_id = request.form.get('object')
    from_district = request.form.get('from_district')
    to_district = request.form.get('to_district')
    from_address = request.form.get('from_address')
    to_address = request.form.get('to_address')

    cursor.execute("""
        INSERT INTO orders (user_id, object_id, from_district, to_district, from_address, to_address)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (user_id, object_id, from_district, to_district, from_address, to_address))
    db.commit()

    return redirect('/confirmation')

@app.route('/confirmation')
def confirmation():
    return "<h1>Payment Confirmed! (Stage 1 Demo)</h1>"

if __name__ == "__main__":
    app.run(debug=True)
