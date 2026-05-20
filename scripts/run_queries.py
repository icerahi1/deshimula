import sqlite3
import os

DB_PATH = "/Users/rahi/Desktop/deshiMula/data/deshimula.db"
OUTPUT_PATH = "/Users/rahi/.gemini/antigravity/brain/f91651ea-127c-4875-b369-a2c5d6b348f7/scratch/query_results.txt"

QUERIES = [
    # Part 1: Basic Queries
    ("Query 1: Retrieve all companies with ratings, sorted by rating", 
     "SELECT id, name, avg_rating, total_reviews FROM companies WHERE total_reviews > 0 ORDER BY avg_rating DESC LIMIT 10;"),
    ("Query 2: Find all reviews by a specific user (User ID 2)", 
     "SELECT r.id, r.title, c.name AS company_name, s.name AS sentiment FROM reviews r JOIN companies c ON c.id = r.company_id JOIN review_sentiments s ON s.id = r.sentiment_id WHERE r.user_id = 2 LIMIT 10;"),
    ("Query 3: List first 10 tags used in reviews, ordered alphabetically", 
     "SELECT id, name FROM tags ORDER BY name LIMIT 10;"),
     
    # Part 2: SUBSTRING Queries
    ("Query 4: Search reviews containing the word 'salary'", 
     "SELECT id, title, SUBSTR(content, 1, 60) || '...' AS short_content FROM reviews WHERE content LIKE '%salary%' LIMIT 5;"),
    ("Query 5: Extract first 30 characters of review titles", 
     "SELECT id, SUBSTR(title, 1, 30) AS short_title FROM reviews LIMIT 10;"),
    ("Query 6: Find reviews created in the first 10 days of any month", 
     "SELECT id, title, created_at FROM reviews WHERE SUBSTR(created_at, 9, 2) BETWEEN '01' AND '10' LIMIT 10;"),
    ("Query 7: List reviews created in the current year (2026)", 
     "SELECT id, title, created_at FROM reviews WHERE SUBSTR(created_at, 1, 4) = '2026' LIMIT 10;"),
    ("Query 8: Display company creation month", 
     "SELECT name, SUBSTR(created_at, 6, 2) AS month FROM companies LIMIT 10;"),
     
    # Part 3: Two-table Joins
    ("Query 9: Get reviews joined with company names", 
     "SELECT r.title, c.name AS company_name FROM reviews r JOIN companies c ON c.id = r.company_id LIMIT 10;"),
    ("Query 10: Get comments with reviewer names", 
     "SELECT SUBSTR(c.content, 1, 50) AS comment_text, u.name AS author FROM comments c JOIN users u ON u.id = c.user_id LIMIT 10;"),
    ("Query 11: Companies and their industry names", 
     "SELECT c.name, i.name AS industry_name FROM companies c JOIN company_industries ci ON ci.company_id = c.id JOIN industries i ON i.id = ci.industry_id LIMIT 10;"),
    ("Query 12: Reviews with sentiment labels", 
     "SELECT r.title, s.name AS sentiment FROM reviews r JOIN review_sentiments s ON s.id = r.sentiment_id LIMIT 10;"),
    ("Query 13: Votes with review title", 
     "SELECT v.vote_type, r.title FROM votes v JOIN reviews r ON r.id = v.review_id LIMIT 10;"),
    ("Query 14: Reports with review and reporter info", 
     "SELECT p.reason, u.name AS reporter, r.title AS review_title FROM reports p JOIN users u ON u.id = p.user_id JOIN reviews r ON r.id = p.review_id LIMIT 10;"),
     
    # Part 3: Multi-table Joins
    ("Query 15: Company details with locations and industries", 
     "SELECT c.name, GROUP_CONCAT(DISTINCT i.name) AS industries, GROUP_CONCAT(DISTINCT l.name) AS locations FROM companies c LEFT JOIN company_industries ci ON ci.company_id = c.id LEFT JOIN industries i ON i.id = ci.industry_id LEFT JOIN company_location_junction clj ON clj.company_id = c.id LEFT JOIN company_locations l ON l.id = clj.location_id GROUP BY c.id LIMIT 10;"),
    ("Query 16: Review tags with company and sentiment", 
     "SELECT r.title, c.name AS company_name, s.name AS sentiment, GROUP_CONCAT(t.name) AS tags FROM reviews r JOIN companies c ON c.id = r.company_id JOIN review_sentiments s ON s.id = r.sentiment_id LEFT JOIN review_tags rt ON rt.review_id = r.id LEFT JOIN tags t ON t.id = rt.tag_id GROUP BY r.id LIMIT 10;"),
    ("Query 17: User activity summary", 
     "SELECT u.name, COUNT(DISTINCT r.id) AS reviews, COUNT(DISTINCT c.id) AS comments FROM users u LEFT JOIN reviews r ON r.user_id = u.id LEFT JOIN comments c ON c.user_id = u.id GROUP BY u.id LIMIT 10;"),
    ("Query 18: Companies with pending reports", 
     "SELECT DISTINCT c.name, r.title, p.reason FROM reports p JOIN reviews r ON r.id = p.review_id JOIN companies c ON c.id = r.company_id WHERE p.status = 'pending' LIMIT 10;"),
    ("Query 19: Review comment counts", 
     "SELECT r.title, COUNT(c.id) AS comment_count FROM reviews r LEFT JOIN comments c ON c.review_id = r.id GROUP BY r.id LIMIT 10;"),
    ("Query 20: Reviewer vote and report summary", 
     "SELECT u.name, COUNT(DISTINCT v.id) AS votes, COUNT(DISTINCT p.id) AS reports FROM users u LEFT JOIN votes v ON v.user_id = u.id LEFT JOIN reports p ON p.user_id = u.id GROUP BY u.id LIMIT 10;"),
     
    # Part 4: Complex Queries
    ("Query 21: Companies with average rating above 2.5 and more than one review", 
     "SELECT name, avg_rating, total_reviews FROM companies WHERE avg_rating > 2.5 AND total_reviews > 1 LIMIT 10;"),
    ("Query 22: Reviews with negative sentiment and more downvotes than upvotes", 
     "SELECT r.title, r.upvotes, r.downvotes FROM reviews r JOIN review_sentiments s ON s.id = r.sentiment_id WHERE s.name = 'Negative' AND r.downvotes > r.upvotes LIMIT 10;"),
    ("Query 23: Top reviewed companies by review count", 
     "SELECT name, total_reviews FROM companies ORDER BY total_reviews DESC LIMIT 5;"),
    ("Query 24: Users who have made comments but no reviews", 
     "SELECT u.name FROM users u WHERE EXISTS (SELECT 1 FROM comments c WHERE c.user_id = u.id) AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.user_id = u.id) LIMIT 10;"),
    ("Query 25: Reviews that include both 'salary' and 'leadership' tags", 
     "SELECT r.title FROM reviews r JOIN review_tags rt1 ON rt1.review_id = r.id JOIN tags t1 ON t1.id = rt1.tag_id JOIN review_tags rt2 ON rt2.review_id = r.id JOIN tags t2 ON t2.id = rt2.tag_id WHERE t1.name = 'salary' AND t2.name = 'leadership' LIMIT 10;"),
    ("Query 26: Companies with at least one positive review and no pending reports", 
     "SELECT c.name FROM companies c WHERE EXISTS ( SELECT 1 FROM reviews r JOIN review_sentiments s ON s.id = r.sentiment_id WHERE r.company_id = c.id AND s.name = 'Positive' ) AND NOT EXISTS ( SELECT 1 FROM reports p JOIN reviews r ON r.id = p.review_id WHERE r.company_id = c.id AND p.status = 'pending' ) LIMIT 10;"),
    ("Query 27: Reviews with the highest upvote ratio", 
     "SELECT title, upvotes, downvotes, CAST(upvotes AS FLOAT) / NULLIF((upvotes+downvotes),0) AS upvote_ratio FROM reviews WHERE upvotes > 0 ORDER BY upvote_ratio DESC LIMIT 5;"),
    ("Query 28: Tags and their review counts", 
     "SELECT t.name, COUNT(rt.review_id) AS review_count FROM tags t LEFT JOIN review_tags rt ON rt.tag_id = t.id GROUP BY t.id ORDER BY review_count DESC LIMIT 10;"),
    ("Query 29: Average company rating by industry", 
     "SELECT i.name, AVG(c.avg_rating) AS average_rating FROM industries i JOIN company_industries ci ON ci.industry_id = i.id JOIN companies c ON c.id = ci.company_id GROUP BY i.id ORDER BY average_rating DESC LIMIT 10;"),
    ("Query 30: Users with most notifications", 
     "SELECT u.name, COUNT(n.id) AS notifications FROM users u LEFT JOIN notifications n ON n.user_id = u.id GROUP BY u.id ORDER BY notifications DESC LIMIT 10;")
]

