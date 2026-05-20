import sqlite3
import csv
import re
import os
import random
import uuid

# Paths
ROOT = "/Users/rahi/Desktop/deshiMula"
DB_PATH = os.path.join(ROOT, "data", "deshimula.db")
SCHEMA_PATH = os.path.join(ROOT, "schema.sql")
CSV_PATH = os.path.join(ROOT, "raw.csv")

def slugify(s):
    s = s.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_-]+', '-', s)
    s = re.sub(r'^-+|-+$', '', s)
    return s

def main():
    print("Resetting database...")
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    # Connect
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    # Read and execute schema
    print("Executing schema...")
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema = f.read()
    cursor.executescript(schema)
    
    # 1. Seed review_sentiments (100 records)
    print("Seeding review_sentiments...")
    sentiments = [
        "Negative", "Neutral", "Positive",  # Core 3 (IDs 1, 2, 3)
        # 97 others
        "Extremely Positive", "Moderately Positive", "Mildly Positive", "Slightly Positive",
        "Extremely Negative", "Moderately Negative", "Mildly Negative", "Slightly Negative",
        "Highly Satisfied", "Highly Dissatisfied", "Extremely Satisfied", "Extremely Dissatisfied",
        "Somewhat Neutral", "Mostly Neutral", "Indifferent", "Apathetic", "Mixed",
        "Angry", "Annoyed", "Anxious", "Appreciative", "Bitter", "Calm", "Cheerful",
        "Comfortable", "Confident", "Content", "Cynical", "Delighted", "Depressed",
        "Disappointed", "Disgruntled", "Disgusted", "Dismayed", "Distrustful", "Eager",
        "Ecstatic", "Elated", "Encouraged", "Enthusiastic", "Envious", "Excited",
        "Exhausted", "Fearful", "Frustrated", "Grateful", "Happy", "Hopeful", "Hostile",
        "Inspired", "Irritated", "Joyful", "Miserable", "Nervous", "Optimistic",
        "Overwhelmed", "Peaceful", "Pessimistic", "Pleased", "Proud", "Regretful",
        "Relieved", "Resentful", "Sad", "Satisfied", "Skeptical", "Stressed",
        "Surprised", "Suspicious", "Tense", "Thrilled", "Uneasy", "Unhappy",
        "Valued", "Vexed", "Warm", "Worried", "Highly Excited", "Somewhat Bitter",
        "Quietly Confident", "Cautiously Optimistic", "Severely Burned Out", "Very Sad",
        "Very Happy", "Deeply Grateful", "Slightly Anxious", "Somewhat Nervous",
        "Extremely Anxious", "Extremely Stressed", "Moderately Happy", "Moderately Sad",
        "Quite Satisfied", "Quite Dissatisfied"
    ]
    
    # Pad to make sure we have exactly 100
    while len(sentiments) < 100:
        sentiments.append(f"Sentiment Variation {len(sentiments) + 1}")
    
    for s in sentiments[:100]:
        cursor.execute("INSERT INTO review_sentiments (name) VALUES (?);", (s,))
    
    # 2. Seed industries (100 records)
    print("Seeding industries...")
    industries = [
        "Software", "Finance", "Education", "Health", "Startup", "Media",
        "Digital Services", "Consulting", "E-commerce", "Remote",  # Core 10
        # 90 others
        "Telecommunications", "Real Estate", "Automotive", "Aerospace", "Agriculture",
        "Apparel", "Biotechnology", "Chemical", "Construction", "Defense", "Energy",
        "Entertainment", "Food & Beverage", "Forestry", "Hospitality", "Insurance",
        "Machinery", "Manufacturing", "Mining", "Music", "Pharmaceutical", "Publishing",
        "Retail", "Shipping", "Sports", "Transportation", "Tourism", "Utilities",
        "Waste Management", "Wholesale", "Logistics", "Artificial Intelligence",
        "Blockchain", "Cybersecurity", "Cloud Computing", "Game Development", "Hardware",
        "Networking", "FinTech", "EdTech", "MedTech", "AgriTech", "AdTech", "CleanTech",
        "InsurTech", "PropTech", "GovTech", "HRTech", "LegalTech", "FoodTech", "BioTech",
        "NanoTech", "Robotics", "AR/VR", "IoT", "Semiconductors", "Electronics",
        "Telephony", "Broadcasting", "Journalism", "Advertising", "Public Relations",
        "Marketing", "Event Management", "Photography", "Design", "Architecture",
        "Law", "Accounting", "HR", "Recruiting", "Training", "Translation", "Writing",
        "Research", "Non-Profit", "NGO", "Government", "Military", "Police", "Healthcare IT"
    ]
    while len(industries) < 100:
        industries.append(f"Industry Option {len(industries) + 1}")
        
    for ind in industries[:100]:
        cursor.execute("INSERT INTO industries (name) VALUES (?);", (ind,))

    # 3. Seed company_locations (100 records)
    print("Seeding company_locations...")
    locations = [
        "Dhaka", "Chittagong", "Sylhet", "Remote", "Bangladesh",  # Core 5
        # 95 others
        "Gulshan, Dhaka", "Banani, Dhaka", "Dhanmondi, Dhaka", "Motijheel, Dhaka",
        "Uttara, Dhaka", "Mirpur, Dhaka", "Mohakhali, Dhaka", "Tejgaon, Dhaka",
        "Kawran Bazar, Dhaka", "Agrabad, Chittagong", "GEC, Chittagong", "Halishahar, Chittagong",
        "Zindabazar, Sylhet", "Uposhahar, Sylhet", "Rajshahi", "Khulna", "Barisal",
        "Rangpur", "Mymensingh", "Comilla", "Gazipur", "Narayanganj", "Savar",
        "Cox's Bazar", "Feni", "Jessore", "Bogra", "Tangail", "Faridpur", "Jamalpur",
        "Dinajpur", "Pabna", "Kushtia", "Noakhali", "Sunamganj", "Habiganj",
        "Moulvibazar", "Brahmanbaria", "Chandpur", "Lakshmipur", "Rangamati",
        "Khagrachhari", "Bandarban", "Patuakhali", "Bhola", "Pirojpur", "Jhalokati",
        "Barguna", "Netrokona", "Sherpur", "Kishoreganj", "Manikganj", "Munshiganj",
        "Madaripur", "Shariatpur", "Gopalganj", "Rajbari", "Kurigram", "Lalmonirhat",
        "Gaibandha", "Nilphamari", "Panchagarh", "Thakurgaon", "Joypurhat", "Naogaon",
        "Natore", "Nawabganj", "Sirajganj", "Bagerhat", "Chuadanga", "Jhenaidah",
        "Magura", "Meherpur", "Narail", "Satkhira", "Sajek Valley", "Vasant Kunj",
        "Silicon Valley", "London", "New York", "Singapore", "Berlin", "Dubai",
        "Sydney", "Toronto", "Tokyo", "Mumbai", "Kolkata", "Delhi", "Bangalore",
        "Chennai", "Hyderabad", "Pune", "Noida", "Gurugram"
    ]
    while len(locations) < 100:
        locations.append(f"Location {len(locations) + 1}")
        
    for loc in locations[:100]:
        cursor.execute("INSERT INTO company_locations (name) VALUES (?);", (loc,))

    # 4. Seed tags (100 records)
    print("Seeding tags...")
    tags = [
        "toxic-culture", "salary", "promotion", "leadership", "work-life-balance",
        "hr", "bias", "growth", "innovation", "pay-delay",  # Core 10
        # 90 others
        "hr-issues", "nepotism", "office-politics", "free-lunch", "remote-work",
        "hybrid-work", "flexible-hours", "good-colleagues", "bad-boss", "overtime",
        "weekend-work", "dress-code", "gender-bias", "religious-bias", "learning-scope",
        "career-growth", "performance-bonus", "provident-fund", "medical-insurance",
        "maternity-leave", "paternity-leave", "annual-trip", "free-snacks", "modern-office",
        "congested-space", "poor-equipment", "micromanagement", "layoffs", "job-security",
        "fired-without-reason", "unprofessional-hr", "office-activities", "table-tennis",
        "play-zone", "free-coffee", "tea-rationing", "no-increment", "shady-appraisal",
        "learning-opportunity", "bureaucracy", "favoritism", "suck-ups", "good-cto",
        "invisible-cto", "unprofessional-management", "office-harassment", "sexiest-environment",
        "good-facilities", "understaffed", "stressful-work", "burnout", "learning-curve",
        "cutting-edge-tech", "outdated-tech", "open-culture", "sponsorship", "visa-support",
        "international-clients", "local-clients", "startup-vibe", "corporate-culture",
        "family-business", "government-job", "internship-scam", "unpaid-internship",
        "no-certificate", "verbal-promises", "broken-promises", "toxic-colleagues",
        "friendly-environment", "supportive-seniors", "arrogant-seniors", "lack-of-documentation",
        "lack-of-process", "blame-game", "no-job-security", "high-turnover", "competency-issues",
        "low-salary", "high-salary", "fair-pay", "late-salary", "bonus-issues"
    ]
    while len(tags) < 100:
        tags.append(f"tag-{len(tags) + 1}")
        
    for tag in tags[:100]:
        cursor.execute("INSERT INTO tags (name) VALUES (?);", (tag,))

    # 5. Seed users (120 records)
    print("Seeding users...")
    # Core Admin & User
    cursor.execute("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?);",
                   ("Admin User", "admin@deshimula.com", "admin123", "admin"))
    cursor.execute("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?);",
                   ("Regular User", "user@deshimula.com", "password123", "user"))
    
    first_names = ["Rahi", "Karim", "Rahim", "Zamil", "Aysha", "Fatima", "Tariq", "Imran", "Sajid", "Farhan", "Nabil", "Sumaiya", "Mahmud", "Shakil", "Arif", "Jamil", "Hasan", "Kamal", "Munir", "Zahid"]
    last_names = ["Ahmed", "Khan", "Chowdhury", "Rahman", "Hasan", "Islam", "Uddin", "Ali", "Alam", "Sarker", "Patwary", "Talukder", "Bhuiyan", "Miah", "Haque", "Jahan", "Yasmin", "Begum", "Akter", "Sultana"]
    
    for i in range(3, 121):
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        email = f"user{i}@deshimula.com"
        cursor.execute("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?);",
                       (name, email, "password123", "user"))

    # 6. Parse CSV and seed companies and reviews
    print("Parsing raw.csv and seeding companies & reviews...")
    companies_dict = {}  # name -> id
    
    # Read unique companies first
    unique_company_names = set()
    reviews_data = []
    
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        # Columns: guid,title,company,sentiment,content,upvotes,downvotes,parent_themes
        for row in reader:
            if len(row) < 5:
                continue
            guid, title, company_name, sentiment_str, content = row[0], row[1], row[2], row[3], row[4]
            upvotes = int(row[5]) if row[5] else 0
            downvotes = int(row[6]) if row[6] else 0
            
            company_name = company_name.strip()
            if company_name:
                unique_company_names.add(company_name)
                reviews_data.append({
                    'guid': guid,
                    'title': title,
                    'company_name': company_name,
                    'sentiment': sentiment_str,
                    'content': content,
                    'upvotes': upvotes,
                    'downvotes': downvotes
                })
    
    # We want at least 100 companies. Let's make sure.
    unique_companies_list = sorted(list(unique_company_names))
    
    # Pad companies if needed (not needed since there are 293 in the CSV, but let's make sure they are unique)
    print(f"Found {len(unique_companies_list)} unique companies in raw.csv.")
    
    slugs = set()
    for c_name in unique_companies_list:
        base_slug = slugify(c_name)
        if not base_slug:
            base_slug = "company"
        slug = base_slug
        counter = 1
        while slug in slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
        slugs.add(slug)
        
        desc = f"{c_name} is an enterprise operating in Bangladesh, providing services and business operations."
        web = f"https://www.{slug}.com"
        logo = f"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=60"
        
        cursor.execute("INSERT INTO companies (name, slug, description, website, logo_url) VALUES (?, ?, ?, ?, ?);",
                       (c_name, slug, desc, web, logo))
        companies_dict[c_name] = cursor.lastrowid
        
    # 7. Seed company_industries (at least 100 records)
    print("Seeding company_industries...")
    # Link each company to 1-3 random industries
    for c_id in companies_dict.values():
        num_inds = random.randint(1, 3)
        selected_inds = random.sample(range(1, 101), num_inds)
        for ind_id in selected_inds:
            cursor.execute("INSERT OR IGNORE INTO company_industries (company_id, industry_id) VALUES (?, ?);",
                           (c_id, ind_id))

    # 8. Seed company_location_junction (at least 100 records)
    print("Seeding company_location_junction...")
    # Link each company to 1-2 random locations
    for c_id in companies_dict.values():
        num_locs = random.randint(1, 2)
        selected_locs = random.sample(range(1, 101), num_locs)
        for loc_id in selected_locs:
            cursor.execute("INSERT OR IGNORE INTO company_location_junction (company_id, location_id) VALUES (?, ?);",
                           (c_id, loc_id))

    # 9. Insert reviews
    print(f"Inserting {len(reviews_data)} reviews...")
    review_ids = []
    
    for r in reviews_data:
        c_id = companies_dict.get(r['company_name'])
        if not c_id:
            continue
        
        # User ID between 2 and 120 (random user)
        u_id = random.randint(2, 120)
        
        # Sentiment ID: if negative in CSV, high chance of Negative (1); else distribute between Positive (3) and Neutral (2)
        sent_str = r['sentiment'].strip().lower() if r['sentiment'] else ''
        if sent_str == 'negative':
            s_id = random.choices([1, 2, 3], weights=[80, 15, 5], k=1)[0]
        else:
            s_id = random.choices([1, 2, 3], weights=[15, 35, 50], k=1)[0]
        
        cursor.execute("""
            INSERT INTO reviews (guid, title, content, company_id, user_id, sentiment_id, upvotes, downvotes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, (r['guid'], r['title'], r['content'], c_id, u_id, s_id, r['upvotes'], r['downvotes']))
        review_ids.append(cursor.lastrowid)

    # 10. Seed review_tags (at least 100 records)
    print("Seeding review_tags...")
    # Link each review to 1-4 random tags
    for i, r_id in enumerate(review_ids):
        # Explicitly assign tag 2 ('salary') and tag 4 ('leadership') to the first 10 reviews
        # to ensure Query 25 returns results
        if i < 10:
            cursor.execute("INSERT OR IGNORE INTO review_tags (review_id, tag_id) VALUES (?, ?);", (r_id, 2))
            cursor.execute("INSERT OR IGNORE INTO review_tags (review_id, tag_id) VALUES (?, ?);", (r_id, 4))
            num_tags = random.randint(0, 2)
            selected_tags = random.sample([t for t in range(1, 101) if t not in [2, 4]], num_tags)
            for tag_id in selected_tags:
                cursor.execute("INSERT OR IGNORE INTO review_tags (review_id, tag_id) VALUES (?, ?);", (r_id, tag_id))
        else:
            num_tags = random.randint(1, 4)
            selected_tags = random.sample(range(1, 101), num_tags)
            for tag_id in selected_tags:
                cursor.execute("INSERT OR IGNORE INTO review_tags (review_id, tag_id) VALUES (?, ?);", (r_id, tag_id))

    # 11. Seed votes (at least 100 records)
    print("Seeding votes...")
    # Generate 300 random votes from random users on random reviews
    for _ in range(300):
        r_id = random.choice(review_ids)
        u_id = random.randint(2, 120)
        v_type = random.choice(['up', 'down'])
        cursor.execute("INSERT OR IGNORE INTO votes (review_id, user_id, vote_type) VALUES (?, ?, ?);",
                       (r_id, u_id, v_type))

    # 12. Seed comments (at least 100 records)
    print("Seeding comments...")
    comments_list = [
        "This review is highly detailed and reflects my experience too.",
        "Totally agree with the work-life balance issues.",
        "Thanks for sharing this, helps me make a decision.",
        "Is the salary delay still a thing there?",
        "Good culture but management needs an overhaul.",
        "আপনার রিভিউটির সাথে আমি একমত।",
        "এই কোম্পানিতে জয়েন করার আগে আমার এই রিভিউটি পড়া উচিত ছিল।",
        "আমাদের অফিসেও এমন পলিটিক্স চলে।",
        "The salary is indeed paid on time, but increments are low.",
        "Very useful insights. Thank you!",
        "It depends on the team, but generally this is true.",
        "Is there any training provided for freshers?",
        "remote work policy is very flexible there.",
        "The interviews are tough but fair.",
        "unprofessional HR practices are killing the vibe."
    ]
    for _ in range(150):
        r_id = random.choice(review_ids)
        u_id = random.randint(2, 120)
        content = random.choice(comments_list)
        cursor.execute("INSERT INTO comments (review_id, user_id, content) VALUES (?, ?, ?);",
                       (r_id, u_id, content))

    # 13. Seed reports (at least 100 records)
    print("Seeding reports...")
    reasons = [
        "Inappropriate language used",
        "Outdated salary information",
        "Misleading details",
        "Potential duplicate review",
        "Spam content",
        "Violates company policy",
        "Contains personal attack",
        "Off-topic review"
    ]
    statuses = ["pending", "reviewed", "dismissed"]
    
    # Avoid reporting reviews of companies 11 to 30 to guarantee some companies with positive reviews have no reports
    cursor.execute("SELECT id FROM reviews WHERE company_id NOT BETWEEN 11 AND 30;")
    reportable_review_ids = [row[0] for row in cursor.fetchall()]
    if not reportable_review_ids:
        reportable_review_ids = review_ids
        
    for _ in range(120):
        r_id = random.choice(reportable_review_ids)
        u_id = random.randint(2, 120)
        reason = random.choice(reasons)
        status = random.choice(statuses)
        cursor.execute("INSERT INTO reports (review_id, user_id, reason, status) VALUES (?, ?, ?, ?);",
                       (r_id, u_id, reason, status))

    # 14. Seed notifications (at least 100 records)
    print("Seeding notifications...")
    notifications_list = [
        "Welcome to DeshiMula! Start by sharing your first experience.",
        "Your comment has received an upvote.",
        "A new review was submitted for a company you follow.",
        "Your review was marked as helpful by another user.",
        "Admin has reviewed your reported content.",
        "New comment on a review you participated in."
    ]
    for _ in range(150):
        u_id = random.randint(1, 120)
        msg = random.choice(notifications_list)
        is_read = random.choice([0, 1])
        cursor.execute("INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, ?);",
                       (u_id, msg, is_read))

    # 15. Seed audit_logs (at least 100 records)
    print("Seeding audit_logs...")
    actions = ["login", "logout", "create_review", "delete_review", "comment", "vote", "report"]
    entities = ["user", "review", "comment", "vote", "report"]
    for _ in range(150):
        u_id = random.randint(1, 120)
        act = random.choice(actions)
        ent = random.choice(entities)
        ent_id = random.randint(1, 500)
        details = f"Action '{act}' performed by user on entity '{ent}' with id {ent_id}"
        cursor.execute("INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?);",
                       (u_id, act, ent, ent_id, details))

    # Update company aggregate stats (avg_rating and total_reviews) based on reviews
    print("Updating company aggregate stats...")
    cursor.execute("SELECT id FROM companies;")
    company_ids = [row[0] for row in cursor.fetchall()]
    
    for c_id in company_ids:
        # Get reviews for this company
        cursor.execute("""
            SELECT r.sentiment_id FROM reviews r
            WHERE r.company_id = ?;
        """, (c_id,))
        rows = cursor.fetchall()
        total_revs = len(rows)
        if total_revs > 0:
            # Map sentiment_id to score: 1 (Negative) -> 1, 2 (Neutral) -> 3, 3 (Positive) -> 5
            # For other custom sentiments, default to 3
            scores = []
            for r_row in rows:
                s_id = r_row[0]
                if s_id == 1:
                    scores.append(1.0)
                elif s_id == 3:
                    scores.append(5.0)
                else:
                    scores.append(3.0)
            avg_rating = sum(scores) / len(scores)
            cursor.execute("UPDATE companies SET avg_rating = ?, total_reviews = ? WHERE id = ?;",
                           (round(avg_rating, 2), total_revs, c_id))
        else:
            cursor.execute("UPDATE companies SET avg_rating = 0, total_reviews = 0 WHERE id = ?;", (c_id,))

    # Commit and Close
    conn.commit()
    conn.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    main()
