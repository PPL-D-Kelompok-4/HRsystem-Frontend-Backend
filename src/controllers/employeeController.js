import pool from "../config/database.js";

// Get all employees
export const getAllEmployees = async (req, res) => {
	try {
		const [rows] = await pool.query(`
      SELECT k.*, d.nama_Departemen, j.nama_Jabatan 
      FROM Karyawan k
      LEFT JOIN Departemen d ON k.departmentID = d.departmentID
      LEFT JOIN Jabatan j ON k.positionID = j.PositionID
    `);

		// Remove password from response
		const employees = rows.map((emp) => {
			const { password, ...employeeWithoutPassword } = emp;
			return employeeWithoutPassword;
		});

		res.json(employees);
	} catch (error) {
		console.error("Error fetching employees:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
	try {
		const { id } = req.params;
		const [rows] = await pool.query(
			`
      SELECT k.*, d.nama_Departemen, j.nama_Jabatan 
      FROM Karyawan k
      LEFT JOIN Departemen d ON k.departmentID = d.departmentID
      LEFT JOIN Jabatan j ON k.positionID = j.PositionID
      WHERE k.employeeID = ?
    `,
			[id]
		);

		if (rows.length === 0) {
			return res.status(404).json({ message: "Employee not found" });
		}

		// Remove password from response
		const { password, ...employeeWithoutPassword } = rows[0];

		res.json(employeeWithoutPassword);
	} catch (error) {
		console.error("Error fetching employee:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Create new employee
export const createEmployee = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const {
            nama,
            email,
            no_Telp,
            password,
            positionID,
            departmentID,
            status_Karyawan,
            tanggal_Bergabung,
        } = req.body;

        if (!nama || !email || !password || !positionID || !departmentID) {
            connection.release();
            return res.status(400).json({
                message: "Name, email, password, position and department are required",
            });
        }

        await connection.beginTransaction();

        const [existingUser] = await connection.query(
            "SELECT * FROM Karyawan WHERE email = ?",
            [email]
        );
        if (existingUser.length > 0) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: "Email already in use" });
        }

        const status = status_Karyawan || "Aktif";
        const joinDate = tanggal_Bergabung || new Date().toISOString().split("T")[0];

        const [result] = await connection.query(
            `INSERT INTO Karyawan (
                nama, email, no_Telp, password, positionID, departmentID, status_Karyawan, tanggal_Bergabung
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nama, email, no_Telp, password, positionID, departmentID, status, joinDate]
        );

        const employeeID = result.insertId;

        const [posDetails] = await connection.query(
            `SELECT gaji_Pokok, Tunjangan FROM Jabatan WHERE PositionID = ?`,
            [positionID]
        );

        if (posDetails.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: "Invalid position ID: no salary info found" });
        }

        const { gaji_Pokok, Tunjangan } = posDetails[0];
        const bonus = 0;
        const potongan = 0;
        const total_Gaji = parseFloat(gaji_Pokok) + parseFloat(Tunjangan);
        const periode = new Date().toISOString().split("T")[0];

        await connection.query(
            `INSERT INTO Gaji (
                employeeID, periode, gaji_Pokok, tunjangan, bonus, potongan, total_Gaji, status_Pembayaran
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [employeeID, periode, gaji_Pokok, Tunjangan, bonus, potongan, total_Gaji, "Belum Lunas"]
        );

        await connection.commit();
        connection.release();

        res.status(201).json({
            message: "Employee and salary record created successfully",
            employeeID,
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        console.error("Error creating employee:", error);
        res.status(500).json({ message: "Server error during employee creation" });
    }
};


// Update employee status only
export const updateEmployeeStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status_Karyawan } = req.body;

		if (!status_Karyawan) {
			return res.status(400).json({ message: "Status is required" });
		}

		const [result] = await pool.query(
			"UPDATE Karyawan SET status_Karyawan = ? WHERE employeeID = ?",
			[status_Karyawan, id]
		);

		if (result.affectedRows === 0) {
			return res
				.status(404)
				.json({ message: "Employee not found or status not updated" });
		}

		res.json({ message: "Employee status updated successfully" });
	} catch (error) {
		console.error("Error updating employee status:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Update employee
export const updateEmployee = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			nama,
			email,
			no_Telp,
			password,
			positionID,
			departmentID,
			status_Karyawan,
			tanggal_Bergabung,
		} = req.body;

		// Check if employee exists
		const [employee] = await pool.query(
			"SELECT * FROM Karyawan WHERE employeeID = ?",
			[id]
		);
		if (employee.length === 0) {
			return res.status(404).json({ message: "Employee not found" });
		}

		// Check if email is being changed and if it already exists
		if (email && email !== employee[0].email) {
			const [existingUser] = await pool.query(
				"SELECT * FROM Karyawan WHERE email = ? AND employeeID != ?",
				[email, id]
			);
			if (existingUser.length > 0) {
				return res.status(400).json({ message: "Email already in use" });
			}
		}

		// Prepare update data
		const updateData = {
			nama: nama || employee[0].nama,
			email: email || employee[0].email,
			no_Telp: no_Telp || employee[0].no_Telp,
			password: password || employee[0].password,
			positionID: positionID || employee[0].positionID,
			departmentID: departmentID || employee[0].departmentID,
			status_Karyawan: status_Karyawan || employee[0].status_Karyawan,
			tanggal_Bergabung: tanggal_Bergabung || employee[0].tanggal_Bergabung,
		};

		// Build query dynamically
		const fields = Object.keys(updateData)
			.filter((key) => updateData[key] !== undefined)
			.map((key) => `${key} = ?`);

		const values = Object.keys(updateData)
			.filter((key) => updateData[key] !== undefined)
			.map((key) => updateData[key]);

		// Add ID to values array
		values.push(id);

		const [result] = await pool.query(
			`UPDATE Karyawan SET ${fields.join(", ")} WHERE employeeID = ?`,
			values
		);

		res.json({ message: "Employee updated successfully" });
	} catch (error) {
		console.error("Error updating employee:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Delete employee
export const deleteEmployee = async (req, res) => {
	const connection = await pool.getConnection();
	try {
		const { id } = req.params;

		await connection.beginTransaction();

		const [employee] = await connection.query(
			"SELECT * FROM Karyawan WHERE employeeID = ?",
			[id]
		);

		if (employee.length === 0) {
			await connection.rollback();
			connection.release();
			return res.status(404).json({ message: "Employee not found" });
		}

		await connection.query("DELETE FROM Gaji WHERE employeeID = ?", [id]);

		await connection.query("DELETE FROM Karyawan WHERE employeeID = ?", [id]);

		await connection.commit();
		connection.release();

		res.json({ message: "Employee and salary records deleted successfully" });
	} catch (error) {
		if (connection) {
			await connection.rollback();
			connection.release();
		}
		console.error("🔥 Error deleting employee:", error);
		res.status(500).json({ message: "Server error during deletion" });
	}
};


