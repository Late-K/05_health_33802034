# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99), ('The Alchemist', 11.95), ('The King In Yellow', 4.99) ;

INSERT INTO users(username, first_name, last_name, email, hashedPassword)VALUES('gold', 'Gold', 'Smiths', 'mrsmiths@gold.ac.uk', '$2b$10$SjSuhEEhIAkyTrmcNtNl1eIrPEWzlxk5T45KtnNuDXX/dShj97F2m');