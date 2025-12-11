# Insert data into the tables

USE health;

INSERT INTO users (username, first_name, last_name, email, password_hash)
VALUES 
('Cool Dude', 'Cool', 'Dude', 'cool@gmail.com', '$2b$10$MKZTIheU4RHW3QRLRsFV7uj12CGW2/04hCSVEq20ZVzdxdb6UmZB'),
('Hot Gal', 'Hot', 'Gal', 'hot@yahoo.co.uk', '$2b$10$NAmdZLOIx5t0LR5apQqnaeehux.vTz6fZygB11Fym8ejbQ.Vhl8au'),
('JeremiK', 'Jeremi', 'Kiermasz', 'kier@gmail.com', '$2b$10$kH9d9I0eatqXU3/6He1PbepH3umpOcqJlpwp6k8sp.NEubYFFQzr.'),
('Anonymous', '', '', 'anon@outlook.ac.uk', '$2b$10$nTHlg1SyyRwhE6g5yS/ciOiEVfOAMMbbzN0g/b6uI.4ND88wC5LeC'),
('gold', 'Gold', 'Smiths', 'smiths@gold.ac.uk', '$2b$10$MOpxQFlttx9jMAgejN3gneJKEt7A4WAVqKWPsJDV6g.pTZyHn5VGO'),
('CHEESELORD', 'CHEESE', 'LORD', 'cheese@lord.com', '$2b$10$qrv0P7oDwkXlHmPNt5LbV.3cLhnNib4AkeAn1GQMK/o53FgNKnYSC'),

INSERT INTO foods (user_id, name, calories)
VALUES
(1, 'Oatmeal', 150),
(1, 'Banana', 105),
(1, 'Grilled Chicken Breast', 220),

(2, 'Protein Shake', 180),
(2, 'Avocado Toast', 250),

(3, 'Greek Yogurt', 100),
(3, 'Salmon Fillet', 350),
(3, 'Brown Rice', 216),

(4, 'Apple', 95),
(4, 'Spaghetti Bolognese', 410),

(5, 'Beef Burrito', 430),
(5, 'Mixed Nuts', 170);

(6, 'CHEESE', 999),

INSERT INTO food_log (user_id, food_id, quantity, date_eaten)
VALUES
(1, 1, 1, '2025-12-10'), 
(1, 2, 2, '2025-12-10'), 
(1, 3, 1, '2025-12-09'), 

(2, 1, 1, '2025-12-11'), 
(2, 1, 1, '2025-11-11'),
(2, 2, 1, '2025-12-10'),

(3, 2, 1, '2025-12-09'),
(3, 1, 1, '2025-12-09'),
(3, 3, 1.5, '2025-11-08'),

(4, 2, 1, '2025-09-12'),
(4, 2, 1, '2025-10-12'),
(4, 2, 2, '2025-11-11'),

(5, 1, 999, '2025-12-10'),
(5, 1, 999, '2025-12-11'),
(5, 1, 999, '2025-12-12'),