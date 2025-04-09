const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const Constants = require('../config/constants');



async function listTopLevelFoldersWithFtpAccess() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Enable logging (optional)

    try {
        await client.access({
            host: "127.0.0.1",
            user: "glen",
            password: "111111",
            secure: false, // Set to true if using FTPS
        });

        console.log("Connected to FTP server.");

        // List all items in the root directory
        const list = await client.list("/");

        // Filter only folders
        const folders = list.filter(item => {
            console.log(item)
            return item.type === ftp.FileType.Directory
        }).map(item => item.name);
        console.log("Top-level folders:", folders);

        return folders;
    } catch (error) {
        console.error("Error:", error);
    } finally {
        client.close();
    }
    return [];
}

const directoryPath = path.resolve(process.cwd(), Constants.ftpPath)

async function listTopLevelFolders() {
    
    try {
        // Read the contents of the directory
        console.log('path is like like like', directoryPath);
        const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });

        // Filter out only directories (folders)
        const folders = files.filter(file => file.isDirectory()).map(file => file.name);

        console.log("Directories found:", folders);
        return folders;
    } catch (err) {
        console.error("Error reading directory:", err);
        return [];
    }

}

async function getAllImagesFromFtpFolder(ftpFolderName) {
    try {
        const folderPath = path.resolve(directoryPath, ftpFolderName);
        // Read the contents of the directory
        const files = fs.readdirSync(folderPath);
    
        // Filter out only image files (e.g., jpg, png, gif)
        const imageFiles = files.filter(file => {
          return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(file);
        });
    
        return imageFiles.map(fileName => {
            return {
                imagePath: path.resolve(folderPath, fileName),
                imageFileName: fileName,
            }
        });
      } catch (err) {
        console.error("Error reading directory:", err);
      }
}

async function deleteFtpFolderAndFiles(ftpFolderName) {
    try {
        const folderPath = path.resolve(directoryPath, ftpFolderName);
        // Check if the directory exists
        if (fs.existsSync(folderPath)) {
            // Read the contents of the directory
            const files = fs.readdirSync(folderPath);
    
            // Delete all files in the directory
            for (const file of files) {
                const filePath = path.join(folderPath, file);
                fs.unlinkSync(filePath);
            }
    
            // Remove the directory itself
            fs.rmdirSync(folderPath);
            console.log(`Deleted folder: ${folderPath}`);
        } else {
            console.log(`Folder does not exist: ${folderPath}`);
        }
    } catch (error) {
        console.error("Error deleting folder:", error);
    }
}

module.exports = {
    listTopLevelFolders,
    getAllImagesFromFtpFolder,
    deleteFtpFolderAndFiles,
}