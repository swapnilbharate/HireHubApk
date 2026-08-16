import pg8000.native

# Database credentials from application.properties
host = "ep-restless-snow-axvrobhs.c-4.us-east-2.aws.neon.tech"
database = "neondb"
user = "neondb_owner"
password = "npg_9w5hiVtWdmqA"

con = pg8000.native.Connection(user=user, password=password, host=host, database=database, ssl_context=True)

print("Connected successfully!")

tcs_logo = "https://assets.new.siemens.com/siemens/assets/api/uuid:0de7e89e-9aa3-4af3-8857-9ab917fd97c5/tcs-logo.png"
tcs_banner = "https://images.yourstory.com/cs/wordpress/2018/08/TCS.png?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75"

infosys_logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSRJaGYc0DH8SS5QMMNVotpzwzSdratIKOiw6weFiAS50MHbR2B-rVxTRV&s=10"
infosys_banner = "https://media.istockphoto.com/id/1338072522/photo/infosys-u-s-education-center-infosys-is-based-in-india-and-is-a-worldwide-it-ai-and-digital.jpg?s=612x612&w=0&k=20&c=EiCIzquMSZx3IUWeQPqQIuLwOKDt3Gj9UQJy2UMvpmU="


# Check if TCS exists, if not insert it. Otherwise update.
res = con.run("SELECT id FROM companies WHERE name = 'TCS' or name = 'tcs'")
if not res:
    print("TCS not found. Creating...")
    con.run(f"INSERT INTO companies (name, description, industry, logo_url, cover_photo_url, location) VALUES ('TCS', 'Tata Consultancy Services', 'IT', '{tcs_logo}', '{tcs_banner}', 'Mumbai')")
else:
    print("TCS found. Updating...")
    con.run(f"UPDATE companies SET logo_url = '{tcs_logo}', cover_photo_url = '{tcs_banner}' WHERE name = 'TCS' or name = 'tcs'")


# Check if Infosys exists
res = con.run("SELECT id FROM companies WHERE name = 'Infosys' or name = 'infosis'")
if not res:
    print("Infosys not found. Creating...")
    con.run(f"INSERT INTO companies (name, description, industry, logo_url, cover_photo_url, location) VALUES ('Infosys', 'Infosys Limited', 'IT', '{infosys_logo}', '{infosys_banner}', 'Bengaluru')")
else:
    print("Infosys found. Updating...")
    con.run(f"UPDATE companies SET logo_url = '{infosys_logo}', cover_photo_url = '{infosys_banner}' WHERE name = 'Infosys' or name = 'infosis'")

print("Done updating companies.")
con.close()
