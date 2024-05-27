package com.grvtech.cdis.util;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.security.Security;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;
import java.util.Vector;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.NoSuchProviderException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MailDateFormat;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class MailTool {
	
	@org.springframework.beans.factory.annotation.Value("${filesfolder}")
	private String filesFolder;
	
	@Autowired
	FileTool ft;
	
	public MailTool() {
		super();
	}

	public boolean sendMailText(String subject,String body,String to){
		boolean result = false;
		Session mailSession = null;
        Properties props = new Properties();
        
        
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.host", ft.getEmailProperty("smtp.host"));
        props.put("mail.smtp.port", ft.getEmailProperty("smtp.port"));
        
        /*local config*/
        props.setProperty("mail.smtp.user", ft.getEmailProperty("smtp.user"));
        props.setProperty("mail.smtp.pass", ft.getEmailProperty("smtp.pass"));
        
        /*local config*/
        
        mailSession = Session.getDefaultInstance(props, null);
        
 
        Transport transport;
		try {
			transport = mailSession.getTransport();
			MimeMessage message = new MimeMessage(mailSession);
			message.setContent(body, "text/plain");
			message.setSubject(subject);
			message.setFrom(ft.getEmailProperty("smtp.from"));
			message.addRecipient(Message.RecipientType.TO,   new InternetAddress(to));
			//message.addRecipient(Message.RecipientType.BCC,   new InternetAddress("radu@grvtech.ca"));
			//transport.connect(FileTool.getEmailProperty("smtp.user"), FileTool.getEmailProperty("smtp.pass"));
			transport.connect();
	        transport.sendMessage(message,message.getRecipients(Message.RecipientType.TO));
		    transport.close();
		    result = true;
		} catch (NoSuchProviderException e) {
			e.printStackTrace();
		} catch (MessagingException e) {
			e.printStackTrace();
		}
		/**/
        return result;
    }

	public boolean sendMailAtach(String subject,String body,String to,Vector atach){
		boolean result = false;
        Properties props = new Properties();
        props.setProperty("mail.transport.protocol", "smtp");
        props.setProperty("mail.host", "smtp.vincelli.com");
        Session mailSession = Session.getDefaultInstance(props, null);
        Transport transport;
        
		try {
			transport = mailSession.getTransport();
			MimeMessage message = new MimeMessage(mailSession);
			BodyPart mbp = new MimeBodyPart();
			
			mbp.setText(body);
			Multipart multi = new MimeMultipart();
			multi.addBodyPart(mbp);
			for(int i=0;i<atach.size();i++){
				mbp = new MimeBodyPart();
				DataSource ds = new FileDataSource((File)atach.elementAt(i));
				mbp.setDataHandler(new DataHandler(ds));
				mbp.setFileName(((File)atach.elementAt(i)).getName());
				multi.addBodyPart(mbp);
			}
			message.setContent(multi);
			MailDateFormat mdf = new MailDateFormat();
			message.setSentDate(new Date());
			message.setSubject(subject);
			message.setFrom(ft.getEmailProperty("smtp.from"));
			message.addRecipient(Message.RecipientType.TO,   new InternetAddress(to));
			transport.connect();
	        transport.sendMessage(message,message.getRecipients(Message.RecipientType.TO));
		    transport.close();
		    result = true;
		} catch (NoSuchProviderException e) {
			
		} catch (MessagingException e) {
			
		}
        return result;
        }

	
	//Method to replace the values for keys
	private  String readEmailFromHtml(String filePath, Map<String, String> input){
		
	    String msg = ft.readContentFromFile(filePath);
	    try{
	    Set<Entry<String, String>> entries = input.entrySet();
		    for(Map.Entry<String, String> entry : entries) {
		        msg = msg.replace(entry.getKey().trim(), entry.getValue().trim());
		    }
	    }catch(Exception exception){
	        exception.printStackTrace();
	    }
	    return msg;
	}
	 
	
	
	public void sendMailInHtml(String subject, String htmlMessage, String to){
		 
	 try {
		 
	 		//Email data 
           final String Email_Id = ft.getEmailProperty("smtp.user");        //change to your email ID
           final String password = ft.getEmailProperty("smtp.pass");                 //change to your password
           String recipient_mail_id = to;   //change to recipient email id
           String mail_subject = subject;
            
            
           //Set mail properties
            Properties props = System.getProperties();
            props.put("mail.transport.protocol", "smtp");
            
            if(ft.getEmailProperty("smtp.tls").equals("true")){
            	props.put("mail.smtp.starttls.enable", "true");
            	props.put("mail.smtp.ssl.trust", ft.getEmailProperty("smtp.host"));
            	props.put("mail.smtp.auth", "true");
	            props.put("mail.debug", "false");
            }
            
            props.put("mail.smtp.host", ft.getEmailProperty("smtp.host"));
            props.put("mail.smtp.port", ft.getEmailProperty("smtp.port"));
	            
	        Session session = Session.getInstance(props,
	                new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(Email_Id, password);
                }
            });
	        session.setDebug(true); // Enable the debug mode
	        
	        
	        MimeMessage message = new MimeMessage(session);
	        
	        
	         try {
	            //Set email data 
	            message.setFrom(new InternetAddress(ft.getEmailProperty("smtp.from")));
	            message.addRecipient(Message.RecipientType.TO,new InternetAddress(recipient_mail_id));
	            message.addRecipient(Message.RecipientType.CC,new InternetAddress(ft.getEmailProperty("admin.cc")));
	            message.setSubject(mail_subject);
	            MimeMultipart multipart = new MimeMultipart();
	            BodyPart messageBodyPart = new MimeBodyPart();
	            
	            String templatePath = "";
	            InitialContext ic;
				try {
					ic = new InitialContext();
					//String rf = (String) ic.lookup("root-folder");
					//String rf = filesFolder;
					templatePath = filesFolder;
					//String messagEmail = "<b><p>Hello Administrator</p></b><p>New user is subscribed to CDIS.<br>Login to CDIS and go to Users section.<br>Click on the button pending users to see the users that subscribed to CDIS but are not active yet.Click on the user to select it and click on the button Activate to allow the user to log in to CDIS.<br><br><b>An email will be sent to the user to annouce the activation.</b></p>";
					//MailTool.sendMailInHtml("CDIS New User Subscribe", messagEmail, "support@grvtech.ca", templatePath);
				} catch (NamingException e) {
					e.printStackTrace();
				}
	            
	            
	            
	            //Set key values
	            Map<String, String> input = new HashMap<String, String>();
	               input.put("{MESSAGE}", htmlMessage);
	               //input.put("Topic", "HTML Template for Email");
	               //input.put("Content In", "English");
	             
	            //HTML mail content
	            String template = templatePath + System.getProperty("file.separator")+ "mail.template.html";
	            String logo = templatePath + System.getProperty("file.separator")+ "logo-front.png";
	            String htmlText = readEmailFromHtml(template,input);
	            messageBodyPart.setContent(htmlText, "text/html");
	            multipart.addBodyPart(messageBodyPart);
	            
	            
	         // second part (the image)
	            BodyPart messageBodyPart1 = new MimeBodyPart();
	            DataSource fds = new FileDataSource(logo);

	            messageBodyPart1.setDataHandler(new DataHandler(fds));
	            messageBodyPart1.setHeader("Content-ID", "<image>");
	            
	            multipart.addBodyPart(messageBodyPart1); 
	            message.setContent(multipart);
	 
	            //Conect to smtp server and send Email
	            Transport transport = session.getTransport("smtp");            
	            transport.connect(ft.getEmailProperty("smtp.host"), Email_Id, password);
	            transport.sendMessage(message, message.getAllRecipients());
	            transport.close();
	         
	        }catch (MessagingException ex) {
	                Logger.getLogger(MailTool.class.getName()).log(Level.SEVERE, null, ex);
	        }catch (Exception ae) {
	            ae.printStackTrace();
	        }    
	   }catch(Exception exception){
            exception.printStackTrace();
       }
	}
}
