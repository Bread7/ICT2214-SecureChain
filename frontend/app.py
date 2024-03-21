from flask import Flask, render_template, session, request, redirect, url_for, jsonify
import requests  # To call Node.js middleware
from datetime import datetime
import json
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['MIDDLEWARE_URL'] = 'http://localhost:3001'  # URL to your Node.js middleware
app.jinja_env.globals.update(zip=zip)

# Define a custom filter for datetime formatting
def datetimeformat(value, format='%Y-%m-%d %H:%M:%S'):
    return datetime.fromtimestamp(value).strftime(format)
app.jinja_env.filters['date'] = datetimeformat

@app.route('/')
def index():
    return render_template('landing.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')

    elif request.method == 'POST':
        # Retrieve data from JSON request body
        data = request.get_json()

        # Extract variables from JSON data
        username = data.get('username')
        password = data.get('password')
        wallet_address = data.get('user_wallet_address')  # Make sure this matches your front-end JSON keys
        contract_type = data.get('contract_type')

        # Prepare data to be sent to the middleware or directly to the blockchain network
        registration_data = {
            "username": username,
            "password": password,
            "user_wallet_address": wallet_address,
            "contract_type": contract_type
        }

        # Make a request to the middleware to handle registration logic
        response = requests.post(f"{app.config['MIDDLEWARE_URL']}/auth/register", json=registration_data)

        # Check the response from the middleware
        if response.status_code == 200:
            response_data = response.json()
            if response_data.get('success'):
                # Successful registration logic
                return jsonify({'status': 'success', 'message': 'Registered successfully.'})
            else:
                # Registration failed logic
                return jsonify({'status': 'error', 'message': response_data.get('message', 'Registration failed.')}), 400
        else:
            # Something went wrong with the middleware
            return jsonify({'status': 'error', 'message': 'Registration failed due to server error.'}), 500

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    
    elif request.method == 'POST':
        # Retrieve the address and password from the form
        username = request.form.get('username')
        password = request.form.get('password')
        data = {"username": username, "password": password}
        response = requests.post(f"{app.config['MIDDLEWARE_URL']}/auth/login", json=data)

        if response.json().get('success') == False:
            # reload login page if login failed
            return redirect(url_for('login', login_failed=True))
        
        elif response.json().get('success') == True:
            # Set the user_id in the session and redirect to the home page
            session['user_id'] = response.json().get('data', {}).get('id', '')
            return redirect(url_for('home', session_started=True))

@app.route('/home')
def home():

    if session.get('user_id', '') != '':

        response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getUsers")

        users = response.json().get('data', [])

        for i in users:
            if i['id'] == session['user_id']:
                user = i
                break
        
        return render_template('home.html')

    elif session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))

@app.route('/finance')
def finance():

    if session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))
    
    else:
        permissions_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getAccess", params={'id': session['user_id']})
        permissions_data = permissions_response.json().get('data', {})

        if permissions_data == [{}]:
            permissions_data = permissions_response.json()['msg']
            if permissions_data == 'This user has an owner contract, all permissions given':
                user_permissions = "20"
        
        else:
            user_permissions = permissions_data[0]
            print(user_permissions)
            user_permissions = user_permissions['attributeIndex']

        if '20' in user_permissions:

            response = requests.get(f"{app.config['MIDDLEWARE_URL']}/finance/getFinance")
            finance_data = response.json()['data']  

            all_finance_records = []

            for record in finance_data:
                all_finance_records.append({
                    'id': record['id'],
                    'balance': record['balance'],
                    'profits': record['profits'],
                    'revenue': record['revenue'],
                    'created_at': record['created_at'],
                    'updated_at': record['updated_at']
                })

            return render_template('finance.html', finance=all_finance_records)
        
        else:
            return redirect(url_for('home', privileges_error=True))

@app.route('/editFinance')
def editFinance():
    if session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))
    
    else:
        permissions_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getAccess", params={'id': session['user_id']})
        permissions_data = permissions_response.json().get('data', {})

        if permissions_data == [{}]:
            permissions_data = permissions_response.json()['msg']
            if permissions_data == 'This user has an owner contract, all permissions given':
                user_permissions = "21"
        
        else:
            user_permissions = permissions_data[0]
            print(user_permissions)
            user_permissions = user_permissions['attributeIndex']

        if '21' in user_permissions:
            return render_template('editFinance.html')
        
        else:         
            return redirect(url_for('home', privileges_error=True))

