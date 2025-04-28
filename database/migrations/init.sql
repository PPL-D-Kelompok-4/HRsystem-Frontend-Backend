-- Create database
CREATE DATABASE IF NOT EXISTS `hrsystem-api-db`;
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
  status_Karyawan ENUM('Aktif', 'Inaktif', 'Cuti') NOT NULL DEFAULT 'Aktif',
  tanggal_Bergabung DATE NOT NULL,
  PRIMARY KEY (employeeID),
  FOREIGN KEY (positionID) REFERENCES Jabatan(PositionID),
  FOREIGN KEY (departmentID) REFERENCES Departemen(departmentID)
);

-- Create Gaji table
CREATE TABLE IF NOT EXISTS Gaji (
  payrollID INT(11) NOT NULL AUTO_INCREMENT,
  employeeID INT(11) NOT NULL,
  bulan DATE NOT NULL,
  tahun DATE NOT NULL,
  gaji_Pokok DECIMAL(10,2) NOT NULL,
  tunjangan DECIMAL(10,2) DEFAULT 0,
  potongan DECIMAL(10,2) DEFAULT 0,
  total_Gaji DECIMAL(10,2) NOT NULL,
  status_Pembayaran ENUM('Lunas', 'Belum Lunas') NOT NULL DEFAULT 'Belum Lunas',
  PRIMARY KEY (payrollID),
  FOREIGN KEY (employeeID) REFERENCES Karyawan(employeeID)
);

-- Create Cuti table
CREATE TABLE IF NOT EXISTS Cuti (
  leaveID INT(11) NOT NULL AUTO_INCREMENT,
  employeeID INT(11) NOT NULL,
  tanggal_Pengajuan DATE NOT NULL,
  tanggal_Mulai DATE NOT NULL,
  tanggal_Selesai DATE NOT NULL,
  keterangan_Cuti VARCHAR(100),
  status ENUM('Diajukan', 'Disetujui', 'Ditolak') NOT NULL DEFAULT 'Diajukan',
  rejectionReason VARCHAR(255) DEFAULT '-',
  leaveType ENUM('Annual Leave', 'Sick Leave', 'Personal Leave',) DEFAULT 'Annual Leave',
  PRIMARY KEY (leaveID),
  FOREIGN KEY (employeeID) REFERENCES Karyawan(employeeID)
);

-- Create Kehadiran table
CREATE TABLE IF NOT EXISTS Kehadiran (
  attendanceID INT(11) NOT NULL AUTO_INCREMENT,
  employeeID INT(11) NOT NULL,
  tanggal DATE NOT NULL,
  jam_Masuk TIME,
  jam_Keluar TIME,
  status ENUM('Hadir', 'Izin', 'Sakit', 'Cuti') NOT NULL,
  PRIMARY KEY (attendanceID),
  FOREIGN KEY (employeeID) REFERENCES Karyawan(employeeID)
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
) VALUES 
(
  'Admin User',
  'admin@example.com',
  '081234567890',
  'admin123', -- seharusnya hashed, tapi contoh saja
  1, -- Manager position
  1, -- HR department
  'Aktif',
  '2023-01-01'
),
(
  'User Dua',
  'user2@example.com',
  '081234567891',
  'user2123', -- contoh password
  2, -- Supervisor position
  2, -- Finance department
  'Aktif',
  '2023-02-01'
),
(
  'User Tiga',
  'user3@example.com',
  '081234567892',
  'user3123', -- contoh password
  3, -- Staff position
  3, -- IT department
  'Aktif',
  '2023-03-01'
),
(
  'User Empat',
  'user4@example.com',
  '081234567893',
  'user4123', -- contoh password
  4, -- Intern position
  4, -- Marketing department
  'Aktif',
  '2023-04-01'
);

-- Insert sample data for Cuti
INSERT INTO Cuti (employeeID, tanggal_Pengajuan, tanggal_Mulai, tanggal_Selesai, keterangan_Cuti, status, rejectionReason, leaveType) VALUES
(1, '2023-01-01', '2023-01-05', '2023-01-10', 'Cuti Sakit', 'Disetujui', '-', 'Sick Leave'),
(2, '2023-01-10', '2023-01-15', '2023-01-20', 'Cuti Ijin', 'Diajukan', '-', 'Personal Leave'),
(3, '2023-01-15', '2023-01-20', '2023-01-25', 'Cuti Sakit', 'Ditolak', 'Kurang dokumen pendukung', 'Sick Leave'),
(4, '2023-01-20', '2023-01-25', '2023-01-30', 'Cuti Ijin', 'Disetujui', '-', 'Personal Leave');

