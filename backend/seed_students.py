from app import create_app
from app.extensions import db
from app.models.user import User
import random

app = create_app()

first_names_male = [
    "Aarav", "Vivaan", "Aditya", "Krishna", "Arjun",
    "Rohan", "Kunal", "Harsh", "Rahul", "Siddharth",
    "Ayush", "Manav", "Lakshya", "Ishaan", "Yash",
    "Dhruv", "Kabir", "Pranav", "Shivam", "Nikhil"
]

first_names_female = [
    "Ananya", "Priya", "Sneha", "Kavya", "Riya",
    "Meera", "Ishita", "Pooja", "Simran", "Aditi",
    "Muskan", "Nandini", "Diya", "Ritika", "Tanvi",
    "Palak", "Khushi", "Neha", "Jiya", "Shruti"
]

surnames = [
    "Sharma", "Verma", "Gupta", "Singh", "Yadav",
    "Mehta", "Agarwal", "Mishra", "Kapoor", "Jain",
    "Chauhan", "Rathore", "Malhotra", "Bansal", "Saxena",
    "Tripathi", "Pandey", "Rawat", "Joshi", "Thakur"
]

used_names = set()

with app.app_context():
    for i in range(11, 91):
        prefix = str(i).zfill(3)
        student_code = f"{prefix}13702023"

        gender = random.choice(["Male", "Female"])

        while True:
            first_name = random.choice(
                first_names_male if gender == "Male" else first_names_female
            )
            surname = random.choice(surnames)

            full_name = f"{first_name} {surname}"

            if full_name not in used_names:
                used_names.add(full_name)
                break

        email = f"student{i}@bca.com"

        student = User(
            name=full_name,
            email=email,
            role="student",
            age=random.randint(19, 23),
            gender=gender,
            phone=f"98{random.randint(10000000,99999999)}",
            student_id=student_code,
            enrollment_no=student_code,
            course="BCA",
            class_name="6",
            section="M1"
        )

        student.set_password("Student@123")

        db.session.add(student)

    db.session.commit()

    print("✅ Better student dataset created successfully!")