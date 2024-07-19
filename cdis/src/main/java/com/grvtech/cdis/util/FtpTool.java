package com.grvtech.cdis.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPConnectionClosedException;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.io.CopyStreamException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;



@Service
public class FtpTool {

	Logger logger = LogManager.getLogger(FtpTool.class);
	
	@Value("${ftp.chisasibi}")
	private String ftpChisasibi;
	
	@Value("${ftp.chisasibi.user}")
	private String ftpChisasibiUser;
	
	@Value("${ftp.chisasibi.password}")
	private String ftpChisasibiPassword;
	
	@Value("${ftp.chibougamou}")
	private String ftpChibougamou;
	
	@Value("${ftp.chibougamou.user}")
	private String ftpChibougamouUser;
	
	@Value("${ftp.chibougamou.password}")
	private String ftpChibougamouPassword;
	
	
	public boolean putFile(String localFilePath, String place) {
		boolean result = false;
        //String server = "10.76.105.79";
		//String server = "192.168.2.220";
		
        int port = 21;
        //String user = "18technocentre\\cdis";
        //String pass = "cdis2015";
        //String pass = "andrei07";
        
        String server = ftpChisasibi;
        String user = ftpChisasibiUser;
        String pass = ftpChisasibiPassword;

        
        
        if(place.equals("chisasibi")){
        	//server = ftpChisasibi;
            //user = ftpChisasibiUser;
            //pass = ftpChisasibiPassword;
            
        	server = ftpChisasibi;
        	user = ftpChisasibiUser;
        	pass = ftpChisasibiPassword;
        }else if(place.equals("chibougamou")){
        	//server = ftpChibougamou;
            //user = ftpChibougamouUser;
            //pass = ftpChibougamouPassword;
            
        	//server = ftpChibougamou;
        	//user = ftpChibougamouUser;
        	//pass = ftpChibougamouPassword;
        	
        	server = "10.68.32.48";
            user = "omnitechr10\\omniftp";
            pass = "ImportExport";
        	
        }else{
        	return false;
        }
        
        logger.info("FTP TO SITE : "+place);
        FTPClient ftpClient = new FTPClient();
        try {
        	
            ftpClient.connect(server, port);
            boolean p0 = ftpClient.login(user, pass);
            ftpClient.enterLocalPassiveMode();
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            logger.info("CONNECTION SUCCESS TO  : "+place+ " "+p0);
            // APPROACH #1: uploads first file using an InputStream
            File firstLocalFile = new File(localFilePath);
            //ftpClient.changeWorkingDirectory("ftpscaner");
            boolean p1 = ftpClient.changeWorkingDirectory("IN");
            logger.info("CHANGING DIRECTORY TO  : IN "+place+ "  "+p1);
            //ftpClient.changeWorkingDirectory("IN");
            
            String firstRemoteFile = "cdis_ramq.csv";
 
            InputStream inputStream = new FileInputStream(firstLocalFile);
            
            try {
            	result = ftpClient.storeFile(firstRemoteFile, inputStream);
            	
            }catch(CopyStreamException ex ) {
            	logger.info(ex.getMessage());
            	ex.printStackTrace();
            }catch(IOException ex1 ) {
            	logger.info(ex1.getMessage());
            	ex1.printStackTrace();
            }
            
            logger.info("COPY FILE TO   : IN "+place);
            logger.info("COPY FILE FROM    "+firstLocalFile.getAbsolutePath());
            
            inputStream.close();
            
            if (result) {
            	logger.info("Upload file with success on "+place);
            }
 
        } catch (IOException ex) {
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
	
	
	
	public boolean getFile(String localFilePath, String place) {
		
		boolean result = false;
		
		/*
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
		*/
		
		int port = 21;
        String server = ftpChisasibi;
        String user = ftpChisasibiUser;
        String pass = ftpChisasibiPassword;

        
		if(place.equals("chisasibi")){
        	//server = ftpChisasibi;
            //user = ftpChisasibiUser;
            //pass = ftpChisasibiPassword;
            
			server = "10.76.105.79";
            user = "18technocentre\\cdis";
            pass = "cdis2015";
        }else if(place.equals("chibougamou")){
        	//server = ftpChibougamou;
            //user = ftpChibougamouUser;
            //pass = ftpChibougamouPassword;
            /*
        	server = ftpChibougamou;
        	user = ftpChibougamouUser;
        	pass = ftpChibougamouPassword;
        	*/
        	server = "10.68.32.48";
            user = "omnitechr10\\omniftp";
            pass = "ImportExport";
        }else{
        	return false;
        }
       
 
        FTPClient ftpClient = new FTPClient();
        try {
 
            ftpClient.connect(server, port);
            boolean p0 = ftpClient.login(user, pass);
            ftpClient.enterLocalPassiveMode();
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            
 
            // APPROACH #1: uploads first file using an InputStream
            File firstLocalFile = new File(localFilePath);
            
            //System.out.println("++++++++++++++++++++++++++++++++++++++++");
			//System.out.println("change directory for local ftp from ftpscanner");
			//ftpClient.changeWorkingDirectory("ftpscaner");
			//System.out.println("++++++++++++++++++++++++++++++++++++++++");
            
            boolean p1= ftpClient.changeWorkingDirectory("OUT");
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
            
            if(!remoteFile.equals("")){
            	result = ftpClient.retrieveFile(remoteFile, output);
            }
            //close output stream
            output.close();
            
            if (result) {
                logger.info("file was downloaded successfuly from "+place);
            }
 
        } catch (IOException ex) {
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