@app.route('/addFinance', methods=['POST'])
def addFinance():

    if session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))
    
    else:
        permissions_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getAccess", params={'id': session['user_id']})
        permissions_data = permissions_response.json().get('data', {})

        if permissions_data == [{}]:
            permissions_data = permissions_response.json()['msg']
            if permissions_data == 'This user has an owner contract, all permissions given':
                user_permissions = "21"
        
        else:
            user_permissions = permissions_data[0]
            print(user_permissions)
            user_permissions = user_permissions['attributeIndex']

        if '21' in user_permissions:
            balance = request.form.get('balance')
            profits = request.form.get('profits')
            revenue = request.form.get('revenue')

            api_url = f"{app.config['MIDDLEWARE_URL']}/finance/postFinance"
            headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }

            # Assemble the data payload
            data = {
                "balance": balance,
                "profits": profits,
                "revenue": revenue
            }
            # Send the POST request to the API
            response = requests.post(api_url, headers=headers, data=json.dumps(data))

            time.sleep(3)

            # Redirect to the 'finance' page
            return redirect(url_for('finance', finance_updated=True))
        
        else:
            return redirect(url_for('home', privileges_error=True))

@app.route('/logout')
def logout():
    session.clear()
    # Redirect to the landing page with a session_closed message
    return redirect(url_for('index', session_closed=True))  


@app.route('/dashboard')
def admin_dashboard():

    if session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))
    
    else:
        contract_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getContract", params={'id': session['user_id'], "contract_type": "owner"})
        contract_data = contract_response.json().get('data', {})
        
        user_contract = contract_data[0]
        contract = user_contract['contract_type']
        
        if contract == "owner":

            users_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getUsers")
            users_response.raise_for_status()
            users_data = users_response.json().get('data', [])

            # Find all unique permission attribute names for dynamic permissions columns
            all_permissions = {}
            user_permissions_data = []

            for user in users_data:
                permissions_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getAccess", params={'id': user['id']})
                permissions_response.raise_for_status()
                permissions_data = permissions_response.json().get('data', {})
                
                user_permissions = permissions_data[0]
                user_permissions = user_permissions['attributeIndex']

                user_permissions_data.append({
                    'user': user,
                    'permissions': user_permissions
                })
            
            permissions_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/permissions/getPermissions")
            permissions_response.raise_for_status()
            permissions_data = permissions_response.json().get('data', [])

            for permission in permissions_data:
                all_permissions[permission['attribute_index']] = permission['attribute']

            # Convert to list for consistent ordering in the template
            sorted_permissions = dict(sorted(all_permissions.items()))

            # Render the template with the combined data
            return render_template(
                'adminDashboard.html',
                user_permissions=user_permissions_data,
                permissions=sorted_permissions
            )
        
        else:
            return redirect(url_for('home', privileges_error=True))
    
@app.route('/edit_user_permission/<int:userid>/<string:name>')
def edit_user_permission(userid, name):

    if session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))
    
    else:
        contract_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getContract", params={'id': session['user_id'], "contract_type": "owner"})
        contract_data = contract_response.json().get('data', {})
        
        user_contract = contract_data[0]
        contract = user_contract['contract_type']
        
        if contract == "owner":

            # Fetch all available permissions
            permissions_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/permissions/getPermissions")
            permissions_response.raise_for_status()
            permissions_data = permissions_response.json().get('data', [])

            all_permissions = {}

            for permission in permissions_data:
                all_permissions[permission['attribute_index']] = permission['attribute']

            # Convert to list for consistent ordering in the template
            sorted_permissions = dict(sorted(all_permissions.items()))

            # Fetch the permissions for the specific user
            permissions_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getAccess", params={'id': userid})
            permissions_response.raise_for_status()
            user_permissions_data = permissions_response.json().get('data', [])

            user_permissions = {}
            
            for permission_block in user_permissions_data:
                for idx, attr_idx, perm in zip(permission_block['index'], permission_block['attributeIndex'], permission_block['permissions']):
                    # Use the attribute index as key, and store a tuple of (name, start_time, end_time)
                    perm.append(idx)
                    user_permissions[attr_idx] = perm

            # Format the permissions start and end time
            for attr_idx, details in user_permissions.items():
                start_time = datetime.fromtimestamp(details[1]).strftime('%Y-%m-%d %H:%M:%S')
                # Assuming that the 'end' time is also a timestamp; replace 0 with the correct end timestamp if available
                end_time = datetime.fromtimestamp(details[2] if details[2] else details[1]).strftime('%Y-%m-%d %H:%M:%S') if details[2] else 'Indefinite'
                user_permissions[attr_idx] = {'name': details[0], 'start_time': start_time, 'end_time': end_time, 'id': details[3]}
            
            return render_template('editUserPermissions.html', user_id=userid, name=name,
                                all_permissions=sorted_permissions, user_permissions=user_permissions)
        
        else:
            return redirect(url_for('home', privileges_error=True))

