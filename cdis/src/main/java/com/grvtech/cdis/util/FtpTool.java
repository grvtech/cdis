package com.grvtech.cdis.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;

public class FtpTool {

	public static boolean putFile(String localFilePath, String place) {
		boolean result = false;
		
		
        //String server = "10.76.105.79";
		String server = "192.168.2.220";
        int port = 21;
        //String user = "18technocentre\\cdis";
        //String pass = "cdis2015";
        String user = "radu";
        String pass = "andrei07";
        
        if(place.equals("chisasibi")){
        	//server = "10.76.105.79";
            //user = "18technocentre\\cdis";
            //pass = "cdis2015";
            
            server = "192.168.2.220";
            user = "radu";
            pass = "andrei07";
        }else if(place.equals("chibougamou")){
        	//server = "10.68.32.48";
            //user = "omnitechr10\\omniftp";
            //pass = "ImportExport";
            
        	server = "192.168.2.220";
            user = "radu";
            pass = "andrei07";
        }else{
        	return false;
        }
        
        FTPClient ftpClient = new FTPClient();
        try {
 
            ftpClient.connect(server, port);
            ftpClient.login(user, pass);
            ftpClient.enterLocalPassiveMode();
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
 
            // APPROACH #1: uploads first file using an InputStream
            File firstLocalFile = new File(localFilePath);
            ftpClient.changeWorkingDirectory("ftpscaner");
            ftpClient.changeWorkingDirectory("IN");
            //ftpClient.changeWorkingDirectory("IN");
            
            String firstRemoteFile = "cdis_ramq.csv";
 
            InputStream inputStream = new FileInputStream(firstLocalFile);
 
            System.out.println("Start uploading first file");
            result = ftpClient.storeFile(firstRemoteFile, inputStream);
            System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++");
            System.out.println(result);
            System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++");
            inputStream.close();
            if (result) {
                System.out.println("The first file is uploaded successfully.");
            }
 
        } catch (IOException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        } finally {
            try {
                if (ftpClient.isConnected()) {
                    ftpClient.logout();
                    ftpClient.disconnect();
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
        
        return result;
    }
	
	
	
	public static boolean getFile(String localFilePath, String place) {
		
		boolean result = false;
		
		 String server = "10.76.105.79";
	        int port = 21;
	        String user = "18technocentre\\cdis";
	        String pass = "cdis2015";
	        
	        if(place.equals("chisasibi")){
	        	server = "10.76.105.79";
	            user = "18technocentre\\cdis";
	            pass = "cdis2015";
	        }else if(place.equals("chibougamou")){
	        	server = "10.68.32.48";
	            user = "omnitechr10\\omniftp";
	            pass = "ImportExport";
	        }else{
	        	return false;
	        }
		
       
 
        FTPClient ftpClient = new FTPClient();
        try {
 
            ftpClient.connect(server, port);
            ftpClient.login(user, pass);
            ftpClient.enterLocalPassiveMode();
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
 
            // APPROACH #1: uploads first file using an InputStream
            File firstLocalFile = new File(localFilePath);
            ftpClient.changeWorkingDirectory("OUT");
            //ftpClient.changeWorkingDirectory("OUT");
            
            String firstRemoteFile = "CDIS Results.csv";
            String firstRemoteFileAlt = "CDIS_Results.csv";
            
          //get output stream
            OutputStream output;
            output = new FileOutputStream(localFilePath);
            
            String remoteFile = "";
            
            FTPFile[] files = ftpClient.listFiles();
            for(int i=0; i<files.length;i++){
            	FTPFile f = files[i];
            	if(f.getName().toLowerCase().equals(firstRemoteFile.toLowerCase())){
            		remoteFile = f.getName();
            	}else if(f.getName().toLowerCase().equals(firstRemoteFileAlt.toLowerCase())){
            		remoteFile = f.getName();
            	}
            }
            
            System.out.println("The file to download : "+remoteFile);
            if(!remoteFile.equals("")){
            	System.out.println("Start downloading first file");
            	result = ftpClient.retrieveFile(remoteFile, output);
            }
            //close output stream
            output.close();
            
            if (result) {
                System.out.println("The first file is downloaded successfully.");
            }
 
        } catch (IOException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        } finally {
            try {
                if (ftpClient.isConnected()) {
                    ftpClient.logout();
                    ftpClient.disconnect();
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
        
        return result;
    }
	
}
