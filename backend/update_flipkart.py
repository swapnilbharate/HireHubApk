import pg8000.native

# Database credentials from application.properties
host = "ep-restless-snow-axvrobhs.c-4.us-east-2.aws.neon.tech"
database = "neondb"
user = "neondb_owner"
password = "npg_9w5hiVtWdmqA"

con = pg8000.native.Connection(user=user, password=password, host=host, database=database, ssl_context=True)

print("Connected successfully!")

companies = [
    {
        "names": ["Flipkart", "flipkart", "flipcard", "Flipcard"],
        "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR67SX61qzCrqBz_Vp7veMyYD9PfbbgbakBwnZjvP0I-A&s=10",
        "banner": "https://images.livemint.com/img/2019/10/15/600x338/636f9474-6678-11e9-9325-ae0c7018af1d_1556130383262_1571142099243.jpg"
    }
]

for company in companies:
    for name in company['names']:
        query = f"UPDATE companies SET logo_url = '{company['logo']}', cover_photo_url = '{company['banner']}' WHERE name = '{name}'"
        con.run(query)
        print(f"Executed update for {name}")

print("Done updating Flipkart.")
con.close()