@app.route('/add_user_permission/<int:user_id>', methods=['POST'])
def add_user_permission(user_id):

    if session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))
    
    else:
        contract_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getContract", params={'id': session['user_id'], "contract_type": "owner"})
        contract_data = contract_response.json().get('data', {})
        
        user_contract = contract_data[0]
        contract = user_contract['contract_type']
        
        if contract == "owner":
            attribute_idx = request.form.get('attribute_index')
            user_name = request.form.get('user_name')
            permission_name = request.form.get('permission_name')
            api_url = f"{app.config['MIDDLEWARE_URL']}/contract/addAccess"
            headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
            # Assemble the data payload
            data = {
                "permissions": {
                    attribute_idx: {
                        "attribute": permission_name,
                        "start": 0,
                        "end": 0
                    }
                },
                "id": user_id
            }
            # Send the POST request to the API
            response = requests.post(api_url, headers=headers, data=json.dumps(data))

            time.sleep(5)

            # Redirect to the 'edit_user_permission' page
            return redirect(url_for('edit_user_permission', userid=user_id, name=user_name, privileges_updated=True))
        
        else:
            return redirect(url_for('home', privileges_error=True))

@app.route('/delete_user_permission/<int:user_id>', methods=['POST'])
def delete_user_permission(user_id):
    
    if session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))
    
    else:
        contract_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getContract", params={'id': session['user_id'], "contract_type": "owner"})
        contract_data = contract_response.json().get('data', {})
        
        user_contract = contract_data[0]
        contract = user_contract['contract_type']
        
        if contract == "owner":

            permission_id = request.form.get('permission_id')
            attribute_id = request.form.get('attribute_index')
            user_name = request.form.get('user_name')

            api_url = f"{app.config['MIDDLEWARE_URL']}/contract/removeAccess"
            headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
            # Constructing the JSON payload
            data = json.dumps({
                "permissions": {
                    permission_id: attribute_id
                },
                "id": user_id
            })

            # Sending the POST request
            response = requests.post(api_url, headers=headers, data=data)

            time.sleep(5)

            # Redirect back to the edit permissions page, passing the user_id and user_name
            return redirect(url_for('edit_user_permission', userid=user_id, name=user_name, privileges_updated=True))

        else:

            return redirect(url_for('home', privileges_error=True))

@app.route('/permissions')
def permissions():

    if session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))
    
    else:
        contract_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getContract", params={'id': session['user_id'], "contract_type": "owner"})
        contract_data = contract_response.json().get('data', {})
        
        user_contract = contract_data[0]
        contract = user_contract['contract_type']
        
        if contract == "owner":

            response = requests.get(f"{app.config['MIDDLEWARE_URL']}/permissions/getPermissions")

            all_permission_names = {}

            for permission in response.json()['data']:
                all_permission_names[permission['attribute_index']] = [permission['id'], permission['attribute'], permission['created_at']]

            return render_template('permissions.html', permissions=all_permission_names)
        
        else:
            return redirect(url_for('home', privileges_error=True))


@app.route('/addPermission', methods=['POST'])
def addPermission():

    if session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))
    
    else:
        contract_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getContract", params={'id': session['user_id'], "contract_type": "owner"})
        contract_data = contract_response.json().get('data', {})
        
        user_contract = contract_data[0]
        contract = user_contract['contract_type']
        
        if contract == "owner":
            permission_id = request.form['permissionid']
            permission_name = request.form['permissionname']
            api_url = f"{app.config['MIDDLEWARE_URL']}/permissions/postPermissions"
            # Construct the data payload for the API
            data_payload = {
                "attribute_index": permission_id,
                "attribute": permission_name
            }

            # Make a POST request to the external API
            response = requests.post(
                api_url,
                json=data_payload,
                headers={'accept': 'application/json', 'Content-Type': 'application/json'}
            )

            return redirect(url_for('permissions', permissions_updated=True))
        
        else:
            return redirect(url_for('home', privileges_error=True))

@app.route('/deletePermission/<int:id>', methods=['POST'])
def deletePermission(id):

    if session.get('user_id', '') == '':

        # redirect non-logged in user
        return redirect(url_for('index', session_expired=True))
    
    else:
        contract_response = requests.get(f"{app.config['MIDDLEWARE_URL']}/contract/getContract", params={'id': session['user_id'], "contract_type": "owner"})
        contract_data = contract_response.json().get('data', {})
        
        user_contract = contract_data[0]
        contract = user_contract['contract_type']
        
        if contract == "owner":
            api_url = f"{app.config['MIDDLEWARE_URL']}/permissions/deletePermissions"
            headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
            # Constructing the JSON payload
            data = json.dumps({
                "id": id
            })
            
            response = requests.post(api_url, headers=headers, data=data)

            return redirect(url_for('permissions', permissions_updated=True))
        
        else:
            return redirect(url_for('home', privileges_error=True))

if __name__ == '__main__':
    app.run(debug=True)