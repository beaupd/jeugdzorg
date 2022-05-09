CREATE TABLE vragenlijsten(
    vragenlijst_id INT ZEROFILL NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(vragenlijst_id),
    naam VARCHAR(255)
);
CREATE TABLE competenties(
    competentie_id INT ZEROFILL NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(competentie_id),
    naam VARCHAR(255),
    vragenlijst_id INT UNSIGNED,
    FOREIGN KEY (vragenlijst_id) REFERENCES vragenlijsten(vragenlijst_id)
);
CREATE TABLE gebruikers(
    gebruiker_id INT ZEROFILL NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(gebruiker_id),
    naam VARCHAR(255),
    email VARCHAR(255)
);
CREATE TABLE vragen(
    vraag_id INT ZEROFILL NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(vraag_id),
    subvragen TEXT,
    vragenlijst_id INT UNSIGNED,
    competentie_id INT UNSIGNED,
    FOREIGN KEY (vragenlijst_id) REFERENCES vragenlijsten(vragenlijst_id),
    FOREIGN KEY (competentie_id) REFERENCES competenties(competentie_id)
);
CREATE TABLE metingen(
    meting_id INT ZEROFILL NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(meting_id),
    actief BIT DEFAULT 0,
    gebruiker_id INT UNSIGNED,
    vragenlijst_id INT UNSIGNED,
    FOREIGN KEY (gebruiker_id) REFERENCES gebruikers(gebruiker_id),
    FOREIGN KEY (vragenlijst_id) REFERENCES vragenlijsten(vragenlijst_id)
);
CREATE TABLE antwoorden(
    antwoord_id INT ZEROFILL NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(antwoord_id),
    antwoord TEXT,
    meting_id INT UNSIGNED,
    vraag_id INT UNSIGNED,
    FOREIGN KEY (meting_id) REFERENCES metingen(meting_id),
    FOREIGN KEY (vraag_id) REFERENCES vragen(vraag_id)
);