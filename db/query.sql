CREATE TABLE Album (AlbumID INT PRIMARY KEY,
                    AlbumName TEXT NOT NULL);
CREATE TABLE Artist (ArtistID INT PRIMARY KEY, 
                     ArtistName  TEXT NOT NULL);
CREATE TABLE Song (id INT PRIMARY KEY, 
                   Name TEXT NOT NULL, 
                   ArtistID INT NOT NULL, 
                   AlbumID INT NOT NULL, 
                   FileLocation TEXT NOT NULL,
                   FOREIGN KEY(ArtistID) REFERENCES Artist(ArtistID),
                   FOREIGN KEY(AlbumID) REFERENCES Album(AlbumID));

-- INSERT INTO Song Values(1,"A_Walk", 1, 1, "/music/AWalk.mp3");
-- INSERT INTO Album Values(1, "Dive");
-- INSERT INTO Artist Values(1, "Tycho");