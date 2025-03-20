-- Create database
CREATE DATABASE IF NOT EXISTS hrsystem-db;
USE `hrsystem-api-db`;

-- Create Departemen table
CREATE TABLE IF NOT EXISTS Departemen (
  departmentID INT(11) NOT NULL AUTO_INCREMENT,
  nama_Departemen VARCHAR(100) NOT NULL,
  PRIMARY KEY (departmentID)
);

-- Create Jabatan table
CREATE TABLE IF NOT EXISTS Jabatan (
  PositionID INT(11) NOT NULL AUTO_INCREMENT,
  nama_Jabatan VARCHAR(100) NOT NULL,
  gaji_Pokok DECIMAL(10,2) NOT NULL,
  Tunjangan DECIMAL(10,2) DEFAULT 0,
  PRIMARY KEY (PositionID)
);

-- Create Karyawan table
CREATE TABLE IF NOT EXISTS Karyawan (
  employeeID INT(11) NOT NULL AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  no_Telp VARCHAR(15),
  password VARCHAR(255) NOT NULL,
  positionID INT(11) NOT NULL,
  departmentID INT(11) NOT NULL,
  status_Karyawan ENUM('Aktif', 'Non-Aktif') NOT NULL DEFAULT 'Aktif',
  tanggal_Bergabung DATE NOT NULL,
  PRIMARY KEY (employeeID),
  FOREIGN KEY (positionID) REFERENCES Jabatan(PositionID),
  FOREIGN KEY (departmentID) REFERENCES Departemen(departmentID)
);

-- Insert sample data for Departemen
INSERT INTO Departemen (nama_Departemen) VALUES
('Human Resources'),
('Finance'),
('Information Technology'),
('Marketing'),
('Operations');

-- Insert sample data for Jabatan
INSERT INTO Jabatan (nama_Jabatan, gaji_Pokok, Tunjangan) VALUES
('Manager', 10000000.00, 2000000.00),
('Supervisor', 7000000.00, 1500000.00),
('Staff', 5000000.00, 1000000.00),
('Intern', 3000000.00, 500000.00);

-- Insert sample admin user (password: admin123)
INSERT INTO Karyawan (
  nama, 
  email, 
  no_Telp, 
  password, 
  positionID, 
  departmentID, 
  status_Karyawan, 
  tanggal_Bergabung
) VALUES (
  'Admin User',
  'admin@example.com',
  '081234567890',
  'admin123', -- hashed 'admin123'
  1, -- Manager position
  1, -- HR department
  'Aktif',
  '2023-01-01'
);
