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
        "names": ["TCS", "tcs"],
        "logo": "https://assets.new.siemens.com/siemens/assets/api/uuid:0de7e89e-9aa3-4af3-8857-9ab917fd97c5/tcs-logo.png",
        "banner": "https://images.yourstory.com/cs/wordpress/2018/08/TCS.png?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75"
    },
    {
        "names": ["Infosys", "infosis"],
        "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSRJaGYc0DH8SS5QMMNVotpzwzSdratIKOiw6weFiAS50MHbR2B-rVxTRV&s=10",
        "banner": "https://media.istockphoto.com/id/1338072522/photo/infosys-u-s-education-center-infosys-is-based-in-india-and-is-a-worldwide-it-ai-and-digital.jpg?s=612x612&w=0&k=20&c=EiCIzquMSZx3IUWeQPqQIuLwOKDt3Gj9UQJy2UMvpmU="
    },
    {
        "names": ["Wipro", "wipro"],
        "logo": "https://yt3.googleusercontent.com/gCHepjodxvjcAXhiHzvNa5l_h7Xn5ghVeKGE6rTBy_XcyXDe-yEhyAK74HolUOmh-jVdp-NaeVE=s900-c-k-c0x00ffffff-no-rj",
        "banner": "https://www.verdict.co.uk/wp-content/uploads/2025/01/Wipro_shutterstock_2335935755.jpg"
    },
    {
        "names": ["Reliance Jio", "Reliance", "reliance", "Reliance Industries Limited"],
        "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKhYl7RMn6aoQL0pJOYc3kduEDmIC37txjK_uNfM4G0g&s",
        "banner": "https://cdn.zeebiz.com/sites/default/files/2016/05/16/1599-reliance-jio-ians.JPG?im=Resize=(1200,900)"
    },
    {
        "names": ["Paytm", "paytm", "One97 Communications"],
        "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8jZBFlEI9Ej0VWE4IGzhTRAxnrvEiJkMFTBHXJJtm76VzKEGaDTt9W1Q&s=10",
        "banner": "https://static.ambitionbox.com/api/v2/photo/dFFDb2U0dTlpVHQyQ0IxdGJlSDlwdz09"
    },
    {
        "names": ["Zomato", "zomato"],
        "logo": "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
        "banner": "https://khatabook-assets.s3.amazonaws.com/media/post/429VQcIHRWKB8Cynhm7hdxTujMjAAzADNj_MyqVmS9cEHJDoCg-2BffwA1bIwy_01WLOhw0BCaL6nDh1BTIgCOf3D14mH0DciPKUN-vRA0ljwVjGDHWFsfdGrXxGkbWdY5RNPVIyZpSk.webp"
    },
    {
        "names": ["Swiggy", "swigy", "swiggy", "Bundl Technologies Pvt Ltd"],
        "logo": "https://images.yourstory.com/cs/2/220356402d6d11e9aa979329348d4c3e/swiggypng-1586771832047.png?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75",
        "banner": "https://images.yourstory.com/cs/2/c2cedff02d6111ef9021856619e24ca1/12477cfb-3367-47cc-aa59-e2c433471257-1757496910063.jpeg?mode=fit&crop=faces&ar=16%3A9&format=auto&w=1920&q=75"
    },
    {
        "names": ["Google", "google", "Alphabet", "GOOOGLE"],
        "logo": "https://static.vecteezy.com/system/resources/thumbnails/010/353/285/small/colourful-google-logo-on-white-background-free-vector.jpg",
        "banner": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRZDLu2il6r0fLW8nJ16xGuMaSzOs1F3Id_EBpgl7154c5goayN0rqKSdE&s=10"
    }
]

for company in companies:
    for name in company['names']:
        query = f"UPDATE companies SET logo_url = '{company['logo']}', cover_photo_url = '{company['banner']}' WHERE name = '{name}'"
        con.run(query)
        print(f"Executed update for {name}")

print("Done updating all companies.")
con.close()