def format_markdown_table(headers, rows):
    if not rows:
        return "*No rows returned.*\n"
    
    # Calculate column widths
    widths = [len(h) for h in headers]
    for row in rows:
        for i, val in enumerate(row):
            val_str = str(val) if val is not None else "NULL"
            if len(val_str) > widths[i]:
                widths[i] = len(val_str)
                
    # Build header row
    header_line = "| " + " | ".join(f"{headers[i]:<{widths[i]}}" for i in range(len(headers))) + " |"
    sep_line = "| " + " | ".join("-" * widths[i] for i in range(len(widths))) + " |"
    
    table_lines = [header_line, sep_line]
    for row in rows:
        row_str = "| " + " | ".join(f"{str(row[i]) if row[i] is not None else 'NULL':<{widths[i]}}" for i in range(len(row))) + " |"
        table_lines.append(row_str)
        
    return "\n".join(table_lines) + "\n"

def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    with open(OUTPUT_PATH, "w", encoding="utf-8") as out:
        for title, query in QUERIES:
            out.write(f"### {title}\n\n")
            out.write("```sql\n")
            out.write(query + "\n")
            out.write("```\n\n")
            
            try:
                cursor.execute(query)
                headers = [desc[0] for desc in cursor.description]
                rows = cursor.fetchall()
                
                out.write("#### Result Output:\n\n")
                out.write(format_markdown_table(headers, rows))
                out.write("\n" + "="*80 + "\n\n")
            except Exception as e:
                out.write(f"Error executing query: {e}\n\n")
                out.write("\n" + "="*80 + "\n\n")
                
    conn.close()
    print(f"Executed 30 queries. Results written to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
