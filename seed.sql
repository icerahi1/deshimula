PRAGMA foreign_keys = ON;

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@deshimula.com', 'admin123', 'admin'),
('Regular User', 'user@deshimula.com', 'password123', 'user');

INSERT INTO industries (name) VALUES
('Software'),
('Finance'),
('Education'),
('Health'),
('Startup'),
('Media'),
('Digital Services'),
('Consulting'),
('E-commerce'),
('Remote');

INSERT INTO review_sentiments (name) VALUES
('Negative'),
('Neutral'),
('Positive');

INSERT INTO tags (name) VALUES
('toxic-culture'),
('salary'),
('promotion'),
('leadership'),
('work-life-balance'),
('hr'),
('bias'),
('growth'),
('innovation'),
('pay-delay');

INSERT INTO company_locations (name) VALUES
('Dhaka'),
('Chittagong'),
('Sylhet'),
('Remote'),
('Bangladesh');

INSERT INTO companies (name, slug, description, website, logo_url, avg_rating, total_reviews) VALUES
('BRAC IT', 'brac-it', 'BRAC IT is a social enterprise technology team serving development projects across Bangladesh.', 'https://www.brac.net', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&q=60', 2.2, 2),
('Technovicinity Limited', 'technovicinity-limited', 'A local software services company with a mixed reputation for leadership and pay practices.', 'https://technovicinity.com', 'https://images.unsplash.com/photo-1494178270035-95d46c281991?auto=format&fit=crop&w=500&q=60', 1.8, 2),
('Wedevs', 'wedevs', 'Wedevs builds WordPress, Laravel and Django solutions and serves global brands from Bangladesh.', 'https://wedevs.com', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=60', 2.6, 1),
('Shikho Technologies', 'shikho-technologies', 'Shikho is a growing company focused on education technology in Bangladesh.', 'https://www.shikho.com', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=60', 3.8, 1),
('Portonics Ltd', 'portonics-ltd', 'Portonics provides software development and consulting services in Bangladesh and beyond.', 'https://www.portonics.com.bd', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=60', 1.9, 2),
('Truck Lagbe Ltd.', 'truck-lagbe-ltd', 'Truck Lagbe is a transportation and logistics startup supporting drivers and businesses in Bangladesh.', 'https://trucklagbe.com', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=60', 1.5, 1),
('RedDot Digital', 'reddot-digital', 'RedDot Digital is a digital media and marketing company operating inside a larger telecom ecosystem.', 'https://reddot.digital', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=60', 1.6, 1),
('Sigmative', 'sigmative', 'Sigmative is a Bangladesh-based software company offering web, mobile, and business solutions.', 'https://sigmative.com', 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=500&q=60', 2.5, 1),
('Kona SL', 'kona-sl', 'Kona SL is a small local company with a strong salary reputation but internal politics.', 'https://konasl.com', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=60', 2.0, 1),
('Computer Ease Limited', 'computer-ease-limited', 'Computer Ease Limited is an older technology firm with a mixed history of culture and growth.', 'https://computerease.com', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=60', 3.2, 1);

INSERT INTO company_industries (company_id, industry_id) VALUES
(1, 1),
(1, 5),
(2, 1),
(2, 5),
(3, 1),
(3, 6),
(4, 3),
(4, 1),
(5, 1),
(5, 8),
(6, 10),
(6, 1),
(7, 6),
(7, 8),
(8, 1),
(9, 1),
(10, 1),
(10, 9);

INSERT INTO company_location_junction (company_id, location_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1);

INSERT INTO reviews (guid, title, content, company_id, user_id, sentiment_id, upvotes, downvotes) VALUES
('681cd50ce0407d2029de4fa2', 'A Real Look Inside BRAC IT: What Many Won’t Say Out Loud', '1. Hiring and Promotion Are Not Always Fair. People inside BRAC IT feel hiring and promotions depend on connections more than merit. There is no clear performance review system. 2. Religious Bias Is Present. Some leaders express strong views that make employees uncomfortable. This affects team culture. 3. Speaking Up Is Difficult. There is a sense proper channels are not trusted. Management seems slow to address concerns. 4. Impact Is Mostly Through BRAC. The company highlights social impact but this is closely tied to the organization.', 1, 2, 1, 245, 45),
('681dc61520329a43b2217b8d', 'একটি দুঃস্বপ্নের কোম্পানি', 'এই কোম্পানিতে কাজ করলে বেতন দেরিতে আসে এবং অফিসের পরিবেশ বিষাক্ত। ছুটির ব্যবস্থা কম এবং মানবিক আচরণ কম।', 2, 2, 1, 6, 3),
('681dc54f20329a43b2217974', 'Office politics at its max', 'This company struggles with internal politics and unclear decision making. Team morale is low and communication is often poor.', 3, 2, 1, 10, 8),
('681dc2c220329a43b2217262', 'Everything is super except salary structure', 'Good work-life balance and friendly coworkers. Compensation structure is unclear and raises are slow.', 4, 2, 2, 5, 0),
('681dc1df20329a43b2216f1d', 'Egotistic and spineless: a combination for imminent disaster', 'Portonics has a strong reputation but current leadership is failing to support teams. Decisions feel inconsistent and confidence is low.', 5, 2, 1, 3, 0),
('681dc1da20329a43b2216f00', 'Toxic Environment, Puppet Leadership & Career Destroyer', 'On-time salary and some good teammates, but overall leadership is weak and turnover is high. This is not a place for long-term career growth.', 6, 2, 1, 4, 0),
('681dbab820329a43b2215bcb', 'An organization purely built to secure Robi tax rebates; No vision.', 'A digital services company inside a telecom ecosystem. Growth is uncertain and political pressure is high.', 7, 2, 1, 30, 0),
('681dba3c20329a43b2215ab9', 'Unprofessional admin and HR', 'Local hiring is unclear and HR is often unprofessional, though salary payments are reliable.', 8, 2, 2, 0, 1),
('681db90320329a43b22156fa', 'No Actual Work, Only Time Waste Part - 2', 'Many teams feel directionless and management does not support employee concerns. This makes the environment stressful.', 9, 2, 1, 6, 6),
('681dade720329a43b22145a6', 'ভালো একটি কোম্পানি ধংসের দিকে যাচ্ছে।', 'এই কোম্পানি আগে ভালো ছিল, কিন্তু মালিকদের মধ্যে তর্কের কারণে অভিজ্ঞতা এখন খারাপ। ছুটির ব্যবস্থা অনিশ্চিত।', 10, 2, 2, 0, 0);

INSERT INTO review_tags (review_id, tag_id) VALUES
(1, 1),
(1, 3),
(2, 1),
(2, 6),
(3, 10),
(4, 5),
(5, 4),
(5, 8),
(6, 10),
(7, 8),
(8, 6),
(9, 6),
(10, 4);

INSERT INTO votes (review_id, user_id, vote_type) VALUES
(1, 2, 'up'),
(2, 2, 'down'),
(3, 2, 'down'),
(4, 2, 'up'),
(5, 2, 'down');

INSERT INTO comments (review_id, user_id, content) VALUES
(1, 2, 'This review is detailed and reflects many insider issues.'),
(2, 2, 'আপনার অভিজ্ঞতা শেয়ার করার জন্য ধন্যবাদ।'),
(4, 2, 'Good callout about work-life balance.');

INSERT INTO reports (review_id, user_id, reason) VALUES
(2, 2, 'Potential outdated or misleading content'),
(9, 2, 'Duplicate or unclear content');

INSERT INTO notifications (user_id, message, is_read) VALUES
(2, 'Welcome to DeshiMula! Start by sharing your first experience.', 0),
(1, 'New review has been submitted and is pending admin review.', 0);

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES
(1, 'seed', 'database', 0, 'Initial seed data loaded for DeshiMula platform.'),
(1, 'login', 'user', 1, 'Admin user created for platform administration.');
