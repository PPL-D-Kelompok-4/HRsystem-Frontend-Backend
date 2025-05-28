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
  periode DATE NOT NULL,
  gaji_Pokok DECIMAL(10,2) NOT NULL,
  tunjangan DECIMAL(10,2) DEFAULT 0,
  bonus DECIMAL(10,2) DEFAULT 0,
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
  leaveType ENUM('Annual Leave', 'Sick Leave', 'Personal Leave') DEFAULT 'Annual Leave',
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
('Admin User','admin@example.com','081234567890','admin123', 1, 1,'Aktif','2023-01-01'),
('Budi Santoso', 'budi.santoso@example.com', '082509617097', 'password123', 3, 3, 'Cuti', '2022-12-17'),
('Siti Aminah', 'siti.aminah@example.com', '083923448990', 'password123', 2, 1, 'Cuti', '2020-05-29'),
('Agus Salim', 'agus.salim@example.com', '081445912336', 'password123', 3, 3, 'Inaktif', '2022-02-10'),
('Dewi Lestari', 'dewi.lestari@example.com', '089532900546', 'password123', 3, 3, 'Inaktif', '2020-10-02'),
('Rizky Pratama', 'rizky.pratama@example.com', '082272527614', 'password123', 3, 2, 'Cuti', '2022-04-13'),
('Fitri Handayani', 'fitri.handayani@example.com', '087748122060', 'password123', 3, 1, 'Aktif', '2022-01-05'),
('Andi Wijaya', 'andi.wijaya@example.com', '088502600355', 'password123', 1, 2, 'Inaktif', '2019-02-05'),
('Nurul Huda', 'nurul.huda@example.com', '085638099177', 'password123', 1, 3, 'Cuti', '2021-06-22'),
('Dimas Saputra', 'dimas.saputra@example.com', '086307885021', 'password123', 3, 1, 'Cuti', '2022-06-08'),
('Linda Sari', 'linda.sari@example.com', '083730477043', 'password123', 3, 2, 'Aktif', '2023-04-29'),
('Rina Kartika', 'rina.kartika@example.com', '087880718446', 'password123', 3, 3, 'Cuti', '2023-07-20'),
('Taufik Hidayat', 'taufik.hidayat@example.com', '089199405301', 'password123', 3, 1, 'Inaktif', '2019-04-18'),
('Mega Sari', 'mega.sari@example.com', '082915727163', 'password123', 1, 1, 'Aktif', '2024-02-25'),
('Adi Putra', 'adi.putra@example.com', '088059754864', 'password123', 2, 2, 'Cuti', '2021-04-08'),
('Melati Ayu', 'melati.ayu@example.com', '088216728783', 'password123', 1, 3, 'Inaktif', '2023-04-28'),
('Hendra Gunawan', 'hendra.gunawan@example.com', '089084872437', 'password123', 3, 3, 'Aktif', '2021-02-03'),
('Sarah Azzahra', 'sarah.azzahra@example.com', '080352230278', 'password123', 2, 1, 'Inaktif', '2024-12-20'),
('Rama Dwi', 'rama.dwi@example.com', '088208109009', 'password123', 1, 2, 'Inaktif', '2020-09-10'),
('Vina Andriani', 'vina.andriani@example.com', '082472430736', 'password123', 2, 1, 'Aktif', '2021-02-02'),
('Galih Candra', 'galih.candra@example.com', '087712178183', 'password123', 2, 2, 'Aktif', '2022-10-03');

-- Insert sample data for Cuti
INSERT INTO Cuti (employeeID, tanggal_Pengajuan, tanggal_Mulai, tanggal_Selesai, keterangan_Cuti, status, rejectionReason, leaveType) 
VALUES
(1, '2025-04-10', '2025-05-01', '2025-05-03', 'Liburan keluarga', 'Diajukan', '-', 'Annual Leave'),
(1, '2025-04-15', '2025-06-10', '2025-06-12', 'Pernikahan saudara', 'Diajukan', '-', 'Personal Leave'),
(2, '2025-04-12', '2025-05-05', '2025-05-06', 'Sakit flu berat', 'Diajukan', '-', 'Sick Leave'),
(2, '2025-04-20', '2025-07-01', '2025-07-05', 'Cuti tahunan', 'Diajukan', '-', 'Annual Leave'),
(3, '2025-04-14', '2025-05-07', '2025-05-09', 'Acara keluarga', 'Diajukan', '-', 'Personal Leave'),
(4, '2025-04-18', '2025-05-15', '2025-05-17', 'Liburan ke luar kota', 'Diajukan', '-', 'Annual Leave'),
(4, '2025-04-25', '2025-06-20', '2025-06-22', 'Menghadiri seminar', 'Diajukan', '-', 'Personal Leave'),
(5, '2025-04-22', '2025-05-18', '2025-05-20', 'Rawat inap', 'Diajukan', '-', 'Sick Leave'),
(6, '2025-04-08', '2025-05-02', '2025-05-04', 'Kondisi kesehatan', 'Diajukan', '-', 'Sick Leave'),
(6, '2025-04-28', '2025-06-05', '2025-06-07', 'Urusan keluarga', 'Diajukan', '-', 'Personal Leave'),
(7, '2025-04-09', '2025-05-10', '2025-05-12', 'Liburan pribadi', 'Diajukan', '-', 'Annual Leave'),
(8, '2025-04-11', '2025-05-15', '2025-05-17', 'Pemulihan kesehatan', 'Diajukan', '-', 'Sick Leave'),
(8, '2025-04-30', '2025-07-01', '2025-07-03', 'Acara keluarga', 'Diajukan', '-', 'Personal Leave'),
(9, '2025-04-17', '2025-06-01', '2025-06-03', 'Mudik lebaran', 'Diajukan', '-', 'Annual Leave'),
(10, '2025-04-21', '2025-06-15', '2025-06-17', 'Checkup medis', 'Diajukan', '-', 'Sick Leave'),
(10, '2025-04-23', '2025-07-10', '2025-07-12', 'Cuti tahunan', 'Diajukan', '-', 'Annual Leave'),
(11, '2025-04-19', '2025-05-25', '2025-05-27', 'Pernikahan sahabat', 'Diajukan', '-', 'Personal Leave'),
(12, '2025-04-13', '2025-05-20', '2025-05-22', 'Liburan keluarga', 'Diajukan', '-', 'Annual Leave'),
(13, '2025-04-16', '2025-05-30', '2025-06-01', 'Sakit berat', 'Diajukan', '-', 'Sick Leave'),
(14, '2025-04-24', '2025-06-05', '2025-06-06', 'Menghadiri acara keluarga', 'Diajukan', '-', 'Personal Leave'),
(15, '2025-04-27', '2025-06-10', '2025-06-12', 'Liburan luar kota', 'Diajukan', '-', 'Annual Leave');

-- Dummy Gaji
INSERT INTO Gaji (
  employeeID,
  periode,
  gaji_Pokok,
  tunjangan,
  bonus,
  potongan,
  total_Gaji,
  status_Pembayaran
) VALUES
(1, '2025-05-01', 10000000.00, 2000000.00, 1500000.00, 500000.00, 13000000.00, 'Lunas'),
(2, '2025-05-01', 5000000.00, 1000000.00, 500000.00, 250000.00, 6250000.00, 'Belum Lunas'),
(3, '2025-05-01', 7000000.00, 1500000.00, 750000.00, 300000.00, 8950000.00, 'Lunas');